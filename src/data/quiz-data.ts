import { QuizQuestion } from '../types/election';

export const indiaQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the minimum age to vote in India?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correctAnswer: 1,
    explanation: 'You must be 18 years or older on the qualifying date to register as a voter in India.',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'Which document is MANDATORY to carry while voting?',
    options: [
      'Voter ID Card only',
      'Any valid photo ID proof',
      'Aadhaar Card only',
      'No document needed'
    ],
    correctAnswer: 1,
    explanation: 'You must carry any one valid photo ID proof. Voter ID is preferred but not mandatory. Aadhaar, Passport, Driving License, PAN Card are also accepted.',
    difficulty: 'medium'
  },
  {
    id: 'q3',
    question: 'What does EVM stand for?',
    options: [
      'Electronic Voting Machine',
      'Electoral Verification Method',
      'Election Validation Module',
      'Electronic Vote Monitor'
    ],
    correctAnswer: 0,
    explanation: 'EVM stands for Electronic Voting Machine, which is used for casting votes in Indian elections.',
    difficulty: 'easy'
  },
  {
    id: 'q4',
    question: 'What is VVPAT?',
    options: [
      'Voter Verification Paper Audit Trail',
      'Valid Voter Photo Authentication Tool',
      'Verified Voting Process and Tracking',
      'Virtual Voter Paper Authentication'
    ],
    correctAnswer: 0,
    explanation: 'VVPAT (Voter Verification Paper Audit Trail) is a method that provides feedback to voters. A slip is printed showing whom the vote has been cast for, visible for 7 seconds.',
    difficulty: 'medium'
  },
  {
    id: 'q5',
    question: 'Can you vote if your name is not in the voter list?',
    options: [
      'Yes, with any ID proof',
      'Yes, with Aadhaar card',
      'No, you cannot vote',
      'Yes, if you register at the polling booth'
    ],
    correctAnswer: 2,
    explanation: 'No, you cannot vote if your name is not in the voter list. You must register in advance and ensure your name appears in the electoral roll.',
    difficulty: 'medium'
  },
  {
    id: 'q6',
    question: 'What is the Election Commission helpline number in India?',
    options: ['100', '1950', '1091', '1800'],
    correctAnswer: 1,
    explanation: 'The Election Commission of India helpline number is 1950. You can call for any election-related queries.',
    difficulty: 'easy'
  },
  {
    id: 'q7',
    question: 'What happens if you press the wrong button on the EVM?',
    options: [
      'You can press again to change',
      'The vote is final and cannot be changed',
      'You can ask the officer to reset',
      'The machine will ask for confirmation'
    ],
    correctAnswer: 1,
    explanation: 'Once you press a button on the EVM, your vote is final and cannot be changed. Be careful while voting.',
    difficulty: 'hard'
  },
  {
    id: 'q8',
    question: 'Is it mandatory to vote in India?',
    options: [
      'Yes, it is mandatory',
      'No, it is a right but not mandatory',
      'Yes, but only in general elections',
      'It depends on the state'
    ],
    correctAnswer: 1,
    explanation: 'Voting is a constitutional right in India, but it is not mandatory. However, it is your civic duty to participate in democracy.',
    difficulty: 'medium'
  },
  {
    id: 'q9',
    question: 'Can you take a selfie inside the polling booth?',
    options: [
      'Yes, anywhere',
      'Yes, but only after voting',
      'No, photography inside is prohibited',
      'Yes, with permission'
    ],
    correctAnswer: 2,
    explanation: 'Photography inside the polling booth is strictly prohibited to maintain secrecy of voting. You can take selfies outside with your inked finger.',
    difficulty: 'easy'
  },
  {
    id: 'q10',
    question: 'What is NOTA?',
    options: [
      'Notice of Total Absence',
      'None of the Above',
      'New Option to Accept',
      'National Oath Taking Act'
    ],
    correctAnswer: 1,
    explanation: 'NOTA stands for "None of the Above". It allows voters to officially register their rejection of all candidates in an election.',
    difficulty: 'medium'
  }
];

export const getRandomQuestions = (count: number = 5, difficulty?: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  let questions = indiaQuizQuestions;
  
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle and return requested number of questions
  return questions
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};
