import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CandidateInfoFormProps {
  initialData: {
    name?: string;
    email?: string;
    phone?: string;
  };
  onUpdate: (info: { name?: string; email?: string; phone?: string }) => void;
  onStartInterview: () => void;
}

const CandidateInfoForm: React.FC<CandidateInfoFormProps> = ({
  initialData,
  onUpdate,
  onStartInterview,
}) => {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    form.setFieldsValue(initialData);
    checkFormValidity(initialData);
  }, [initialData, form]);

  const checkFormValidity = (values: { name?: string; email?: string; phone?: string }) => {
    const hasAllFields = Boolean(values.name && values.email && values.phone);
    setIsValid(hasAllFields);
  };

  const handleValuesChange = (changedValues: { name?: string; email?: string; phone?: string }, allValues: { name?: string; email?: string; phone?: string }) => {
    checkFormValidity(allValues);
    onUpdate(allValues);
  };

  const handleSubmit = () => {
    if (isValid) {
      onStartInterview();
    }
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
          <UserOutlined style={{ fontSize: 36, color: 'white' }} />
        </div>
        <Title level={2} style={{ 
          marginBottom: 12,
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Complete Your Information
        </Title>
        <Text style={{ fontSize: '16px', color: '#666' }}>
          Please verify and complete your information before starting the interview.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        style={{ marginBottom: 24 }}
      >
        <Form.Item
          label={<span style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>Full Name</span>}
          name="name"
          rules={[
            { required: true, message: 'Please enter your full name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#667eea', fontSize: '18px' }} />}
            placeholder="Enter your full name"
            size="large"
            style={{
              borderRadius: '16px',
              border: '2px solid #e8e8e8',
              padding: '12px 16px',
              fontSize: '16px',
              background: 'rgba(102, 126, 234, 0.02)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              e.target.style.background = 'rgba(102, 126, 234, 0.05)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e8e8e8';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(102, 126, 234, 0.02)';
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>Email Address</span>}
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#667eea', fontSize: '18px' }} />}
            placeholder="Enter your email address"
            size="large"
            style={{
              borderRadius: '16px',
              border: '2px solid #e8e8e8',
              padding: '12px 16px',
              fontSize: '16px',
              background: 'rgba(102, 126, 234, 0.02)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              e.target.style.background = 'rgba(102, 126, 234, 0.05)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e8e8e8';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(102, 126, 234, 0.02)';
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>Phone Number</span>}
          name="phone"
          rules={[
            { required: true, message: 'Please enter your phone number' },
            { pattern: /^\+?[\d\s\-()]+$/, message: 'Please enter a valid phone number' },
          ]}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: '#667eea', fontSize: '18px' }} />}
            placeholder="Enter your phone number"
            size="large"
            style={{
              borderRadius: '16px',
              border: '2px solid #e8e8e8',
              padding: '12px 16px',
              fontSize: '16px',
              background: 'rgba(102, 126, 234, 0.02)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              e.target.style.background = 'rgba(102, 126, 234, 0.05)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e8e8e8';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(102, 126, 234, 0.02)';
            }}
          />
        </Form.Item>
      </Form>

      {!isValid && (
        <Alert
          message="Complete Required Information"
          description="Please fill in all required fields (name, email, and phone) to continue with the interview."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={4} style={{ color: '#1890ff', marginBottom: 8 }}>
              Interview Details
            </Title>
            <Space direction="vertical" size="small">
              <Text>• 6 Technical Questions (2 Easy, 2 Medium, 2 Hard)</Text>
              <Text>• Timed responses with automatic submission</Text>
              <Text>• AI-powered scoring and feedback</Text>
              <Text>• Resume-based question generation</Text>
            </Space>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleSubmit}
            disabled={!isValid}
            style={{ 
              width: 220,
              height: 50,
              borderRadius: '25px',
              background: isValid ? 'linear-gradient(45deg, #667eea, #764ba2)' : undefined,
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              boxShadow: isValid ? '0 4px 15px rgba(102, 126, 234, 0.4)' : undefined
            }}
          >
            Start Interview
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default CandidateInfoForm;