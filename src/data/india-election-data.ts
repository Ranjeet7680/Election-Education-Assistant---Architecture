import { ElectionInfo, ElectionPhase, Document, VotingStep } from '../types/election';

// Sample data for Indian elections - would be fetched from Election Commission API in production

export const indiaElectionPhases: ElectionPhase[] = [
  {
    id: 'registration',
    name: 'Voter Registration',
    description: 'Register yourself as a voter if you are 18 years or older',
    status: 'active',
    userAction: 'Complete your voter registration online or at nearest ERO office',
    actionDeadline: new Date('2026-06-30')
  },
  {
    id: 'verification',
    name: 'Verification & Voter List Publication',
    description: 'Election Commission verifies applications and publishes voter lists',
    status: 'upcoming',
    userAction: 'Check if your name appears in the voter list'
  },
  {
    id: 'nomination',
    name: 'Nomination Period',
    description: 'Candidates file their nominations',
    status: 'upcoming'
  },
  {
    id: 'campaign',
    name: 'Campaign Period',
    description: 'Political parties and candidates campaign',
    status: 'upcoming',
    userAction: 'Research candidates and their manifestos'
  },
  {
    id: 'voting',
    name: 'Voting Day',
    description: 'Cast your vote at your designated polling booth',
    status: 'upcoming',
    userAction: 'Visit your polling booth with valid ID and cast your vote'
  },
  {
    id: 'counting',
    name: 'Vote Counting',
    description: 'Votes are counted and results are declared',
    status: 'upcoming'
  }
];

export const indiaRequiredDocuments: Document[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    description: 'Unique identification number issued by UIDAI',
    required: false,
    alternatives: ['Passport', 'Driving License', 'PAN Card']
  },
  {
    id: 'age_proof',
    name: 'Age Proof',
    description: 'Document proving you are 18 years or older',
    required: true,
    alternatives: ['Birth Certificate', '10th Marksheet', 'Passport']
  },
  {
    id: 'address_proof',
    name: 'Address Proof',
    description: 'Document proving your current residential address',
    required: true,
    alternatives: ['Aadhaar', 'Passport', 'Utility Bill', 'Rent Agreement']
  },
  {
    id: 'photo',
    name: 'Recent Photograph',
    description: 'Passport-size photograph (not older than 3 months)',
    required: true
  }
];

export const indiaVotingSteps: VotingStep[] = [
  {
    id: 'step1',
    order: 1,
    title: 'Check Your Registration',
    description: 'Verify that your name is in the voter list at nvsp.in',
    tips: [
      'Keep your EPIC number (Voter ID) handy',
      'You can search by name, EPIC number, or mobile number'
    ]
  },
  {
    id: 'step2',
    order: 2,
    title: 'Find Your Polling Booth',
    description: 'Locate your assigned polling station using the Voter Helpline app or website',
    tips: [
      'Note down the address and directions',
      'Check the polling booth timings (usually 7 AM to 6 PM)'
    ]
  },
  {
    id: 'step3',
    order: 3,
    title: 'Prepare Required Documents',
    description: 'Carry any one valid photo ID proof',
    tips: [
      'Voter ID (EPIC) is preferred but not mandatory',
      'Aadhaar, Passport, Driving License, PAN Card are also accepted',
      'Carry original document, not photocopy'
    ],
    commonMistakes: [
      'Forgetting to bring ID proof',
      'Bringing expired documents'
    ]
  },
  {
    id: 'step4',
    order: 4,
    title: 'Visit Polling Booth on Voting Day',
    description: 'Go to your polling station during voting hours',
    tips: [
      'Try to vote early to avoid queues',
      'Wear comfortable clothes',
      'Mobile phones are allowed but photography inside is prohibited'
    ]
  },
  {
    id: 'step5',
    order: 5,
    title: 'Verification at Polling Station',
    description: 'Show your ID to the polling officer for verification',
    tips: [
      'Stand in the correct queue (separate queues for men and women)',
      'Your name will be checked in the voter list',
      'Your finger will be marked with indelible ink'
    ]
  },
  {
    id: 'step6',
    order: 6,
    title: 'Cast Your Vote',
    description: 'Use the Electronic Voting Machine (EVM) to cast your vote',
    tips: [
      'Press the button next to your chosen candidate',
      'You will hear a beep and see a red light',
      'VVPAT slip will be visible for 7 seconds',
      'Do not press multiple buttons'
    ],
    commonMistakes: [
      'Pressing wrong button in confusion',
      'Not waiting to see VVPAT slip'
    ]
  },
  {
    id: 'step7',
    order: 7,
    title: 'Exit the Polling Booth',
    description: 'Leave the polling station after voting',
    tips: [
      'Do not discuss your vote with others',
      'Take a selfie outside (not inside) with your inked finger',
      'Share on social media to encourage others'
    ]
  }
];

export const getIndiaElectionInfo = (state?: string): ElectionInfo => {
  return {
    country: 'india',
    state,
    electionType: 'parliamentary',
    phases: indiaElectionPhases,
    requiredDocuments: indiaRequiredDocuments,
    votingSteps: indiaVotingSteps,
    registrationUrl: 'https://voters.eci.gov.in/',
    voterListCheckUrl: 'https://electoralsearch.eci.gov.in/',
    officialSourceUrl: 'https://eci.gov.in/',
    helplineNumber: '1950'
  };
};

// State-specific variations (example for a few states)
export const stateSpecificInfo: Record<string, Partial<ElectionInfo>> = {
  'maharashtra': {
    helplineNumber: '1950',
    // Add Maharashtra-specific information
  },
  'karnataka': {
    helplineNumber: '1950',
    // Add Karnataka-specific information
  },
  'tamil-nadu': {
    helplineNumber: '1950',
    // Add Tamil Nadu-specific information
  }
};
