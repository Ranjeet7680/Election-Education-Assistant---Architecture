# Visual Flows & System Diagrams

This document provides visual representations of how the Election Education Assistant works.

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │              │  │              │  │              │         │
│  │    Chat      │  │   Timeline   │  │     Quiz     │         │
│  │  Interface   │  │     View     │  │    Module    │         │
│  │              │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      ASSISTANT SERVICE                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Intent Detection → Context Analysis → Response Gen      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Conversation History → Progress Tracking → Badges       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Election │  │   Quiz   │  │   User   │  │  Locale  │      │
│  │   Data   │  │   Data   │  │ Progress │  │   Data   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 User Message Flow

```
┌─────────────┐
│    User     │
│   Types     │
│  Message    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────┐
│  1. MESSAGE RECEIVED                    │
│     "I want to register as a voter"     │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│  2. INTENT DETECTION                    │
│     Analyze keywords:                   │
│     - "register" → register intent      │
│     - "voter" → registration context    │
│     Result: 'register'                  │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│  3. CONTEXT ANALYSIS                    │
│     - User location: India, Maharashtra │
│     - First-time voter: Yes             │
│     - Language: English                 │
│     - Previous messages: None           │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│  4. DATA RETRIEVAL                      │
│     - Get India election info           │
│     - Get Maharashtra specifics         │
│     - Get registration steps            │
│     - Get required documents            │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│  5. RESPONSE GENERATION                 │
│     - Format registration guide         │
│     - Include step-by-step process      │
│     - Add document requirements         │
│     - Provide official URLs             │
│     - Add helpline number               │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│  6. PROGRESS UPDATE                     │
│     - Add 'registration' to completed   │
│     - Update conversation history       │
│     - Calculate new progress %          │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│  7. BADGE CHECK                         │
│     - Check if eligible for badges      │
│     - Award "First Time Voter Ready"    │
│     - Update user badges list           │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────┐
│  8. UI UPDATE                           │
│     - Display assistant response        │
│     - Show badge notification           │
│     - Update progress bar               │
│     - Scroll to latest message          │
└──────┬──────────────────────────────────┘
       │
       ↓
┌─────────────┐
│   User      │
│   Reads     │
│  Response   │
└─────────────┘
```

## 🎯 Intent Detection Flow

```
User Message: "What documents do I need to vote?"
                        ↓
┌───────────────────────────────────────────────────┐
│  KEYWORD ANALYSIS                                 │
│  - "documents" → document-related                 │
│  - "need" → requirement query                     │
│  - "vote" → voting context                        │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  INTENT MATCHING                                  │
│  ✓ Contains "document" → required_documents       │
│  ✗ Contains "register" → register                 │
│  ✗ Contains "booth" → find_booth                  │
│  ✗ Contains "timeline" → timeline                 │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  RESULT: required_documents                       │
└───────────────────────────────────────────────────┘
```

## 🏆 Gamification Flow

```
User completes an action (e.g., learns about registration)
                        ↓
┌───────────────────────────────────────────────────┐
│  UPDATE PROGRESS                                  │
│  completedSteps.push('registration')              │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  CHECK BADGE ELIGIBILITY                          │
│                                                   │
│  For each badge:                                  │
│  1. Check if already earned                       │
│  2. Check if conditions met                       │
│  3. Award if eligible                             │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  BADGE CONDITIONS                                 │
│                                                   │
│  🗳️ First Timer                                   │
│     ✓ 'first_time_guide' in completedSteps       │
│                                                   │
│  ✅ Registered Voter                              │
│     ✓ 'registration' in completedSteps           │
│                                                   │
│  🎯 Quiz Master                                   │
│     ✓ quizScore >= 80                            │
│                                                   │
│  💯 Perfect Score                                 │
│     ✓ quizScore === 100                          │
│                                                   │
│  👑 Democracy Champion                            │
│     ✓ All steps completed                        │
│     ✓ quizScore >= 80                            │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  AWARD BADGES                                     │
│  - Create badge with earnedAt timestamp           │
│  - Add to user's badge collection                 │
│  - Generate notification                          │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  CALCULATE PROGRESS                               │
│  progress = (completedSteps / totalSteps) * 100   │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  DETERMINE NEXT ACTION                            │
│  - Check which steps are incomplete               │
│  - Recommend next logical step                    │
└───────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────┐
│  NOTIFY USER                                      │
│  - Show badge earned animation                    │
│  - Update progress bar                            │
│  - Display next recommended action                │
└───────────────────────────────────────────────────┘
```

