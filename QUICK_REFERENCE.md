# Quick Reference Guide

A cheat sheet for developers working with the Election Education Assistant.

## 🚀 Quick Start Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build

# Testing & Quality
npm run test         # Run tests
npm run lint         # Lint code
npm run type-check   # Check TypeScript types
```

## 📁 Key Files & Directories

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Main application component |
| `src/components/ChatInterface.tsx` | Chat UI component |
| `src/services/assistant-service.ts` | Core assistant logic |
| `src/services/gamification-service.ts` | Badge & progress system |
| `src/data/india-election-data.ts` | India election data |
| `src/data/quiz-data.ts` | Quiz questions |
| `src/types/election.ts` | TypeScript type definitions |
| `src/locales/` | Translation files |

## 🎯 Intent Types

| Intent | Trigger Keywords | Response Type |
|--------|-----------------|---------------|
| `register` | register, registration, sign up | Registration guide |
| `required_documents` | document, ID, proof | Document list |
| `timeline` | timeline, when, date, schedule | Election phases |
| `find_booth` | booth, polling station, where | Booth finder guide |
| `check_status` | check, status, voter list | Status check guide |
| `learn_process` | how, process, step, vote | Voting process |
| `quiz` | quiz, test, game | Quiz module |

## 🏆 Badge System

| Badge | ID | Condition |
|-------|----|-----------| 
| 🗳️ First Time Voter Ready | `first_timer` | Complete first-time guide |
| 🎯 Quiz Master | `quiz_master` | Score ≥ 80% in quiz |
| ✅ Registered Voter | `registered` | Complete registration |
| 📚 Informed Citizen | `informed_citizen` | Learn all phases |
| 📍 Booth Finder | `booth_finder` | Find polling booth |
| 📄 Document Ready | `document_ready` | Learn about documents |
| 💯 Perfect Score | `perfect_score` | Score 100% in quiz |
| 👑 Democracy Champion | `democracy_champion` | Complete everything |

## 📊 Progress Steps

| Step ID | Description |
|---------|-------------|
| `registration` | Learned about registration |
| `documents_learned` | Learned about documents |
| `booth_location` | Found polling booth |
| `timeline_learned` | Understood timeline |
| `voting_process` | Learned voting process |
| `quiz_completed` | Completed quiz |

## 🌍 Country Codes

| Country | Code | Status |
|---------|------|--------|
| India | `india` | ✅ Implemented |
| USA | `usa` | 🔄 Extensible |
| UK | `uk` | 🔄 Extensible |

## 🗣️ Language Codes

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Full support |
| Hindi | `hi` | ✅ Full support |
| Tamil | `ta` | 🔄 Ready to add |
| Telugu | `te` | 🔄 Ready to add |

## 🔧 Common Code Snippets

### Create Assistant Instance

```typescript
import { ElectionAssistantService } from './services/assistant-service';
import { User } from './types/election';

const user: User = {
  id: 'user-123',
  location: { country: 'india', state: 'maharashtra' },
  language: 'en',
  isFirstTimeVoter: true
};

const assistant = new ElectionAssistantService(user);
```

### Process User Message

```typescript
const response = await assistant.processMessage("I want to register");
console.log(response.content);
console.log(response.intent); // 'register'
```

### Check for Badges

```typescript
import { gamificationService } from './services/gamification-service';

const userProgress = {
  userId: 'user-123',
  completedSteps: ['registration', 'documents_learned'],
  quizScore: 85,
  badges: [],
  lastUpdated: new Date()
};

const newBadges = gamificationService.checkAndAwardBadges(
  userProgress,
  userProgress.quizScore
);
```

### Get Random Quiz Questions

```typescript
import { getRandomQuestions } from './data/quiz-data';

// Get 5 random medium difficulty questions
const questions = getRandomQuestions(5, 'medium');

// Get 3 random questions of any difficulty
const mixedQuestions = getRandomQuestions(3);
```

### Calculate Quiz Score

```typescript
import { gamificationService } from './services/gamification-service';

const questions = [/* quiz questions */];
const userAnswers = [1, 0, 2, 1, 0]; // User's answer indices

const score = gamificationService.calculateQuizScore(
  questions,
  userAnswers
);
console.log(`Score: ${score}%`);
```

### Get Election Info

```typescript
import { getIndiaElectionInfo } from './data/india-election-data';

