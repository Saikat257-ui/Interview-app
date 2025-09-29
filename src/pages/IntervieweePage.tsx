import React, { useState, useEffect } from 'react';
import { useAppDispatch, useInterviewState } from '../store/hooks';
import { Button, Card, Space, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createCandidate, updateCandidateInfo, startInterview, setCurrentCandidate } from '../store/slices/interviewSlice';
import ResumeUpload from '../components/ResumeUpload';
import MissingInfoChat from '../components/MissingInfoChat';
import CandidateInfoForm from '../components/CandidateInfoForm';
import InterviewChat from '../components/InterviewChat';
import WelcomeBackModal from '../components/WelcomeBackModal';
import type { ResumeData, Candidate } from '../types';
import { hasAllRequiredFields } from '../utils/resumeParser';

const IntervieweePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentCandidate, candidates } = useInterviewState();
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [parsedResumeData, setParsedResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    // Check if there's an unfinished interview
    const unfinishedCandidate = candidates.find((c: Candidate) => c.status === 'in-progress');
    // Only prompt to resume if there's an unfinished candidate and there's no active currentCandidate
    if (unfinishedCandidate && !currentCandidate) {
      setShowWelcomeBack(true);
    } else {
      setShowWelcomeBack(false);
    }
  }, [candidates, currentCandidate]);

  const handleResumeUpload = async (resumeData: ResumeData, file?: File) => {
    // Keep the File in local state only; do not store File in Redux
    setParsedResumeData({ ...resumeData, text: resumeData.text });
  };

  const handleMissingInfoComplete = (completedData: ResumeData, file?: File) => {
    // All missing fields have been collected, create the candidate
    dispatch(createCandidate({
      name: completedData.name || '',
      email: completedData.email || '',
      phone: completedData.phone || '',
      text: completedData.text || '',
      // pass only serializable metadata about the file if available on parsedResumeData
      resumeFileName: file?.name
    }));
    setParsedResumeData(null);
  };

  const handleFieldCollected = (field: string, value: string) => {
    // Update the parsed data as fields are collected (optional - for real-time updates)
    if (parsedResumeData) {
      setParsedResumeData({
        ...parsedResumeData,
        [field]: value
      });
    }
  };

  const handleInfoUpdate = (info: { name?: string; email?: string; phone?: string }) => {
    dispatch(updateCandidateInfo(info));
  };

  const handleStartInterview = () => {
    dispatch(startInterview());
  };

  const handleResumeInterview = () => {
    setShowWelcomeBack(false);
  };

  const handleStartNewInterview = () => {
    // Clear current candidate to allow new resume upload
    dispatch(setCurrentCandidate(null));
    setParsedResumeData(null);
    setShowWelcomeBack(false);
  };

  if (showWelcomeBack && currentCandidate) {
    return (
      <WelcomeBackModal
        candidate={currentCandidate}
        onResume={handleResumeInterview}
        onStartNew={() => setShowWelcomeBack(false)}
      />
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Show Start New Interview button if there's already a candidate */}
      {currentCandidate && (
        <Card style={{ 
          marginBottom: 24, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '16px',
          color: 'white'
        }}>
          <Space direction="vertical" size="middle">
            <div style={{ fontSize: '16px' }}>
              <strong>Current Interview:</strong> {currentCandidate.name} 
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '4px 12px', 
                borderRadius: '20px',
                marginLeft: '8px',
                fontSize: '14px'
              }}>
                {currentCandidate.status}
              </span>
            </div>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={handleStartNewInterview}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 500,
                height: '40px',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}
            >
              Start New Interview
            </Button>
          </Space>
        </Card>
      )}

      {!currentCandidate ? (
        parsedResumeData ? (
          !hasAllRequiredFields(parsedResumeData) ? (
            <MissingInfoChat
              resumeData={parsedResumeData}
              onComplete={(completedData: ResumeData) => handleMissingInfoComplete(completedData)}
              onFieldCollected={handleFieldCollected}
            />
          ) : (
            <Card
              style={{
                textAlign: 'center',
                borderRadius: 12,
                boxShadow: '0 8px 20px rgba(102,126,234,0.12)',
                marginTop: 24,
                padding: '36px 24px'
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%', alignItems: 'center' }}>
                <Spin size="large" />
                <div style={{ fontSize: 18, fontWeight: 600 }}>Creating candidate</div>
                <div style={{ color: 'rgba(0,0,0,0.45)' }}>We're parsing your resume and preparing the interview experience. This should only take a moment.</div>
                <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.35)', marginTop: 6 }}>
                  <AnimatedDots />
                </div>
              </Space>
            </Card>
          )
        ) : (
          <ResumeUpload onResumeParsed={handleResumeUpload} />
        )
      ) : currentCandidate.status === 'pending' ? (
        <CandidateInfoForm
          initialData={{
            name: currentCandidate.name,
            email: currentCandidate.email,
            phone: currentCandidate.phone,
          }}
          onUpdate={handleInfoUpdate}
          onStartInterview={handleStartInterview}
        />
      ) : (
        <InterviewChat />
      )}
    </div>
  );
};

// Small inline animated dots component used by the loading card
const AnimatedDots: React.FC = () => {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d % 3) + 1), 400);
    return () => clearInterval(t);
  }, []);
  return <span>{Array.from({ length: dots }).map((_, i) => <span key={i}>•</span>)}</span>;
};

export default IntervieweePage;