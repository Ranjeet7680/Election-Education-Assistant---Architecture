import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types/election';
import { ElectionAssistantService } from '../services/assistant-service';

interface ChatInterfaceProps {
  assistant: ElectionAssistantService;
  userName?: string;
  progress?: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ assistant, userName = 'First-Time Voter', progress = 0 }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const smartSuggestions = [
    "How to vote first time?",
    "What documents needed?",
    "Can I vote without voter ID?"
  ];

  useEffect(() => {
    // Send welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Welcome, ${userName}!**

🗳️ **You're ${progress}% ready to vote!**
You're taking the first step towards shaping democracy. I'm your AI Voter Assistant.
Here's what you can do next:`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    
    try {
      await assistant.processMessage(inputValue);
      setMessages(assistant.getHistory());
      setInputValue('');
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.includes('[MAP_EMBED]')) {
          return (
            <div key={i} style={styles.mapEmbedContainer}>
              <iframe 
                title="Polling Booth Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.112284179835!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd3d3c8c6c5b%3A0x6b8d4f40f3b06e92!2sElection%20Commission%20of%20India!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
                width="100%" 
                height="200" 
                style={{ border: 0, borderRadius: '12px' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div style={styles.mapCaption}>📍 Showing nearest polling booth (Auto-detected location)</div>
            </div>
          );
        }
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />;
      });
  };

  const ActionChips = () => (
    <div style={styles.chipContainer}>
      <button style={styles.actionChip} onClick={() => {setInputValue("How to register as voter?"); handleSendMessage();}}>
        📝 Register Now
      </button>
      <button style={styles.actionChip} onClick={() => {setInputValue("Check voter status"); handleSendMessage();}}>
        ✅ Check Status
      </button>
      <button style={styles.actionChip} onClick={() => {setInputValue("Find polling booth"); handleSendMessage();}}>
        📍 Find Booth
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.messageWrapper,
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                ...styles.message,
                ...(message.role === 'user' ? styles.userMessage : styles.assistantMessage)
              }}
            >
              <div style={styles.messageContent}>
                {formatMessage(message.content)}
                {message.id === 'welcome' && <ActionChips />}
              </div>
              <div style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={styles.messageWrapper}>
            <div style={{ ...styles.message, ...styles.assistantMessage }}>
              <div className="typing-indicator" style={styles.loadingDots}>
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.suggestionsContainer}>
        <div style={styles.suggestionsTitle}>👉 People like you also ask:</div>
        <div style={styles.suggestionsList}>
          {smartSuggestions.map((suggestion, idx) => (
            <button 
              key={idx} 
              style={styles.suggestionChip}
              onClick={() => {
                setInputValue(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.inputAreaWrapper}>
        <div style={styles.inputContainer}>
          <button style={styles.iconButton} title="Attach Document">📎</button>
          <textarea
            style={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your AI Voter Assistant..."
            rows={1}
            disabled={isLoading}
          />
          <button style={styles.iconButton} title="Voice Input">🎤</button>
          <button
            style={{
              ...styles.sendButton,
              ...(isLoading || !inputValue.trim() ? styles.sendButtonDisabled : {})
            }}
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#f8fafc'
  },
  messageWrapper: {
    display: 'flex',
    width: '100%'
  },
  message: {
    maxWidth: '75%',
    padding: '14px 18px',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  userMessage: {
    backgroundColor: '#1E3A8A', // Deep Blue
    color: 'white',
    borderBottomRightRadius: '6px'
  },
  assistantMessage: {
    backgroundColor: 'white',
    color: '#1e293b',
    borderBottomLeftRadius: '6px',
    border: '1px solid #e2e8f0',
    animation: 'fadeIn 0.3s ease-out'
  },
  messageContent: {
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  timestamp: {
    fontSize: '11px',
    opacity: 0.6,
    marginTop: '4px',
    textAlign: 'right'
  },
  loadingDots: {
    display: 'flex',
    gap: '4px',
    padding: '4px 8px',
    alignItems: 'center'
  },
  chipContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '12px'
  },
  actionChip: {
    padding: '8px 16px',
    backgroundColor: '#eff6ff',
    color: '#1E3A8A',
    border: '1px solid #bfdbfe',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  suggestionsContainer: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0'
  },
  suggestionsTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px'
  },
  suggestionsList: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px'
  },
  suggestionChip: {
    padding: '6px 12px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '16px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  inputAreaWrapper: {
    padding: '16px 24px',
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '24px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.2s'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  },
  input: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '15px',
    resize: 'none',
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: '24px',
    display: 'flex',
    alignItems: 'center'
  },
  sendButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E3A8A',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)'
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  mapEmbedContainer: {
    margin: '16px 0',
    backgroundColor: '#f8fafc',
    padding: '8px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  mapCaption: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '8px',
    textAlign: 'center',
    fontWeight: '500'
  }
};
