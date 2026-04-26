import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ElectionAssistantService } from './services/assistant-service';
import { User } from './types/election';

function App() {
  const [user] = useState<User>(() => {
    // Initialize with default user (India)
    return {
      id: 'user-1',
      location: {
        country: 'india',
        state: 'maharashtra'
      },
      language: 'en',
      isFirstTimeVoter: true,
      age: 19,
      registrationStatus: 'not_registered'
    };
  });

  const [assistant] = useState(() => {
    return new ElectionAssistantService(user);
  });

  return (
    <div className="App">
      <Dashboard user={user} assistant={assistant} />
    </div>
  );
}

export default App;