const info = getIndiaElectionInfo('maharashtra');
console.log(info.phases);
console.log(info.requiredDocuments);
console.log(info.votingSteps);
```

## 🎨 Styling Quick Reference

### Colors

```typescript
const colors = {
  primary: '#2563eb',      // Blue
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Orange
  error: '#ef4444',        // Red
  text: '#1f2937',         // Dark gray
  textLight: '#6b7280',    // Light gray
  background: '#f5f5f5',   // Light background
  white: '#ffffff'
};
```

### Common Styles

```typescript
// Button
const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

// Input
const inputStyle = {
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px'
};

// Card
const cardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};
```

## 📝 TypeScript Interfaces

### User

```typescript
interface User {
  id: string;
  location: Location;
  language: string;
  isFirstTimeVoter: boolean;
  age?: number;
  registrationStatus?: 'not_registered' | 'pending' | 'registered';
}
```

### Location

```typescript
interface Location {
  country: 'india' | 'usa' | 'uk';
  state?: string;
  district?: string;
  constituency?: string;
}
```

### Message

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: ConversationIntent;
  metadata?: Record<string, any>;
}
```

### ElectionInfo

```typescript
interface ElectionInfo {
  country: Country;
  state?: string;
  electionType: ElectionType;
  phases: ElectionPhase[];
  requiredDocuments: Document[];
  votingSteps: VotingStep[];
  registrationUrl?: string;
  voterListCheckUrl?: string;
  officialSourceUrl: string;
  helplineNumber?: string;
}
```

### UserProgress

```typescript
interface UserProgress {
  userId: string;
  completedSteps: string[];
  quizScore: number;
  badges: Badge[];
  lastUpdated: Date;
}
```

## 🔍 Debugging Tips

### Enable Debug Logs

```typescript
// In assistant-service.ts
private debug = true;

// In your code
if (this.debug) {
  console.log('Debug info:', data);
}
```

### Check State

```typescript
// Check conversation history
console.log(assistant.getHistory());

// Check user progress
console.log(userProgress);

// Check badges
console.log(userProgress.badges);
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Intent not detected | Add more keywords to `detectIntent()` |
| Badge not awarded | Check `completedSteps` array |
| Message not displaying | Check message format and state update |
| Quiz score wrong | Verify answer indices match |

## 🧪 Testing Patterns

### Unit Test

```typescript
import { describe, it, expect } from 'vitest';

describe('ElectionAssistantService', () => {
  it('should detect registration intent', () => {
    const assistant = new ElectionAssistantService();
    const intent = assistant.detectIntent('I want to register');
    expect(intent).toBe('register');
  });
});
```

### Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('ChatInterface', () => {
  it('should send message on button click', () => {
    render(<ChatInterface assistant={mockAssistant} />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const button = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);
    
    expect(mockAssistant.processMessage).toHaveBeenCalled();
  });
});
```

## 📚 Useful Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

### Election Commission Links
- [India ECI](https://eci.gov.in/)
- [USA EAC](https://www.eac.gov/)
- [UK Electoral Commission](https://www.electoralcommission.org.uk/)

### Internal Docs
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Implementation details
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## 🎯 Performance Tips

### Optimization Checklist
- [ ] Use `React.memo()` for expensive components
- [ ] Implement code splitting with `lazy()`
- [ ] Memoize expensive calculations with `useMemo()`
- [ ] Debounce user input
- [ ] Lazy load images
- [ ] Minimize bundle size

### Example: Memoization

```typescript
import { useMemo } from 'react';

const sortedMessages = useMemo(
  () => messages.sort((a, b) => a.timestamp - b.timestamp),
  [messages]
);
```

## 🔐 Security Checklist

- [ ] Validate all user input
- [ ] Sanitize HTML content
- [ ] Use HTTPS in production
- [ ] Don't commit API keys
- [ ] Implement rate limiting
- [ ] Keep dependencies updated

## 📦 Deployment Checklist

- [ ] Run tests: `npm run test`
- [ ] Check types: `npm run type-check`
- [ ] Lint code: `npm run lint`
- [ ] Build: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Update version number
- [ ] Update CHANGELOG
- [ ] Create git tag
- [ ] Deploy to hosting

## 🆘 Getting Help

### Quick Links
- [GitHub Issues](https://github.com/your-repo/issues)
- [GitHub Discussions](https://github.com/your-repo/discussions)
- [Documentation](README.md)

### Contact
- Email: support@example.com
- Twitter: @electionedu

---

**Pro Tip**: Bookmark this page for quick reference while developing! 🔖
