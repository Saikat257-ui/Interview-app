import React from 'react';
import { Modal, Button, Typography, Space, Card } from 'antd';
import { ClockCircleOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import type { Candidate } from '../types';

const { Title, Text } = Typography;

interface WelcomeBackModalProps {
  candidate: Candidate;
  onResume: () => void;
  onStartNew: () => void;
}

const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({
  candidate,
  onResume,
  onStartNew,
}) => {
  const getProgressText = () => {
    const totalQuestions = 6;
    const completedQuestions = candidate.currentQuestionIndex;
    return `Question ${completedQuestions + 1} of ${totalQuestions}`;
  };

  const getTimeRemaining = () => {
    if (!candidate.answers.length) return 'Not started';

    const lastAnswer = candidate.answers[candidate.answers.length - 1];
    const timeSpent = lastAnswer.timeSpent;

    // Estimate remaining time based on current question
    const questions = [
      { difficulty: 'easy', timeLimit: 20 },
      { difficulty: 'easy', timeLimit: 20 },
      { difficulty: 'medium', timeLimit: 60 },
      { difficulty: 'medium', timeLimit: 60 },
      { difficulty: 'hard', timeLimit: 120 },
      { difficulty: 'hard', timeLimit: 120 },
    ];

    const currentQuestion = questions[candidate.currentQuestionIndex];
    if (!currentQuestion) return 'Unknown';

    const estimatedRemaining = Math.max(0, currentQuestion.timeLimit - timeSpent);
    const minutes = Math.floor(estimatedRemaining / 60);
    const seconds = estimatedRemaining % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      title={
        <Space>
          <ClockCircleOutlined style={{ color: '#1890ff' }} />
          Welcome Back!
        </Space>
      }
      open={true}
      footer={null}
      closable={false}
      width={500}
    >
      <div style={{ textAlign: 'center' }}>
        <Title level={3} style={{ color: '#1890ff', marginBottom: 8 }}>
          {candidate.name}
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          We found your unfinished interview session
        </Text>
      </div>

      <Card style={{ margin: '24px 0', textAlign: 'center' }}>
        <Space direction="vertical" size="middle">
          <div>
            <Text strong style={{ fontSize: '18px' }}>
              Progress: {getProgressText()}
            </Text>
          </div>

          <div>
            <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14', marginRight: 8 }} />
            <Text strong style={{ fontSize: '16px' }}>
              Estimated Time Remaining: {getTimeRemaining()}
            </Text>
          </div>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              Started on: {new Date(candidate.createdAt).toLocaleDateString()} at{' '}
              {new Date(candidate.createdAt).toLocaleTimeString()}
            </Text>
          </div>
        </Space>
      </Card>

      <div style={{ textAlign: 'center' }}>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={onResume}
            style={{ width: 140 }}
          >
            Resume Interview
          </Button>

          <Button
            size="large"
            icon={<StopOutlined />}
            onClick={onStartNew}
            style={{ width: 140 }}
          >
            Start New
          </Button>
        </Space>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Your progress is automatically saved. You can resume this interview at any time.
        </Text>
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;