## 📝 Quiz Flow

```
User: "I want to take a quiz"
            ↓
┌─────────────────────────────────────┐
│  SHOW DIFFICULTY OPTIONS            │
│  1. 🟢 Easy                         │
│  2. 🟡 Medium                       │
│  3. 🔴 Hard                         │
│  4. 🎲 Mixed                        │
└─────────────────────────────────────┘
            ↓
User selects: "2" (Medium)
            ↓
┌─────────────────────────────────────┐
│  GET QUESTIONS                      │
│  - Filter by difficulty: medium     │
│  - Randomly select 5 questions      │
│  - Shuffle options                  │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  QUESTION 1 OF 5                    │
│  Display question and options       │
└─────────────────────────────────────┘
            ↓
User answers: "B"
            ↓
┌─────────────────────────────────────┐
│  CHECK ANSWER                       │
│  - Compare with correctAnswer       │
│  - Show ✅ or ❌                    │
│  - Display explanation              │
└─────────────────────────────────────┘
            ↓
Repeat for questions 2-5
            ↓
┌─────────────────────────────────────┐
│  CALCULATE SCORE                    │
│  score = (correct / total) * 100    │
│  Example: (4/5) * 100 = 80%         │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  GENERATE FEEDBACK                  │
│  100%: "Perfect! You're an expert!" │
│  80-99%: "Excellent! Well prepared!"│
│  60-79%: "Good! Review and retry"   │
│  40-59%: "Keep learning!"           │
│  0-39%: "Start with basics"         │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  CHECK FOR BADGES                   │
│  - Score >= 80 → Quiz Master 🎯     │
│  - Score = 100 → Perfect Score 💯   │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  DISPLAY RESULTS                    │
│  - Show score                       │
│  - Show badges earned               │
│  - Offer to retake or continue      │
└─────────────────────────────────────┘
```

## 🗺️ User Journey Map

### First-Time Voter Journey

