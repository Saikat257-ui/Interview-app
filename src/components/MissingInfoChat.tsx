import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Typography, Space } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import type { ResumeData } from '../types';
import { getMissingFields } from '../utils/resumeParser';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface MissingInfoChatProps {
  resumeData: ResumeData;
  onComplete: (completedData: ResumeData) => void;
  onFieldCollected?: (field: string, value: string) => void;
}

type ChatMessage = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  field?: string;
};

const MissingInfoChat: React.FC<MissingInfoChatProps> = ({ resumeData, onComplete, onFieldCollected }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [collectedData, setCollectedData] = useState<ResumeData>(resumeData);
  const collectedDataRef = useRef(collectedData);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);

  const [missingFields] = useState<string[]>(() => getMissingFields(resumeData));
  const initializedRef = useRef(false);
  const fieldLabels: Record<string, string> = {
    name: 'full name',
    email: 'email address',
    phone: 'phone number'
  };

  const addMessageIfNotExists = (msg: ChatMessage) => {
    setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
  };

  useEffect(() => {
    if (initializedRef.current) return; // guard to ensure init runs only once
    initializedRef.current = true;

    // Initialize chat with welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'bot',
      content: `I see you've uploaded your resume! I need to collect some information that wasn't found in your resume. I'll ask for the missing details one by one.`
    };

  addMessageIfNotExists(welcomeMessage);

    // compute missing fields and labels locally to avoid hook deps
    const missingFieldsLocal = getMissingFields(resumeData);
    const fieldLabelsLocal: Record<string, string> = {
      name: 'full name',
      email: 'email address',
      phone: 'phone number'
    };

    // Local ask function
    const askLocal = (fieldIndex: number) => {
      if (fieldIndex >= missingFieldsLocal.length) {
        // All fields collected
        const completionMessage: ChatMessage = {
          id: 'complete',
          type: 'bot',
          content: 'Perfect! I have all the information I need. Let me start your interview now!'
        };
  addMessageIfNotExists(completionMessage);
        setTimeout(() => {
          onComplete(collectedDataRef.current);
        }, 2000);
        return;
      }

      const fieldToAsk = missingFieldsLocal[fieldIndex];
      setCurrentFieldIndex(fieldIndex);
      setIsWaitingForInput(true);

      const fieldMessage: ChatMessage = {
        id: `ask-${fieldToAsk}`,
        type: 'bot',
        content: `Could you please provide your ${fieldLabelsLocal[fieldToAsk]}?`
      };

  addMessageIfNotExists(fieldMessage);
    };

    // Start asking for missing fields after a delay
    if (missingFieldsLocal.length > 0) {
      setTimeout(() => {
        askLocal(0);
      }, 1500);
    } else {
      // No missing fields, proceed directly
      setTimeout(() => {
        onComplete(resumeData);
      }, 1000);
    }
  }, [resumeData, onComplete]);

  const askForField = (fieldIndex: number) => {
    if (fieldIndex >= missingFields.length) {
      // All fields collected
      const completionMessage: ChatMessage = {
        id: 'complete',
        type: 'bot',
        content: 'Perfect! I have all the information I need. Let me start your interview now!'
      };
        addMessageIfNotExists(completionMessage);
      setTimeout(() => {
        onComplete(collectedData);
      }, 2000);
      return;
    }

    const fieldToAsk = missingFields[fieldIndex];
    setCurrentFieldIndex(fieldIndex);
    setIsWaitingForInput(true);

    const fieldMessage: ChatMessage = {
      id: `ask-${fieldToAsk}`,
      type: 'bot',
      content: `Could you please provide your ${fieldLabels[fieldToAsk]}?`
    };

  addMessageIfNotExists(fieldMessage);
  };

  // keep ref in sync
  useEffect(() => { collectedDataRef.current = collectedData; }, [collectedData]);

  const handleSubmitField = () => {
    if (!currentInput.trim() || currentFieldIndex >= missingFields.length) return;

    const currentField = missingFields[currentFieldIndex];

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${currentField}`,
      type: 'user',
      content: currentInput.trim()
    };

    // Update collected data
    const newCollectedData = {
      ...collectedData,
      [currentField]: currentInput.trim()
    };

    setCollectedData(newCollectedData);
  setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsWaitingForInput(false);

    // Notify parent component about field collection
    if (onFieldCollected) {
      onFieldCollected(currentField, currentInput.trim());
    }

    // Ask for next field or complete
    setTimeout(() => {
      const nextFieldIndex = currentFieldIndex + 1;
      if (nextFieldIndex >= missingFields.length) {
        // All fields collected
        const completionMessage: ChatMessage = {
          id: 'complete',
          type: 'bot',
          content: 'Perfect! I have all the information I need. Let me start your interview now!'
        };
  addMessageIfNotExists(completionMessage);
        setTimeout(() => {
          onComplete(newCollectedData);
        }, 2000);
      } else {
        // Ask for next field
        askForField(nextFieldIndex);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitField();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4} style={{ textAlign: 'center', color: '#1890ff' }}>
            Resume Information Collection
          </Title>
        </div>

        <div style={{
          minHeight: 300,
          maxHeight: 400,
          overflowY: 'auto',
          marginBottom: 16,
          padding: 16,
          background: '#fafafa',
          borderRadius: 8
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: 12,
                textAlign: message.type === 'user' ? 'right' : 'left',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: message.type === 'user' ? '#1890ff' : '#f6f6f6',
                  color: message.type === 'user' ? '#fff' : '#000',
                }}
              >
                <Space>
                  {message.type === 'bot' ? <RobotOutlined /> : <UserOutlined />}
                  <Text>{message.content}</Text>
                </Space>
              </div>
            </div>
          ))}
        </div>

        {isWaitingForInput && (
          <div>
            <TextArea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Enter your ${fieldLabels[missingFields[currentFieldIndex]] || ''}`}
              rows={3}
              style={{ marginBottom: 8 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmitField}
              disabled={!currentInput.trim()}
              block
            >
              Submit
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MissingInfoChat;