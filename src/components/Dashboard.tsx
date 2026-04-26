import React, { useState } from 'react';
import { User, UserProgress } from '../types/election';
import { ElectionAssistantService } from '../services/assistant-service';
import { gamificationService } from '../services/gamification-service';
import { ChatInterface } from './ChatInterface';
import { TimelineView } from './TimelineView';
import { QuizView } from './QuizView';
import { BadgesView } from './BadgesView';
import { ProfileView } from './ProfileView';
import { AnalyticsView } from './AnalyticsView';

interface DashboardProps {
  user: User;
  assistant: ElectionAssistantService;
}

type ViewType = 'chat' | 'timeline' | 'quiz' | 'badges' | 'profile' | 'analytics';

export const Dashboard: React.FC<DashboardProps> = ({ user, assistant }) => {
  const [activeView, setActiveView] = useState<ViewType>('chat');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: user.id,
    completedSteps: [],
    quizScore: 0,
    badges: [],
    lastUpdated: new Date()
  });

  const progress = gamificationService.calculateProgress(userProgress.completedSteps);
  const nextAction = gamificationService.getNextAction(userProgress);

  const getMenuStatus = (id: ViewType) => {
    const completed = userProgress.completedSteps;
    
    // Dynamic status logic
    if (id === 'chat') return '✅'; // Chat is always accessible/completed initially
    if (id === 'timeline') return completed.includes('timeline_learned') ? '✅' : '🔓';
    if (id === 'quiz') return completed.includes('timeline_learned') ? (completed.includes('quiz_completed') ? '✅' : '🔥') : '🔒';
    if (id === 'analytics') return '🔓'; // Open to all
    if (id === 'badges') return userProgress.badges.length > 0 ? '✅' : '🔒';
    if (id === 'profile') return '🔓';
    
    return '🔓';
  };

  const menuItems = [
    { id: 'chat' as ViewType, icon: '💬', label: 'Chat Assistant', color: '#1E3A8A' },
    { id: 'timeline' as ViewType, icon: '📅', label: 'Timeline', color: '#8b5cf6' },
    { id: 'quiz' as ViewType, icon: '🎯', label: 'Quiz', color: '#f59e0b' },
    { id: 'analytics' as ViewType, icon: '📊', label: 'Election Analytics', color: '#ec4899' },
    { id: 'badges' as ViewType, icon: '🏆', label: 'Badges', color: '#10b981' },
    { id: 'profile' as ViewType, icon: '👤', label: 'Profile', color: '#6366f1' }
  ];

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [xpToast, setXpToast] = useState<{show: boolean, message: string}>({show: false, message: ''});

  // Example: trigger XP toast randomly or based on progress change
  // For the hackathon, we'll expose a function to show it
  const showXP = (points: number, action: string) => {
    setXpToast({ show: true, message: `+${points} XP: ${action}` });
    setTimeout(() => setXpToast({ show: false, message: '' }), 3000);
  };

  return (
    <div className="bg-pattern" style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🗳️</div>
          <h1 style={styles.logoText}>VoteEdu</h1>
        </div>

        <nav style={styles.nav}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                const status = getMenuStatus(item.id);
                if (status !== '🔒') {
                  setActiveView(item.id);
                  if (item.id === 'quiz' || item.id === 'timeline') {
                    showXP(5, `Opened ${item.label}`);
                  }
                }
              }}
              style={{
                ...styles.navItem,
                ...(activeView === item.id ? styles.navItemActive : {}),
                ...(getMenuStatus(item.id) === '🔒' ? styles.navItemLocked : {}),
                borderLeftColor: activeView === item.id ? item.color : 'transparent'
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
              <span style={styles.navStatus}>{getMenuStatus(item.id)}</span>
            </button>
          ))}
        </nav>

        {/* Progress Card */}
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <span style={styles.progressTitle}>Your Progress</span>
            <span style={styles.progressPercent}>{progress}%</span>
          </div>
          <div style={styles.progressBarContainer}>
            <div className="tricolor-gradient" style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>
          <div style={styles.progressStats}>
            <div style={styles.progressStat}>
              <span style={styles.progressStatValue}>{userProgress.badges.length}</span>
              <span style={styles.progressStatLabel}>Badges</span>
            </div>
            <div style={styles.progressStat}>
              <span style={styles.progressStatValue}>{userProgress.completedSteps.length}</span>
              <span style={styles.progressStatLabel}>Steps</span>
            </div>
            <div style={styles.progressStat}>
              <span style={styles.progressStatValue}>{userProgress.quizScore}%</span>
              <span style={styles.progressStatLabel}>Quiz</span>
            </div>
          </div>
        </div>

        {/* Help Section removed from sidebar, moved to Floating Button */}
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h2 style={styles.headerTitle}>
              {menuItems.find(item => item.id === activeView)?.label}
            </h2>
            <p style={styles.headerSubtitle}>
              {activeView === 'chat' && 'Get personalized guidance on voting'}
              {activeView === 'timeline' && 'Track election phases and deadlines'}
              {activeView === 'analytics' && 'Comprehensive results from 2024 general election'}
              {activeView === 'quiz' && 'Test your voting knowledge'}
              {activeView === 'badges' && 'View your achievements'}
              {activeView === 'profile' && 'Manage your information'}
            </p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>
                {user.isFirstTimeVoter ? '🆕' : '✅'}
              </div>
              <div style={styles.userDetails}>
                <div style={styles.userName}>
                  {user.isFirstTimeVoter ? 'First-Time Voter' : 'Registered Voter'}
                </div>
                <div style={styles.userLocation}>
                  {user.location.state || user.location.country}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Next Action & Smart Banner */}
        {progress < 100 && (
          <div style={styles.banner} className="glass-card animate-pop-in">
            <div style={styles.bannerIcon}>⚠️</div>
            <div style={styles.bannerContent}>
              <div style={styles.bannerTitle}>Smart Alert: {nextAction}</div>
              <div style={styles.bannerText}>
                <span style={{color: '#b91c1c', fontWeight: 'bold'}}>⏳ 12 days left</span> to complete this step before the deadline!
              </div>
            </div>
            <button 
              className="saffron-glow"
              style={styles.bannerButton}
              onClick={() => {
                showXP(10, "Action Started");
                if (nextAction.includes('quiz')) {
                  setActiveView('quiz');
                } else if (nextAction.includes('timeline')) {
                  setActiveView('timeline');
                } else {
                  setActiveView('chat');
                }
              }}
            >
              Start Now →
            </button>
          </div>
        )}

        {/* View Content */}
        <div style={styles.content}>
          {activeView === 'chat' && (
            <ChatInterface assistant={assistant} progress={progress} />
          )}
          {activeView === 'timeline' && (
            <TimelineView user={user} />
          )}
          {activeView === 'analytics' && (
            <AnalyticsView />
          )}
          {activeView === 'quiz' && (
            <QuizView 
              userProgress={userProgress} 
              setUserProgress={setUserProgress} 
            />
          )}
          {activeView === 'badges' && (
            <BadgesView userProgress={userProgress} />
          )}
          {activeView === 'profile' && (
            <ProfileView user={user} userProgress={userProgress} />
          )}
        </div>
      </main>

      {/* Floating Help Button */}
      <button 
        className="pulse-red"
        style={styles.floatingHelpButton}
        onClick={() => setShowHelpModal(true)}
      >
        <span style={{fontSize: '24px'}}>🔴</span> Need Help?
      </button>

      {/* Gamification XP Toast */}
      {xpToast.show && (
        <div className="xp-toast">
          ✨ {xpToast.message}
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div style={styles.modalOverlay} onClick={() => setShowHelpModal(false)}>
          <div style={styles.helpModal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🚨 Emergency Help</h3>
              <button style={styles.closeButton} onClick={() => setShowHelpModal(false)}>✕</button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.helpOption}>
                <div style={styles.helpOptionIcon}>📞</div>
                <div style={styles.helpOptionDetails}>
                  <h4>Call Voter Helpline</h4>
                  <p>Dial 1950 (Toll-Free)</p>
                </div>
                <a href="tel:1950" style={styles.callButton}>Call Now</a>
              </div>
              <div style={styles.helpOption}>
                <div style={styles.helpOptionIcon}>💬</div>
                <div style={styles.helpOptionDetails}>
                  <h4>Chat Support</h4>
                  <p>Talk to a human representative</p>
                </div>
                <button style={styles.chatSupportButton}>Start Chat</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  // Sidebar Styles
  sidebar: {
    width: '280px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    boxShadow: '2px 0 8px rgba(0,0,0,0.02)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    padding: '0 8px'
  },
  logoIcon: {
    fontSize: '32px'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  
  // Navigation
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '24px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderLeft: '3px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '15px',
    color: '#64748b',
    fontWeight: '500'
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
    color: '#1E3A8A',
    fontWeight: '700'
  },
  navItemLocked: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  navIcon: {
    fontSize: '20px'
  },
  navLabel: {
    flex: 1,
    textAlign: 'left'
  },
  navStatus: {
    fontSize: '14px'
  },
  
  // Progress Card
  progressCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  progressTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569'
  },
  progressPercent: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563eb'
  },
  progressBarContainer: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  progressStats: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '8px'
  },
  progressStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  progressStatValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b'
  },
  progressStatLabel: {
    fontSize: '12px',
    color: '#64748b'
  },
  
  // Help Section
  helpSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#eff6ff',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    marginTop: 'auto'
  },
  helpIcon: {
    fontSize: '24px'
  },
  helpText: {
    flex: 1
  },
  helpTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: '2px'
  },
  helpSubtitle: {
    fontSize: '13px',
    color: '#3b82f6'
  },
  
  // Main Content
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  
  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0'
  },
  headerLeft: {
    flex: 1
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b'
  },
  userLocation: {
    fontSize: '12px',
    color: '#64748b'
  },
  
  // Banner
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    margin: '24px 32px',
    padding: '20px 24px',
    backgroundColor: '#fef3c7',
    borderRadius: '12px',
    border: '1px solid #fbbf24',
    flexWrap: 'wrap'
  },
  bannerIcon: {
    fontSize: '28px'
  },
  bannerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: '200px'
  },
  bannerTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#92400e',
    margin: 0
  },
  bannerText: {
    fontSize: '14px',
    color: '#78350f',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  bannerButton: {
    padding: '10px 24px',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
    whiteSpace: 'nowrap'
  },
  
  // Content
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px 32px'
  },
  
  // Floating Help
  floatingHelpButton: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    backgroundColor: '#ffffff',
    color: '#ef4444',
    border: '1px solid #fecaca',
    borderRadius: '30px',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 100
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out'
  },
  helpModal: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '32px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  helpOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    gap: '16px'
  },
  helpOptionIcon: {
    fontSize: '32px'
  },
  helpOptionDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  callButton: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  },
  chatSupportButton: {
    padding: '10px 20px',
    backgroundColor: '#1E3A8A',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};