```
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 1: AWARENESS                                              │
│  User hears about elections, wants to participate                │
│  Emotion: 😕 Confused, Uncertain                                 │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 2: DISCOVERY                                              │
│  User finds Election Education Assistant                         │
│  Action: Opens app, sees welcome message                         │
│  Emotion: 😊 Curious, Hopeful                                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 3: LEARNING - REGISTRATION                                │
│  User: "I want to vote for the first time"                       │
│  Assistant: Provides registration guide                          │
│  Action: User learns about eligibility, documents, process       │
│  Emotion: 😌 Relieved, Informed                                  │
│  Badge: 🗳️ First Time Voter Ready                               │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 4: LEARNING - DOCUMENTS                                   │
│  User: "What documents do I need?"                               │
│  Assistant: Lists required documents with alternatives           │
│  Action: User checks what they have                              │
│  Emotion: 😊 Confident, Prepared                                 │
│  Badge: 📄 Document Ready                                        │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 5: LEARNING - TIMELINE                                    │
│  User: "When are the elections?"                                 │
│  Assistant: Shows 6-phase timeline with deadlines                │
│  Action: User understands what to do when                        │
│  Emotion: 😌 Clear, Organized                                    │
│  Badge: 📚 Informed Citizen                                      │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 6: LEARNING - BOOTH LOCATION                              │
│  User: "Where is my polling booth?"                              │
│  Assistant: Provides 4 methods to find booth                     │
│  Action: User finds their booth location                         │
│  Emotion: 😊 Ready, Excited                                      │
│  Badge: 📍 Booth Finder                                          │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 7: LEARNING - VOTING PROCESS                              │
│  User: "How to vote step by step?"                               │
│  Assistant: Detailed 7-step voting guide                         │
│  Action: User learns complete voting process                     │
│  Emotion: 😊 Confident, Empowered                                │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 8: TESTING KNOWLEDGE                                      │
│  User: "I want to take a quiz"                                   │
│  Assistant: Offers quiz with instant feedback                    │
│  Action: User takes quiz, scores 90%                             │
│  Emotion: 😄 Accomplished, Proud                                 │
│  Badge: 🎯 Quiz Master                                           │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 9: COMPLETION                                             │
│  Progress: 100%                                                  │
│  Badges: 6 earned                                                │
│  Emotion: 🎉 Excited, Ready to Vote!                             │
│  Badge: 👑 Democracy Champion                                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  STAGE 10: ACTION                                                │
│  User registers, votes on election day                           │
│  Emotion: 😊 Proud, Empowered                                    │
│  Outcome: Successful first-time voter!                           │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION STATE                          │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │   User Context   │  │ Conversation     │                   │
│  │  - location      │  │  - messages[]    │                   │
│  │  - language      │  │  - history       │                   │
│  │  - isFirstTime   │  │                  │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │  User Progress   │  │   UI State       │                   │
│  │  - completed[]   │  │  - isLoading     │                   │
│  │  - badges[]      │  │  - activeView    │                   │
│  │  - quizScore     │  │  - inputValue    │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    State Updates Trigger
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      REACT RE-RENDER                            │
│                                                                 │
│  - Update message list                                          │
│  - Update progress bar                                          │
│  - Show badge notifications                                     │
│  - Update button states                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🌍 Multi-Country Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    COUNTRY DETECTION                            │
│                                                                 │
│  User Location → Country Code → Data Source                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    INDIA     │      │     USA      │      │      UK      │
│              │      │              │      │              │
│ • ECI Data   │      │ • EAC Data   │      │ • EC Data    │
│ • 29 States  │      │ • 50 States  │      │ • Regions    │
│ • Hindi/Eng  │      │ • English    │      │ • English    │
│ • Helpline   │      │ • Helpline   │      │ • Helpline   │
│   1950       │      │   866-OUR    │      │   0800-xxx   │
└──────────────┘      └──────────────┘      └──────────────┘
        ↓                     ↓                     ↓
┌─────────────────────────────────────────────────────────────────┐
│              UNIFIED ELECTION INFO INTERFACE                    │
│                                                                 │
│  - phases[]                                                     │
│  - requiredDocuments[]                                          │
│  - votingSteps[]                                                │
│  - registrationUrl                                              │
│  - officialSourceUrl                                            │
│  - helplineNumber                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📱 Responsive Design Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEVICE DETECTION                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   MOBILE     │      │    TABLET    │      │   DESKTOP    │
│  < 768px     │      │  768-1024px  │      │   > 1024px   │
└──────────────┘      └──────────────┘      └──────────────┘
        ↓                     ↓                     ↓
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ • Stack      │      │ • 2 Columns  │      │ • 3 Columns  │
│ • Full Width │      │ • Sidebar    │      │ • Sidebar    │
│ • Touch      │      │ • Touch/     │      │ • Mouse      │
│   Optimized  │      │   Mouse      │      │   Optimized  │
└──────────────┘      └──────────────┘      └──────────────┘
```

## 🔐 Security & Trust Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT REQUEST                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SOURCE VERIFICATION                          │
│                                                                 │
│  ✓ Is data from official election commission?                  │
│  ✓ Is URL from verified government domain?                     │
│  ✓ Is helpline number official?                                │
│  ✓ Is content politically neutral?                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                        ┌─────┴─────┐
                        ↓           ↓
                   ✅ VERIFIED   ❌ UNVERIFIED
                        ↓           ↓
              ┌─────────────┐  ┌─────────────┐
              │   DISPLAY   │  │   REJECT    │
              │   CONTENT   │  │   CONTENT   │
              │             │  │             │
              │ + Source    │  │ + Log       │
              │   Link      │  │   Warning   │
              │ + Helpline  │  │             │
              └─────────────┘  └─────────────┘
```

---

These visual flows help understand how different parts of the system work together to create a seamless, engaging, and trustworthy election education experience.
