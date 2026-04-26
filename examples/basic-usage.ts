/**
 * Basic Usage Examples for Election Education Assistant
 * 
 * This file demonstrates how to use the core services and components
 */

import { ElectionAssistantService } from '../src/services/assistant-service';
import { GamificationService } from '../src/services/gamification-service';
import { User, UserProgress } from '../src/types/election';
import { getIndiaElectionInfo } from '../src/data/india-election-data';
import { getRandomQuestions } from '../src/data/quiz-data';

// ============================================================================
// Example 1: Creating an Assistant Instance
// ============================================================================

function example1_CreateAssistant() {
  // Define user context
  const user: User = {
    id: 'user-123',
    location: {
      country: 'india',
      state: 'maharashtra',
      district: 'mumbai'
    },
    language: 'en',
    isFirstTimeVoter: true,
    age: 19,
    registrationStatus: 'not_registered'
  };

  // Create assistant instance
  const assistant = new ElectionAssistantService(user);

  console.log('✅ Assistant created for:', user.location);
  return assistant;
}

// ============================================================================
// Example 2: Processing User Messages
// ============================================================================

async function example2_ProcessMessages() {
  const assistant = example1_CreateAssistant();

  // Process different types of messages
  const messages = [
    "I want to register as a voter",
    "What documents do I need?",
    "When are the elections?",
    "Where is my polling booth?"
  ];

  for (const message of messages) {
    console.log('\n📤 User:', message);
    
    const response = await assistant.processMessage(message);
    
    console.log('📥 Assistant:', response.content.substring(0, 100) + '...');
    console.log('🎯 Intent:', response.intent);
  }
}

// ============================================================================
// Example 3: Intent Detection
// ============================================================================

function example3_IntentDetection() {
  const assistant = new ElectionAssistantService();

  const testMessages = [
    { message: "How do I register?", expected: "register" },
    { message: "What ID do I need?", expected: "required_documents" },
    { message: "When is voting day?", expected: "timeline" },
    { message: "Find my polling station", expected: "find_booth" },
    { message: "Check my voter status", expected: "check_status" },
    { message: "Take a quiz", expected: "quiz" }
  ];

  console.log('\n🎯 Intent Detection Examples:\n');

  testMessages.forEach(({ message, expected }) => {
    const detected = assistant.detectIntent(message);
    const match = detected === expected ? '✅' : '❌';
    console.log(`${match} "${message}" → ${detected} (expected: ${expected})`);
  });
}

// ============================================================================
// Example 4: Getting Election Information
// ============================================================================

function example4_ElectionInfo() {
  // Get election info for India
  const indiaInfo = getIndiaElectionInfo('maharashtra');

  console.log('\n📊 Election Information:\n');
  console.log('Country:', indiaInfo.country);
  console.log('State:', indiaInfo.state);
  console.log('Election Type:', indiaInfo.electionType);
  console.log('Phases:', indiaInfo.phases.length);
  console.log('Required Documents:', indiaInfo.requiredDocuments.length);
  console.log('Voting Steps:', indiaInfo.votingSteps.length);
  console.log('Registration URL:', indiaInfo.registrationUrl);
  console.log('Helpline:', indiaInfo.helplineNumber);

  // Display phases
  console.log('\n📅 Election Phases:\n');
  indiaInfo.phases.forEach((phase, index) => {
    const status = phase.status === 'active' ? '🔵' : 
                   phase.status === 'completed' ? '✅' : '⏳';
    console.log(`${index + 1}. ${status} ${phase.name} - ${phase.description}`);
  });

  // Display required documents
  console.log('\n📄 Required Documents:\n');
  indiaInfo.requiredDocuments.forEach((doc, index) => {
    const required = doc.required ? '(Required)' : '(Optional)';
    console.log(`${index + 1}. ${doc.name} ${required}`);
    console.log(`   ${doc.description}`);
  });
}

// ============================================================================
// Example 5: Gamification - Badge System
// ============================================================================

