import React from 'react';
import { User, UserProgress } from '../types/election';
import { gamificationService } from '../services/gamification-service';

interface ProfileViewProps {
  user: User;
  userProgress: UserProgress;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, userProgress }) => {
  const progress = gamificationService.calculateProgress(userProgress.completedSteps);

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {user.isFirstTimeVoter ? '🆕' : '✅'}
            </div>
            <button style={styles.changeAvatarButton}>Change Avatar</button>
          </div>

          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>
              {user.isFirstTimeVoter ? 'First-Time Voter' : 'Registered Voter'}
            </h2>
            <div style={styles.profileDetail}>
              <span style={styles.profileDetailIcon}>📍</span>
              <span style={styles.profileDetailText}>
                {user.location.state || user.location.country}
              </span>
            </div>
            <div style={styles.profileDetail}>
              <span style={styles.profileDetailIcon}>🌐</span>
              <span style={styles.profileDetailText}>
                {user.language === 'en' ? 'English' : 'Hindi'}
              </span>
            </div>
            {user.age && (
              <div style={styles.profileDetail}>
                <span style={styles.profileDetailIcon}>🎂</span>
                <span style={styles.profileDetailText}>{user.age} years old</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div style={styles.statsCard}>
          <h3 style={styles.cardTitle}>Your Statistics</h3>
          
          <div style={styles.statsList}>
            <div style={styles.statItem}>
              <div style={styles.statIcon}>📊</div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>Overall Progress</div>
                <div style={styles.statValue}>{progress}%</div>
              </div>
            </div>

            <div style={styles.statItem}>
              <div style={styles.statIcon}>🏆</div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>Badges Earned</div>
                <div style={styles.statValue}>{userProgress.badges.length}/8</div>
              </div>
            </div>

            <div style={styles.statItem}>
              <div style={styles.statIcon}>✅</div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>Steps Completed</div>
                <div style={styles.statValue}>{userProgress.completedSteps.length}/6</div>
              </div>
            </div>

            <div style={styles.statItem}>
              <div style={styles.statIcon}>🎯</div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>Quiz Score</div>
                <div style={styles.statValue}>
                  {userProgress.quizScore > 0 ? `${userProgress.quizScore}%` : 'Not taken'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div style={styles.activityCard}>
        <h3 style={styles.cardTitle}>Recent Activity</h3>
        
        <div style={styles.timeline}>
          {userProgress.badges.length > 0 ? (
            userProgress.badges.map((badge) => (
              <div key={badge.id} style={styles.timelineItem}>
                <div style={styles.timelineIcon}>{badge.icon}</div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineTitle}>Earned {badge.name}</div>
                  <div style={styles.timelineDate}>
                    {badge.earnedAt.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>📭</div>
              <div style={styles.emptyStateText}>No activity yet. Start learning to see your progress here!</div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Card */}
      <div style={styles.settingsCard}>
        <h3 style={styles.cardTitle}>Settings</h3>
        
        <div style={styles.settingsList}>
          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Language</div>
              <div style={styles.settingValue}>
                {user.language === 'en' ? 'English' : 'हिंदी'}
              </div>
            </div>
            <button style={styles.settingButton}>Change</button>
          </div>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Location</div>
              <div style={styles.settingValue}>
                {user.location.state || user.location.country}
              </div>
            </div>
            <button style={styles.settingButton}>Update</button>
          </div>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Notifications</div>
              <div style={styles.settingValue}>Enabled</div>
            </div>
            <button style={styles.settingButton}>Manage</button>
          </div>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Data & Privacy</div>
              <div style={styles.settingValue}>View policy</div>
            </div>
            <button style={styles.settingButton}>View</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={styles.dangerCard}>
        <h3 style={styles.dangerTitle}>Danger Zone</h3>
        <p style={styles.dangerText}>
          Reset your progress and start fresh. This action cannot be undone.
        </p>
        <button style={styles.dangerButton}>Reset Progress</button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1000px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  avatarSection: {
    marginBottom: '24px'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
    margin: '0 auto 16px'
  },
  changeAvatarButton: {
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  profileInfo: {
    textAlign: 'left'
  },
  profileName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 16px 0'
  },
  profileDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9'
  },
  profileDetailIcon: {
    fontSize: '20px'
  },
  profileDetailText: {
    fontSize: '15px',
    color: '#64748b'
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e2e8f0'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 24px 0'
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px'
  },
  statIcon: {
    fontSize: '32px'
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b'
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    borderLeft: '4px solid #2563eb'
  },
  timelineIcon: {
    fontSize: '32px'
  },
  timelineContent: {
    flex: 1
  },
  timelineTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px'
  },
  timelineDate: {
    fontSize: '13px',
    color: '#64748b'
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px'
  },
  emptyStateIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyStateText: {
    fontSize: '15px',
    color: '#64748b'
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e2e8f0',
    marginBottom: '24px'
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px'
  },
  settingInfo: {
    flex: 1
  },
  settingLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px'
  },
  settingValue: {
    fontSize: '14px',
    color: '#64748b'
  },
  settingButton: {
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  dangerCard: {
    backgroundColor: '#fef2f2',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #fca5a5'
  },
  dangerTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#991b1b',
    margin: '0 0 8px 0'
  },
  dangerText: {
    fontSize: '14px',
    color: '#7f1d1d',
    marginBottom: '16px'
  },
  dangerButton: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
