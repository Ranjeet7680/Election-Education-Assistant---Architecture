import React, { useState } from 'react';
import { UserProgress, QuizQuestion } from '../types/election';
import { getRandomQuestions } from '../data/quiz-data';
import { gamificationService } from '../services/gamification-service';

interface QuizViewProps {
  userProgress: UserProgress;
  setUserProgress: (progress: UserProgress) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ userProgress, setUserProgress }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuiz = (diff?: 'easy' | 'medium' | 'hard') => {
    const quizQuestions = getRandomQuestions(5, diff);
    setQuestions(quizQuestions);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setUserAnswers([...userAnswers, selectedAnswer]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      const finalAnswers = [...userAnswers, selectedAnswer!];
      const score = gamificationService.calculateQuizScore(questions, finalAnswers);
      
      const updatedProgress = {
        ...userProgress,
        quizScore: score,
        completedSteps: [...userProgress.completedSteps, 'quiz_completed'],
        lastUpdated: new Date()
      };
      
      const newBadges = gamificationService.checkAndAwardBadges(updatedProgress, score);
      updatedProgress.badges = [...userProgress.badges, ...newBadges];
      
      setUserProgress(updatedProgress);
      setQuizCompleted(true);
    }
  };

  if (!quizStarted) {
    return (
      <div style={styles.container}>
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeIcon}>🎯</div>
          <h2 style={styles.welcomeTitle}>Test Your Voting Knowledge</h2>
          <p style={styles.welcomeText}>
            Take a quiz to test how much you know about elections and voting. 
            Choose your difficulty level to get started!
          </p>

          <div style={styles.difficultyGrid}>
            <button
              onClick={() => startQuiz('easy')}
              style={{ ...styles.difficultyCard, ...styles.difficultyEasy }}
            >
              <div style={styles.difficultyIcon}>🟢</div>
              <div style={styles.difficultyTitle}>Easy</div>
              <div style={styles.difficultyDesc}>Basic questions for beginners</div>
            </button>

            <button
              onClick={() => startQuiz('medium')}
              style={{ ...styles.difficultyCard, ...styles.difficultyMedium }}
            >
              <div style={styles.difficultyIcon}>🟡</div>
              <div style={styles.difficultyTitle}>Medium</div>
              <div style={styles.difficultyDesc}>Moderate difficulty questions</div>
            </button>

            <button
              onClick={() => startQuiz('hard')}
              style={{ ...styles.difficultyCard, ...styles.difficultyHard }}
            >
              <div style={styles.difficultyIcon}>🔴</div>
              <div style={styles.difficultyTitle}>Hard</div>
              <div style={styles.difficultyDesc}>Challenging questions</div>
            </button>

            <button
              onClick={() => startQuiz()}
              style={{ ...styles.difficultyCard, ...styles.difficultyMixed }}
            >
              <div style={styles.difficultyIcon}>🎲</div>
              <div style={styles.difficultyTitle}>Mixed</div>
              <div style={styles.difficultyDesc}>Random difficulty levels</div>
            </button>
          </div>

          {userProgress.quizScore > 0 && (
            <div style={styles.previousScore}>
              <span style={styles.previousScoreLabel}>Your Previous Score:</span>
              <span style={styles.previousScoreValue}>{userProgress.quizScore}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const score = userProgress.quizScore;
    const message = gamificationService.getScoreMessage(score);
    
    return (
      <div style={styles.container}>
        <div style={styles.resultCard}>
          <div style={styles.resultIcon}>
            {score === 100 ? '🎉' : score >= 80 ? '🌟' : score >= 60 ? '👍' : '📚'}
          </div>
          <h2 style={styles.resultTitle}>Quiz Complete!</h2>
          <div style={styles.scoreDisplay}>
            <div style={styles.scoreValue}>{score}%</div>
            <div style={styles.scoreLabel}>Your Score</div>
          </div>
          <p style={styles.resultMessage}>{message}</p>

          <div style={styles.resultStats}>
            <div style={styles.resultStat}>
              <div style={styles.resultStatValue}>
                {userAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length}
              </div>
              <div style={styles.resultStatLabel}>Correct</div>
            </div>
            <div style={styles.resultStat}>
              <div style={styles.resultStatValue}>
                {userAnswers.filter((ans, idx) => ans !== questions[idx].correctAnswer).length}
              </div>
              <div style={styles.resultStatLabel}>Incorrect</div>
            </div>
            <div style={styles.resultStat}>
              <div style={styles.resultStatValue}>{questions.length}</div>
              <div style={styles.resultStatLabel}>Total</div>
            </div>
          </div>

          <div style={styles.resultActions}>
            <button
              onClick={() => setQuizStarted(false)}
              style={styles.retakeButton}
            >
              Retake Quiz
            </button>
            <button
              onClick={() => window.location.reload()}
              style={styles.dashboardButton}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div style={styles.container}>
      <div style={styles.quizCard}>
        {/* Progress Bar */}
        <div style={styles.quizProgress}>
          <div style={styles.quizProgressText}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div style={styles.quizProgressBar}>
            <div
              style={{
                ...styles.quizProgressFill,
                width: `${((currentQuestion + 1) / questions.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div style={styles.questionSection}>
          <h3 style={styles.questionText}>{question.question}</h3>
        </div>

        {/* Options */}
        <div style={styles.optionsGrid}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            const showCorrect = showExplanation && isCorrectAnswer;
            const showIncorrect = showExplanation && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                style={{
                  ...styles.optionButton,
                  ...(isSelected && !showExplanation ? styles.optionSelected : {}),
                  ...(showCorrect ? styles.optionCorrect : {}),
                  ...(showIncorrect ? styles.optionIncorrect : {})
                }}
              >
                <div style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </div>
                <div style={styles.optionText}>{option}</div>
                {showCorrect && <div style={styles.optionIcon}>✓</div>}
                {showIncorrect && <div style={styles.optionIcon}>✗</div>}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div style={{
            ...styles.explanationBox,
            ...(isCorrect ? styles.explanationCorrect : styles.explanationIncorrect)
          }}>
            <div style={styles.explanationHeader}>
              <span style={styles.explanationIcon}>
                {isCorrect ? '✅' : '❌'}
              </span>
              <span style={styles.explanationTitle}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p style={styles.explanationText}>{question.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div style={styles.quizActions}>
          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              style={{
                ...styles.submitButton,
                ...(selectedAnswer === null ? styles.submitButtonDisabled : {})
              }}
            >
              Submit Answer
            </button>
          ) : (
            <button onClick={handleNextQuestion} style={styles.nextButton}>
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  },
  welcomeIcon: {
    fontSize: '64px',
    marginBottom: '24px'
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 16px 0'
  },
  welcomeText: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '40px'
  },
  difficultyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '32px'
  },
  difficultyCard: {
    padding: '24px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center'
  },
  difficultyEasy: {},
  difficultyMedium: {},
  difficultyHard: {},
  difficultyMixed: {},
  difficultyIcon: {
    fontSize: '32px',
    marginBottom: '12px'
  },
  difficultyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px'
  },
  difficultyDesc: {
    fontSize: '14px',
    color: '#64748b'
  },
  previousScore: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px'
  },
  previousScoreLabel: {
    fontSize: '14px',
    color: '#64748b'
  },
  previousScoreValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563eb'
  },
  quizCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e2e8f0'
  },
  quizProgress: {
    marginBottom: '32px'
  },
  quizProgressText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px'
  },
  quizProgressBar: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  quizProgressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    transition: 'width 0.3s ease'
  },
  questionSection: {
    marginBottom: '32px'
  },
  questionText: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: '1.5',
    margin: 0
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  optionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left'
  },
  optionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff'
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4'
  },
  optionIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2'
  },
  optionLetter: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#475569'
  },
  optionText: {
    flex: 1,
    fontSize: '16px',
    color: '#1e293b'
  },
  optionIcon: {
    fontSize: '20px'
  },
  explanationBox: {
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  explanationCorrect: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #86efac'
  },
  explanationIncorrect: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5'
  },
  explanationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  explanationIcon: {
    fontSize: '20px'
  },
  explanationTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b'
  },
  explanationText: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    margin: 0
  },
  quizActions: {
    display: 'flex',
    justifyContent: 'center'
  },
  submitButton: {
    padding: '14px 32px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  submitButtonDisabled: {
    backgroundColor: '#cbd5e1',
    cursor: 'not-allowed'
  },
  nextButton: {
    padding: '14px 32px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  },
  resultIcon: {
    fontSize: '64px',
    marginBottom: '24px'
  },
  resultTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 24px 0'
  },
  scoreDisplay: {
    marginBottom: '24px'
  },
  scoreValue: {
    fontSize: '64px',
    fontWeight: '700',
    color: '#2563eb',
    lineHeight: '1'
  },
  scoreLabel: {
    fontSize: '16px',
    color: '#64748b',
    marginTop: '8px'
  },
  resultMessage: {
    fontSize: '18px',
    color: '#475569',
    marginBottom: '32px'
  },
  resultStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px'
  },
  resultStat: {
    textAlign: 'center'
  },
  resultStatValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b'
  },
  resultStatLabel: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px'
  },
  resultActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center'
  },
  retakeButton: {
    padding: '14px 32px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  dashboardButton: {
    padding: '14px 32px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