function example5_Gamification() {
  const gamificationService = new GamificationService();

  // Create user progress
  const userProgress: UserProgress = {
    userId: 'user-123',
    completedSteps: ['registration', 'documents_learned', 'booth_location'],
    quizScore: 0,
    badges: [],
    lastUpdated: new Date()
  };

  console.log('\n🎮 Gamification Examples:\n');

  // Check for badges after completing steps
  console.log('Initial completed steps:', userProgress.completedSteps);
  const newBadges = gamificationService.checkAndAwardBadges(userProgress);
  
  console.log('\n🏆 Badges Earned:');
  newBadges.forEach(badge => {
    console.log(`${badge.icon} ${badge.name}`);
    console.log(`   ${badge.description}`);
  });

  // Calculate progress
  const progress = gamificationService.calculateProgress(userProgress.completedSteps);
  console.log(`\n📊 Overall Progress: ${progress}%`);

  // Get next action
  const nextAction = gamificationService.getNextAction(userProgress);
  console.log(`\n👉 Next Action: ${nextAction}`);
}

// ============================================================================
// Example 6: Quiz System
// ============================================================================

function example6_QuizSystem() {
  const gamificationService = new GamificationService();

  console.log('\n🎯 Quiz System Examples:\n');

  // Get random questions
  const easyQuestions = getRandomQuestions(3, 'easy');
  const mediumQuestions = getRandomQuestions(3, 'medium');
  const hardQuestions = getRandomQuestions(2, 'hard');

  console.log('Easy Questions:', easyQuestions.length);
  console.log('Medium Questions:', mediumQuestions.length);
  console.log('Hard Questions:', hardQuestions.length);

  // Display a sample question
  const sampleQuestion = easyQuestions[0];
  console.log('\n📝 Sample Question:\n');
  console.log(`Q: ${sampleQuestion.question}`);
  sampleQuestion.options.forEach((option, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D
    console.log(`${letter}) ${option}`);
  });
  console.log(`\nCorrect Answer: ${String.fromCharCode(65 + sampleQuestion.correctAnswer)}`);
  console.log(`Explanation: ${sampleQuestion.explanation}`);

  // Simulate quiz scoring
  const userAnswers = [1, 1, 0]; // User's answers for 3 questions
  const score = gamificationService.calculateQuizScore(easyQuestions, userAnswers);
  console.log(`\n📊 Quiz Score: ${score}%`);

  const scoreMessage = gamificationService.getScoreMessage(score);
  console.log(`💬 Feedback: ${scoreMessage}`);
}

// ============================================================================
// Example 7: Conversation History
// ============================================================================

async function example7_ConversationHistory() {
  const assistant = example1_CreateAssistant();

  // Have a conversation
  await assistant.processMessage("I want to register");
  await assistant.processMessage("What documents do I need?");
  await assistant.processMessage("How do I check my status?");

  // Get conversation history
  const history = assistant.getHistory();

  console.log('\n💬 Conversation History:\n');
  history.forEach((message, index) => {
    const role = message.role === 'user' ? '👤 User' : '🤖 Assistant';
    const preview = message.content.substring(0, 60) + '...';
    console.log(`${index + 1}. ${role}: ${preview}`);
    if (message.intent) {
      console.log(`   Intent: ${message.intent}`);
    }
  });

  // Clear history
  assistant.clearHistory();
  console.log('\n🗑️ History cleared');
}

// ============================================================================
// Example 8: Multi-User Support
// ============================================================================

function example8_MultiUser() {
  console.log('\n👥 Multi-User Support:\n');

  // Create assistants for different users
  const users = [
    {
      id: 'user-1',
      location: { country: 'india' as const, state: 'maharashtra' },
      language: 'en',
      isFirstTimeVoter: true
    },
    {
      id: 'user-2',
      location: { country: 'india' as const, state: 'karnataka' },
      language: 'hi',
      isFirstTimeVoter: false
    },
    {
      id: 'user-3',
      location: { country: 'india' as const, state: 'tamil-nadu' },
      language: 'ta',
      isFirstTimeVoter: true
    }
  ];

  users.forEach(user => {
    const assistant = new ElectionAssistantService(user);
    console.log(`✅ Assistant created for ${user.id}:`);
    console.log(`   Location: ${user.location.state}`);
    console.log(`   Language: ${user.language}`);
    console.log(`   First-time voter: ${user.isFirstTimeVoter}`);
  });
}

// ============================================================================
// Example 9: Error Handling
// ============================================================================

async function example9_ErrorHandling() {
  console.log('\n⚠️ Error Handling Examples:\n');

  const assistant = new ElectionAssistantService();

  try {
    // Process empty message
    await assistant.processMessage("");
    console.log('✅ Empty message handled gracefully');
  } catch (error) {
    console.log('❌ Error with empty message:', error);
  }

  try {
    // Process very long message
    const longMessage = "a".repeat(10000);
    await assistant.processMessage(longMessage);
    console.log('✅ Long message handled gracefully');
  } catch (error) {
    console.log('❌ Error with long message:', error);
  }

  try {
    // Process message with special characters
    await assistant.processMessage("How to vote? 🗳️ #elections @india");
    console.log('✅ Special characters handled gracefully');
  } catch (error) {
    console.log('❌ Error with special characters:', error);
  }
}

