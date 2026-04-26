# Contributing to Election Education Assistant

First off, thank you for considering contributing to the Election Education Assistant! It's people like you that make this project a great tool for empowering citizens worldwide.

## 🌟 Ways to Contribute

### 1. Report Bugs 🐛
- Use the GitHub issue tracker
- Describe the bug clearly
- Include steps to reproduce
- Mention your environment (OS, browser, etc.)

### 2. Suggest Features 💡
- Open an issue with the "feature request" label
- Explain the use case
- Describe the expected behavior
- Consider implementation challenges

### 3. Improve Documentation 📚
- Fix typos or unclear explanations
- Add examples
- Translate documentation
- Create tutorials or guides

### 4. Write Code 💻
- Fix bugs
- Implement new features
- Improve performance
- Add tests

### 5. Add Election Data 🌍
- Add support for new countries
- Update existing election information
- Add regional variations
- Translate content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- Basic knowledge of React and TypeScript

### Setup Development Environment

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/election-education-assistant.git
cd election-education-assistant

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/election-education-assistant.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure
```
src/
├── components/     # React components
├── services/       # Business logic
├── data/           # Election data
├── types/          # TypeScript definitions
└── locales/        # Translations
```

## 📝 Development Workflow

### 1. Create a Branch
```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes
```bash
# Run tests
npm run test

# Check TypeScript
npm run type-check

# Lint code
npm run lint
```

### 4. Commit Your Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add support for UK elections"
```

#### Commit Message Format
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add voice assistant support
fix: correct intent detection for registration queries
docs: update installation instructions
style: format code with prettier
refactor: simplify gamification service
test: add tests for quiz scoring
chore: update dependencies
```

### 5. Push and Create Pull Request
```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create a Pull Request
```

## 🎯 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type
- Use strict mode

```typescript
// Good
interface User {
  id: string;
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}

// Bad
function greetUser(user: any) {
  return `Hello, ${user.name}!`;
}
```

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use meaningful prop names
- Add prop types

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// Bad
export const Button = (props: any) => {
  return <button onClick={props.click}>{props.text}</button>;
};
```

### Naming Conventions
- **Files**: `kebab-case.ts` or `PascalCase.tsx` for components
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase`
- **Functions**: `camelCase`

```typescript
// Good
const userName = 'John';
const MAX_RETRIES = 3;
interface UserProfile { }
function getUserData() { }

// Bad
const UserName = 'John';
const maxretries = 3;
interface userprofile { }
function GetUserData() { }
```

### Code Organization
- One component per file
- Group related functions
- Keep files under 300 lines
- Extract reusable logic into services

### Comments
- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for public functions

```typescript
/**
 * Calculate quiz score based on correct answers
 * @param questions - Array of quiz questions
 * @param userAnswers - Array of user's answer indices
 * @returns Score as percentage (0-100)
 */
function calculateQuizScore(
  questions: QuizQuestion[],
  userAnswers: number[]
): number {
  // Implementation
}
```

## 🌍 Adding Support for New Countries

### Step 1: Create Data File
```typescript
// src/data/uk-election-data.ts
import { ElectionInfo } from '../types/election';

export const ukElectionPhases = [
  // Define phases
];

export const ukRequiredDocuments = [
  // Define documents
];

export const ukVotingSteps = [
  // Define steps
];

export const getUKElectionInfo = (region?: string): ElectionInfo => {
  return {
    country: 'uk',
    // ... rest of the data
  };
};
```

### Step 2: Update Assistant Service
```typescript
// src/services/assistant-service.ts
import { getUKElectionInfo } from '../data/uk-election-data';

private getElectionInfo(): ElectionInfo {
  switch (this.user?.location.country) {
    case 'uk':
      return getUKElectionInfo(this.user.location.state);
    // ... other cases
  }
}
```

### Step 3: Add Tests
```typescript
// src/data/__tests__/uk-election-data.test.ts
describe('UK Election Data', () => {
  it('should return valid election info', () => {
    const info = getUKElectionInfo();
    expect(info.country).toBe('uk');
    expect(info.phases.length).toBeGreaterThan(0);
  });
});
```

### Step 4: Add Documentation
Update relevant documentation files with UK-specific information.

## 🌐 Adding Translations

### Step 1: Create Translation File
```json
// src/locales/fr.json
{
  "common": {
    "welcome": "Bienvenue à l'Assistant d'Éducation Électorale",
    "loading": "Chargement...",
    "next": "Suivant"
  }
}
```

### Step 2: Update i18n Configuration
```typescript
// src/services/i18n-service.ts
import fr from '../locales/fr.json';

i18n.init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    fr: { translation: fr }
  }
});
```

## 🧪 Testing Guidelines

### Unit Tests
- Test individual functions
- Mock external dependencies
- Aim for 80%+ coverage

```typescript
import { describe, it, expect } from 'vitest';
import { calculateQuizScore } from '../gamification-service';

describe('calculateQuizScore', () => {
  it('should return 100 for all correct answers', () => {
    const questions = [/* ... */];
    const answers = [0, 1, 2];
    const score = calculateQuizScore(questions, answers);
    expect(score).toBe(100);
  });

  it('should return 0 for all wrong answers', () => {
    const questions = [/* ... */];
    const answers = [1, 0, 0];
    const score = calculateQuizScore(questions, answers);
    expect(score).toBe(0);
  });
});
```

### Integration Tests
- Test component interactions
- Test user flows
- Use React Testing Library

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInterface } from '../ChatInterface';

describe('ChatInterface', () => {
  it('should send message when button clicked', () => {
    render(<ChatInterface assistant={mockAssistant} />);
    
    const input = screen.getByPlaceholderText('Ask me anything...');
    const button = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);
    
    expect(mockAssistant.processMessage).toHaveBeenCalledWith('Hello');
  });
});
```

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] PR description explains changes clearly
- [ ] Screenshots included for UI changes
- [ ] No merge conflicts with main branch

## 🔍 Code Review Process

### What We Look For
- **Correctness**: Does it work as intended?
- **Quality**: Is the code clean and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is it well documented?
- **Performance**: Are there any performance issues?
- **Security**: Are there any security concerns?

### Review Timeline
- Initial review: Within 2-3 days
- Follow-up reviews: Within 1-2 days
- Merge: After approval from maintainers

### Addressing Feedback
- Be open to suggestions
- Ask questions if unclear
- Make requested changes
- Push updates to the same branch

## 🎨 UI/UX Guidelines

### Design Principles
- **Simplicity**: Keep interfaces clean and uncluttered
- **Consistency**: Use consistent patterns and styles
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Responsiveness**: Support all screen sizes

### Accessibility
- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

```typescript
// Good - Accessible button
<button
  onClick={handleClick}
  aria-label="Submit registration form"
  disabled={isLoading}
>
  Submit
</button>

// Bad - Inaccessible div
<div onClick={handleClick}>
  Submit
</div>
```

## 🐛 Bug Report Template

When reporting bugs, include:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 96]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Feature Request Template

When suggesting features, include:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or other context.
```

## 📞 Getting Help

### Resources
- **Documentation**: Read the docs in the repo
- **Examples**: Check the `examples/` directory
- **Issues**: Search existing issues
- **Discussions**: Join GitHub Discussions

### Contact
- **GitHub Issues**: For bugs and features
- **GitHub Discussions**: For questions and ideas
- **Email**: support@example.com

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📜 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

### Enforcement
Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to: conduct@example.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to democracy education! 🗳️

Every contribution, no matter how small, makes a difference in empowering citizens worldwide.
