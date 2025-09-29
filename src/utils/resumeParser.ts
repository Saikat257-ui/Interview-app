import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ResumeData } from '../types';

// PDF.js worker - set workerSrc to a CDN-hosted worker so getDocument can run in the browser.
// Using a CDN avoids bundler-specific worker wiring issues in dev and production.
try {
  // Prefer a locally hosted worker (place the matching pdf.worker.min.js in /public) to avoid CDN/module fetch issues.
  // Fallback to CDN if local worker isn't available in the hosting environment.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  // Note: If you don't host a local worker, the app will try the CDN fallback below.
} catch (e) {
  // If setting workerSrc fails, we'll attempt to parse and let the error handler return a friendly fallback.
  // Avoid noisy console errors during normal app operation.
}

// If a local worker is not available at runtime, some environments may still fail to load it.
// As a secondary measure, set the CDN worker to match the installed pdfjs-dist version.
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.4.149/build/pdf.worker.min.js';
  }
} catch (e) {
  // ignore
}

export const parsePDF = async (file: File): Promise<ResumeData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Try to parse PDF, but handle worker loading errors gracefully
    let fullText = '';

    try {
      let pdf;
      try {
        // Try the normal worker-based parsing first
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      } catch (workerError) {
        // If worker loading or fetch failed (common in dev/CDN mismatch), retry without a worker
        // Worker-based PDF parsing failed, retrying without worker
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          pdf = await pdfjs.getDocument({ data: arrayBuffer, disableWorker: true }).promise;
        } catch (noWorkerError) {
          // PDF parsing without worker also failed
          throw noWorkerError;
        }
      }

      for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) { // Limit to first 5 pages
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => {
              if ('str' in item && typeof item.str === 'string') {
                return item.str;
              }
              return '';
            })
            .join(' ');
          fullText += pageText + '\n';
        } catch (pageError) {
          // Failed to parse page
          fullText += `[Page ${i} could not be parsed]\n`;
        }
      }
    } catch (pdfError) {
      // PDF parsing failed, using fallback method
      // Return basic info and let user fill in manually
      return {
        text: 'PDF content could not be fully extracted. Please verify your information below.',
        name: '',
        email: '',
        phone: ''
      };
    }

    if (!fullText.trim()) {
      return {
        text: 'No text content found in PDF. Please enter your information manually.',
        name: '',
        email: '',
        phone: ''
      };
    }

    return extractContactInfo(fullText);
  } catch (error) {
    // Error parsing PDF
    return {
      text: 'PDF parsing encountered an error. Please enter your information manually.',
      name: '',
      email: '',
      phone: ''
    };
  }
};

export const parseDOCX = async (file: File): Promise<ResumeData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return extractContactInfo(result.value);
  } catch (error) {
    // Error parsing DOCX
    throw new Error('Failed to parse DOCX file');
  }
};

const extractContactInfo = (text: string): ResumeData => {
  const data: ResumeData = { text };

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    data.email = emailMatch[0];
  }

  // Extract phone number (various formats)
  const phoneRegex = /(\+\d{1,3}[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    data.phone = phoneMatch[0];
  }

  // Extract name (look for first line or common patterns)
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 0) {
    // Simple heuristic: first non-empty line might be the name
    const firstLine = lines[0].trim();
    if (firstLine.length > 0 && firstLine.length < 100 && !firstLine.includes('@')) {
      data.name = firstLine;
    }
  }

  return data;
};

export const parseResumeFile = async (file: File): Promise<ResumeData> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  let result: ResumeData;
  switch (fileExtension) {
    case 'pdf':
      result = await parsePDF(file);
      break;
    case 'docx':
      result = await parseDOCX(file);
      break;
    default:
      throw new Error('Unsupported file format. Please upload PDF or DOCX files only.');
  }

  return result;
};

export const getMissingFields = (data: ResumeData): string[] => {
  const missing: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    missing.push('name');
  }

  if (!data.email || data.email.trim().length === 0) {
    missing.push('email');
  }

  if (!data.phone || data.phone.trim().length === 0) {
    missing.push('phone');
  }

  return missing;
};

export const hasAllRequiredFields = (data: ResumeData): boolean => {
  return getMissingFields(data).length === 0;
};