import React, { useState } from 'react';
import { Upload, Card, Typography, Alert, Space, Tag } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { parseResumeFile } from '../utils/resumeParser';
import type { ResumeData } from '../types';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface ResumeUploadProps {
  onResumeParsed: (data: ResumeData, file?: File) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeParsed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const resumeData = await parseResumeFile(file);
      onResumeParsed(resumeData, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
    } finally {
      setLoading(false);
    }

    return false;
  };

  const uploadProps = {
    name: 'resume',
    multiple: false,
    accept: '.pdf,.docx',
    showUploadList: false,
    beforeUpload: handleFileUpload,
    disabled: loading,
  };

  return (
    <Card style={{ 
      maxWidth: 700, 
      margin: '0 auto',
      borderRadius: '20px',
      border: 'none',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
        }}>
          <FileTextOutlined style={{ fontSize: 36, color: 'white' }} />
        </div>
        <Title level={2} style={{ 
          marginBottom: 12,
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Upload Your Resume
        </Title>
        <Text style={{ fontSize: '16px', color: '#666' }}>
          Please upload your resume in PDF or DOCX format to begin the interview process.
        </Text>
      </div>

      <Dragger {...uploadProps} style={{
        border: '2px dashed #d9d9d9',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
      }}>
        <div style={{ padding: '48px 24px' }}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ 
              fontSize: 56, 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }} />
          </p>
          <p className="ant-upload-text" style={{ fontSize: '18px', fontWeight: 500, color: '#333' }}>
            Click or drag your resume file here to upload
          </p>
          <p className="ant-upload-hint" style={{ fontSize: '14px', color: '#888' }}>
            Support for PDF and DOCX files only. Maximum file size: 10MB
          </p>
        </div>
      </Dragger>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">Parsing your resume...</Text>
        </div>
      )}

      {error && (
        <Alert
          message="Upload Error"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <Space direction="vertical" size="middle">
          <Text style={{ color: '#666', fontSize: '14px' }}>Supported formats:</Text>
          <div>
            <Tag style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '4px 16px',
              margin: '0 8px'
            }}>PDF</Tag>
            <Tag style={{
              background: 'linear-gradient(45deg, #764ba2, #667eea)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '4px 16px',
              margin: '0 8px'
            }}>DOCX</Tag>
          </div>
        </Space>
      </div>
    </Card>
  );
};

export default ResumeUpload;