// ============================================================================
// Example 10: Complete User Journey
// ============================================================================

async function example10_CompleteJourney() {
  console.log('\n🚀 Complete User Journey:\n');

  // Step 1: Create user
  const user: User = {
    id: 'priya-123',
    location: { country: 'india', state: 'maharashtra' },
    language: 'en',
    isFirstTimeVoter: true,
    age: 19,
    registrationStatus: 'not_registered'
  };

  const assistant = new ElectionAssistantService(user);
  const gamificationService = new GamificationService();

  const userProgress: UserProgress = {
    userId: user.id,
    completedSteps: [],
    quizScore: 0,
    badges: [],
    lastUpdated: new Date()
  };

  console.log('👤 User: Priya, 19, Mumbai (First-time voter)\n');

  // Step 2: Learn about registration
  console.log('📝 Step 1: Learning about registration...');
  await assistant.processMessage("How do I register?");
  userProgress.completedSteps.push('registration');
  console.log('✅ Completed\n');

  // Step 3: Learn about documents
  console.log('📄 Step 2: Learning about documents...');
  await assistant.processMessage("What documents do I need?");
  userProgress.completedSteps.push('documents_learned');
  console.log('✅ Completed\n');

  // Step 4: Find polling booth
  console.log('📍 Step 3: Finding polling booth...');
  await assistant.processMessage("Where is my polling booth?");
  userProgress.completedSteps.push('booth_location');
  console.log('✅ Completed\n');

  // Step 5: Learn timeline
  console.log('📅 Step 4: Understanding timeline...');
  await assistant.processMessage("When are the elections?");
  userProgress.completedSteps.push('timeline_learned');
  console.log('✅ Completed\n');

  // Step 6: Learn voting process
  console.log('🗳️ Step 5: Learning voting process...');
  await assistant.processMessage("How to vote step by step?");
  userProgress.completedSteps.push('voting_process');
  console.log('✅ Completed\n');

  // Step 7: Take quiz
  console.log('🎯 Step 6: Taking quiz...');
  const questions = getRandomQuestions(5, 'medium');
  const answers = [1, 1, 0, 2, 1]; // Simulated answers
  userProgress.quizScore = gamificationService.calculateQuizScore(questions, answers);
  userProgress.completedSteps.push('quiz_completed');
  console.log(`✅ Quiz Score: ${userProgress.quizScore}%\n`);

  // Step 8: Check badges
  const badges = gamificationService.checkAndAwardBadges(userProgress, userProgress.quizScore);
  userProgress.badges = badges;

  console.log('🏆 Badges Earned:');
  badges.forEach(badge => {
    console.log(`   ${badge.icon} ${badge.name}`);
  });

  // Step 9: Check progress
  const progress = gamificationService.calculateProgress(userProgress.completedSteps);
  console.log(`\n📊 Overall Progress: ${progress}%`);

  // Step 10: Get next action
  const nextAction = gamificationService.getNextAction(userProgress);
  console.log(`\n👉 Next Action: ${nextAction}`);

  console.log('\n🎉 Journey Complete! Priya is ready to vote!');
}

// ============================================================================
// Run All Examples
// ============================================================================

async function runAllExamples() {
  console.log('='.repeat(80));
  console.log('🗳️  ELECTION EDUCATION ASSISTANT - USAGE EXAMPLES');
  console.log('='.repeat(80));

  try {
    example1_CreateAssistant();
    await example2_ProcessMessages();
    example3_IntentDetection();
    example4_ElectionInfo();
    example5_Gamification();
    example6_QuizSystem();
    await example7_ConversationHistory();
    example8_MultiUser();
    await example9_ErrorHandling();
    await example10_CompleteJourney();

    console.log('\n' + '='.repeat(80));
    console.log('✅ All examples completed successfully!');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}

// Export examples for use in other files
export {
  example1_CreateAssistant,
  example2_ProcessMessages,
  example3_IntentDetection,
  example4_ElectionInfo,
  example5_Gamification,
  example6_QuizSystem,
  example7_ConversationHistory,
  example8_MultiUser,
  example9_ErrorHandling,
  example10_CompleteJourney,
  runAllExamples
};
