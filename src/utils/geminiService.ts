import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Question } from '../types';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('REACT_APP_GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateQuestionsFromResume = async (resumeText: string): Promise<Question[]> => {
  console.log('Gemini API Key present:', !!API_KEY);
  if (!API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    console.log('Calling Gemini API with resume text length:', resumeText.length);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Based on the following resume content, generate exactly 6 technical interview questions:
- 2 EASY questions (20 seconds each) - basic concepts related to their skills
- 2 MEDIUM questions (60 seconds each) - intermediate level problems
- 2 HARD questions (120 seconds each) - advanced scenarios and problem-solving

Resume content:
${resumeText}

Return ONLY a JSON array with this exact structure:
[
  {
    "id": "easy-1",
    "text": "question text here",
    "difficulty": "easy",
    "timeLimit": 20
  },
  {
    "id": "easy-2", 
    "text": "question text here",
    "difficulty": "easy",
    "timeLimit": 20
  },
  {
    "id": "medium-1",
    "text": "question text here", 
    "difficulty": "medium",
    "timeLimit": 60
  },
  {
    "id": "medium-2",
    "text": "question text here",
    "difficulty": "medium", 
    "timeLimit": 60
  },
  {
    "id": "hard-1",
    "text": "question text here",
    "difficulty": "hard",
    "timeLimit": 120
  },
  {
    "id": "hard-2",
    "text": "question text here",
    "difficulty": "hard",
    "timeLimit": 120
  }
]

Focus on technologies, frameworks, and skills mentioned in the resume. Make questions specific and relevant to their experience level.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini API response length:', text.length);
    console.log('Gemini API response preview:', text.substring(0, 200));
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const questions: Question[] = JSON.parse(jsonMatch[0]);
    console.log('Parsed questions:', questions);
    
    // Validate structure
    if (!Array.isArray(questions) || questions.length !== 6) {
      throw new Error('Invalid questions format received');
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions from Gemini:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('Failed to generate questions from resume content');
  }
};