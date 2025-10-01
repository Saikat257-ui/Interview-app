import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useInterviewState } from '../store/hooks';
import { generateInterviewQuestions } from '../store/slices/interviewSlice';

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
  const dispatch = useAppDispatch();
  const { currentCandidate, questionsLoading } = useInterviewState();
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

  const handleSubmit = async () => {
    if (isValid && currentCandidate) {
      try {
        // Generate questions based on resume content before starting interview
        await dispatch(generateInterviewQuestions(currentCandidate.resumeText)).unwrap();
        onStartInterview();
      } catch (error) {
        console.error('Failed to generate questions:', error);
        // Still start interview with fallback questions
        onStartInterview();
      }
    }
  };

  return (
    <Card style={{ 
      maxWidth: 920, 
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

      <Row gutter={16} style={{ marginBottom: 28 }}>
        <Col xs={24} md={14} style={{ paddingLeft: 28 }}>
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Full Name</span>}
              name="name"
              rules={[
                { required: true, message: 'Please enter your full name' },
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#667eea', fontSize: '14px' }} />}
                placeholder="Enter your full name"
                size="small"
                style={{
                  borderRadius: '10px',
                  border: '1px solid #f0f0f0',
                  padding: '8px 12px 8px 14px',
                  fontSize: '13px',
                  maxWidth: '350px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                  background: 'rgba(102, 126, 234, 0.02)',
                  transition: 'all 0.12s ease'
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Email Address</span>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email address' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#667eea', fontSize: '14px' }} />}
                placeholder="Enter your email address"
                size="small"
                style={{
                  borderRadius: '10px',
                  border: '1px solid #f0f0f0',
                  padding: '8px 12px 8px 14px',
                  fontSize: '13px',
                  maxWidth: '350px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                  background: 'rgba(102, 126, 234, 0.02)',
                  transition: 'all 0.12s ease'
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Phone Number</span>}
              name="phone"
              rules={[
                { required: true, message: 'Please enter your phone number' },
                { pattern: /^\+?[\d\s\-()]+$/, message: 'Please enter a valid phone number' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: '#667eea', fontSize: '14px' }} />}
                placeholder="Enter your phone number"
                size="small"
                style={{
                  borderRadius: '10px',
                  border: '1px solid #f0f0f0',
                  padding: '8px 12px 8px 14px',
                  fontSize: '13px',
                  maxWidth: '350px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                  background: 'rgba(102, 126, 234, 0.02)',
                  transition: 'all 0.12s ease'
                }}
              />
            </Form.Item>
          </Form>
        </Col>

  <Col xs={24} md={10} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <Title level={3} style={{ color: '#1890ff', marginBottom: 16 }}>
              Interview Details
            </Title>
            <Space direction="vertical" size={12}>
              <Text style={{ color: '#666', fontSize: '14px' }}>• 6 Technical Questions (2 Easy, 2 Medium, 2 Hard)</Text>
              <Text style={{ color: '#666', fontSize: '14px' }}>• Timed responses with automatic submission</Text>
              <Text style={{ color: '#666', fontSize: '14px' }}>• AI-powered scoring and feedback</Text>
              <Text style={{ color: '#666', fontSize: '14px' }}>• Resume-based question generation</Text>
            </Space>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleSubmit}
                disabled={!isValid || questionsLoading}
                loading={questionsLoading}
                style={{ 
                  width: '100%',
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
            </div>
          </div>
        </Col>
      </Row>

      {!isValid && (
        <Alert
          message="Complete Required Information"
          description="Please fill in all required fields (name, email, and phone) to continue with the interview."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      
    </Card>
  );
};

export default CandidateInfoForm;

