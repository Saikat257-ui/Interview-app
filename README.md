# AI-Powered Interview Assistant (Crisp)

A modern React TypeScript application that provides an AI-powered interview experience with real-time candidate evaluation and comprehensive dashboard management.

## 🚀 Features

### Core Functionality
- **Two-tab Interface**: Separate views for interviewees and interviewers
- **Resume Upload**: Support for PDF and DOCX file formats with automatic text extraction
- **Smart Information Collection**: Automatically extracts name, email, and phone from resumes
- **Dynamic Interview Flow**: AI-generated questions with varying difficulty levels
- **Real-time Timer**: Question-specific time limits with automatic submission
- **Progress Persistence**: All data saved locally with automatic restoration
- **Welcome Back Modal**: Resume interrupted interviews seamlessly

### Interview Features
- **6 Progressive Questions**: 2 Easy → 2 Medium → 2 Hard difficulty levels
- **Time-based Constraints**:
  - Easy questions: 20 seconds
  - Medium questions: 60 seconds
  - Hard questions: 120 seconds
- **Automatic Scoring**: AI-powered answer evaluation
- **Real-time Progress Tracking**: Visual progress indicators and timers
- **Chat Interface**: Clean, modern chat UI for interview experience

### Dashboard Features
- **Candidate Management**: Comprehensive list of all interviewed candidates
- **Advanced Filtering**: Search by name, email, or other criteria
- **Sorting Options**: Sort by score, name, or interview date
- **Detailed Candidate View**: Complete interview history and AI-generated summaries
- **Performance Analytics**: Score visualization and candidate comparison

### Technical Features
- **State Management**: Redux Toolkit with persistence
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-friendly interface with Ant Design
- **File Processing**: PDF.js for PDF parsing, Mammoth for DOCX
- **Local Storage**: Complete offline functionality

## 🛠 Technology Stack

- **Frontend**: React 19 + TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **UI Framework**: Ant Design + Ant Design Icons
- **Routing**: React Router v6
- **File Processing**:
  - `pdfjs-dist` for PDF text extraction
  - `mammoth` for DOCX text extraction
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MainLayout.tsx          # Main app layout with tabs
│   ├── ResumeUpload.tsx        # File upload component
│   ├── CandidateInfoForm.tsx   # Information collection form
│   ├── InterviewChat.tsx       # Chat interface
│   └── WelcomeBackModal.tsx    # Resume session modal
├── pages/               # Page-level components
│   ├── IntervieweePage.tsx     # Interviewee interface
│   └── InterviewerPage.tsx     # Dashboard interface
├── store/               # Redux state management
│   ├── slices/interviewSlice.ts # Interview state logic
│   ├── hooks.ts                # Custom Redux hooks
│   └── index.ts                # Store configuration
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── resumeParser.ts         # PDF/DOCX parsing logic
│   └── interviewUtils.ts       # Interview flow utilities
└── App.tsx             # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Gemini API**
   - Copy `.env.example` to `.env`
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your API key to `.env`:
     ```
     REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### For Interviewees

1. **Upload Resume**: Start by uploading your PDF or DOCX resume
2. **Complete Information**: Verify and complete any missing contact information
3. **Take Interview**: Answer 6 progressively difficult questions within time limits
4. **View Results**: Access your performance summary in the dashboard

### For Interviewers

1. **Access Dashboard**: Switch to the "Interviewer Dashboard" tab
2. **Review Candidates**: Browse all interviewed candidates with scores and summaries
3. **Detailed Analysis**: Click "View Details" for comprehensive candidate information
4. **Search & Filter**: Use search and sorting options to find specific candidates

## 🔧 Configuration

### Interview Questions
Questions are now dynamically generated using Google's Gemini AI based on the candidate's resume content. The system:
- Analyzes the uploaded resume text
- Generates 6 personalized questions (2 Easy, 2 Medium, 2 Hard)
- Focuses on technologies and skills mentioned in the resume
- Falls back to generic questions if API fails or no resume is provided

To customize the question generation prompt, modify `src/utils/geminiService.ts`.

### Time Limits
Adjust question time limits in the same file by modifying the `timeLimit` property of each question object.

### Scoring Algorithm
The scoring system can be customized in the `calculateScore()` function to match your evaluation criteria.

## 🎨 Customization

### Styling
- Global styles: `src/index.css`
- Component-specific styles: `src/App.css`
- Ant Design theme customization available in `src/App.tsx`

### Question Types
Add new question types by extending the `Question` interface in `src/types/index.ts`.

## 🔒 Data Persistence

All interview data is automatically saved to localStorage and restored when the application loads. This includes:
- Candidate information
- Interview progress
- Answers and scores
- Timing information

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The `build` folder will contain the optimized production build ready for deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**