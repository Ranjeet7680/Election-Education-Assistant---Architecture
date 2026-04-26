import { Message, ConversationIntent, User, ElectionInfo } from '../types/election';
import { getIndiaElectionInfo } from '../data/india-election-data';

/**
 * Core service for the election education assistant
 * Handles conversation flow, intent detection, and response generation
 */

export class ElectionAssistantService {
  private conversationHistory: Message[] = [];
  private user: User | null = null;

  constructor(user?: User) {
    this.user = user || null;
  }

  /**
   * Detect user intent from their message
   */
  detectIntent(message: string): ConversationIntent {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('register') || lowerMessage.includes('registration')) {
      return 'register';
    }
    if (lowerMessage.includes('document') || lowerMessage.includes('id') || lowerMessage.includes('proof')) {
      return 'required_documents';
    }
    if (lowerMessage.includes('timeline') || lowerMessage.includes('when') || lowerMessage.includes('date')) {
      return 'timeline';
    }
    if (lowerMessage.includes('booth') || lowerMessage.includes('polling station') || lowerMessage.includes('where')) {
      return 'find_booth';
    }
    if (lowerMessage.includes('check') || lowerMessage.includes('status') || lowerMessage.includes('voter list')) {
      return 'check_status';
    }
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('game')) {
      return 'quiz';
    }
    if (lowerMessage.includes('how') || lowerMessage.includes('process') || lowerMessage.includes('step')) {
      return 'learn_process';
    }

    return 'general_question';
  }

  /**
   * Generate response based on intent and user context
   */
  generateResponse(userMessage: string, intent: ConversationIntent): string {
    const electionInfo = this.getElectionInfo();

    switch (intent) {
      case 'register':
        return this.generateRegistrationResponse(electionInfo);
      
      case 'required_documents':
        return this.generateDocumentsResponse(electionInfo);
      
      case 'timeline':
        return this.generateTimelineResponse(electionInfo);
      
      case 'find_booth':
        return this.generateBoothFinderResponse(electionInfo);
      
      case 'check_status':
        return this.generateStatusCheckResponse(electionInfo);
      
      case 'learn_process':
        return this.generateProcessResponse(electionInfo);
      
      case 'quiz':
        return this.generateQuizResponse();
      
      default:
        return this.generateGeneralResponse(userMessage);
    }
  }

  private getElectionInfo(): ElectionInfo {
    if (this.user?.location.country === 'india') {
      return getIndiaElectionInfo(this.user.location.state);
    }
    // Default to India for now
    return getIndiaElectionInfo();
  }

  private generateRegistrationResponse(info: ElectionInfo): string {
    return `📝 **Voter Registration Guide**

To register as a voter, follow these simple steps:

**Step 1: Check Eligibility**
✓ You must be 18 years or older
✓ You must be an Indian citizen
✓ You should be a resident of the constituency where you want to register

**Step 2: Gather Required Documents**
${info.requiredDocuments.map(doc => `• ${doc.name}${doc.required ? ' (Required)' : ' (Optional)'}`).join('\n')}

**Step 3: Apply Online**
Visit: ${info.registrationUrl}
Or download the Voter Helpline App

**Step 4: Fill Form 6**
Complete the online registration form with your details

**Step 5: Submit & Track**
Submit your application and track its status online

**Need Help?**
Call helpline: ${info.helplineNumber}

Would you like me to explain any specific step in detail?`;
  }

  private generateDocumentsResponse(info: ElectionInfo): string {
    const docs = info.requiredDocuments.map(doc => {
      const alternatives = doc.alternatives ? `\n  Alternatives: ${doc.alternatives.join(', ')}` : '';
      return `📄 **${doc.name}** ${doc.required ? '(Required)' : '(Optional)'}\n  ${doc.description}${alternatives}`;
    }).join('\n\n');

    return `📋 **Documents You Need**

For Registration:
${docs}

For Voting:
You need to carry **any ONE** valid photo ID:
• Voter ID (EPIC)
• Aadhaar Card
• Passport
• Driving License
• PAN Card
• Service ID (for government employees)

⚠️ Important: Carry original documents, not photocopies!

Need help with any specific document?`;
  }

  private generateTimelineResponse(info: ElectionInfo): string {
    const phases = info.phases.map((phase, index) => {
      const status = phase.status === 'active' ? '🔵 ACTIVE' : 
                     phase.status === 'completed' ? '✅ COMPLETED' : 
                     '⏳ UPCOMING';
      const action = phase.userAction ? `\n  👉 Your Action: ${phase.userAction}` : '';
      const deadline = phase.actionDeadline ? `\n  ⏰ Deadline: ${phase.actionDeadline.toLocaleDateString()}` : '';
      
      return `${index + 1}. **${phase.name}** ${status}\n  ${phase.description}${action}${deadline}`;
    }).join('\n\n');

    return `📅 **Election Timeline**

${phases}

💡 Tip: Set reminders for important deadlines!

Would you like to know more about any specific phase?`;
  }

  private generateBoothFinderResponse(info: ElectionInfo): string {
    return `📍 **Find Your Polling Booth**

**Method 1: Online Search**
Visit: ${info.voterListCheckUrl}
• Enter your details (EPIC number or name)
• Your polling booth address will be displayed

**Method 2: Voter Helpline App**
• Download "Voter Helpline" app
• Search by EPIC number or name
• Get directions to your booth

**Method 3: SMS**
Send SMS to 166 or 51969:
Format: EPIC <your voter ID number>

**Method 4: Call Helpline**
Call ${info.helplineNumber} for assistance

💡 Tip: Note down your booth address and visit it once before election day to know the route!

[MAP_EMBED]

Need help finding your booth?`;
  }

  private generateStatusCheckResponse(info: ElectionInfo): string {
    return `🔍 **Check Your Voter Registration Status**

**Online Check:**
1. Visit: ${info.voterListCheckUrl}
2. Select your state
3. Search by:
   • EPIC Number (Voter ID), OR
   • Name and other details

**Mobile App:**
Download "Voter Helpline" app and search your name

**What to Check:**
✓ Your name is spelled correctly
✓ Your age and address are correct
✓ Your polling booth location

**If Your Name is Missing:**
• You need to register first
• Visit: ${info.registrationUrl}

**If Details are Wrong:**
• Apply for correction using Form 8
• Visit the registration portal

Need help checking your status?`;
  }

  private generateProcessResponse(info: ElectionInfo): string {
    const steps = info.votingSteps.slice(0, 5).map(step => 
      `**${step.order}. ${step.title}**\n${step.description}`
    ).join('\n\n');

    return `🗳️ **How to Vote: Complete Process**

${steps}

This is a simplified overview. Would you like:
1. Detailed step-by-step guide
2. Common mistakes to avoid
3. Video tutorial
4. Take a quiz to test your knowledge

What would you like to explore?`;
  }

  private generateQuizResponse(): string {
    return `🎯 **Test Your Voting Knowledge!**

Let's see how much you know about elections and voting!

Choose difficulty level:
1. 🟢 Easy - Basic questions
2. 🟡 Medium - Moderate difficulty
3. 🔴 Hard - Challenging questions
4. 🎲 Mixed - Random questions

Type the number to start your quiz!

🏆 Complete the quiz to earn badges!`;
  }

  private generateGeneralResponse(_message: string): string {
    return `I'm here to help you understand the election process! 

I can help you with:
🗳️ **How to vote** - Step-by-step voting process
📝 **Register as voter** - Complete registration guide
📅 **Election timeline** - Important dates and deadlines
🧾 **Required documents** - What you need to bring
📍 **Find polling booth** - Locate your voting station
✅ **Check voter status** - Verify your registration
🎯 **Take a quiz** - Test your knowledge

What would you like to know?`;
  }

  /**
   * Process a user message and return assistant response
   */
  async processMessage(userMessage: string): Promise<Message> {
    // Add user message to history
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    this.conversationHistory.push(userMsg);

    // Detect intent
    const intent = this.detectIntent(userMessage);

    // Generate response
    const responseContent = this.generateResponse(userMessage, intent);

    // Create assistant message
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      intent
    };
    this.conversationHistory.push(assistantMsg);

    return assistantMsg;
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return this.conversationHistory;
  }

  /**
   * Set user context
   */
  setUser(user: User): void {
    this.user = user;
  }

  /**
   * Clear conversation
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }
}
