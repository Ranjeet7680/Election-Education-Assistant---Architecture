import React from 'react';
import { UserProgress } from '../types/election';

interface BadgesViewProps {
  userProgress: UserProgress;
}

const allBadges = [
  {
    id: 'first_timer',
    name: 'First Time Voter Ready',
    description: 'Completed the first-time voter guide',
    icon: '🗳️',
    color: '#3b82f6'
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Scored 80% or higher in the voting quiz',
    icon: '🎯',
    color: '#f59e0b'
  },
  {
    id: 'registered',
    name: 'Registered Voter',
    description: 'Successfully registered as a voter',
    icon: '📝',
    color: '#10b981'
  },
  {
    id: 'informed_citizen',
    name: 'Informed Citizen',
    description: 'Learned about all election phases',
    icon: '📚',
    color: '#8b5cf6'
  },
  {
    id: 'booth_finder',
    name: 'Booth Finder',
    description: 'Located your polling booth',
    icon: '📍',
    color: '#ef4444'
  },
  {
    id: 'document_ready',
    name: 'Document Ready',
    description: 'Learned about all required documents',
    icon: '📄',
    color: '#06b6d4'
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Got 100% in the voting quiz',
    icon: '💯',
    color: '#f43f5e'
  },
  {
    id: 'democracy_champion',
    name: 'Democracy Champion',
    description: 'Completed all learning modules',
    icon: '👑',
    color: '#eab308'
  }
];

export const BadgesView: React.FC<BadgesViewProps> = ({ userProgress }) => {
  const earnedBadgeIds = userProgress.badges.map(b => b.id);
  const earnedCount = earnedBadgeIds.length;
  const totalCount = allBadges.length;

  return (
    <div style={styles.container}>
      {/* Header Stats */}
      <div style={styles.statsCard}>
        <div style={styles.statItem}>
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{earnedCount}/{totalCount}</div>
            <div style={styles.statLabel}>Badges Earned</div>
          </div>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{Math.round((earnedCount / totalCount) * 100)}%</div>
            <div style={styles.statLabel}>Completion</div>
          </div>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{totalCount - earnedCount}</div>
            <div style={styles.statLabel}>To Unlock</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div style={styles.badgesGrid}>
        {allBadges.map(badge => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const earnedBadge = userProgress.badges.find(b => b.id === badge.id);

          return (
            <div
              key={badge.id}
              style={{
                ...styles.badgeCard,
                ...(isEarned ? styles.badgeCardEarned : styles.badgeCardLocked)
              }}
            >
              <div
                style={{
                  ...styles.badgeIconContainer,
                  backgroundColor: isEarned ? badge.color : '#e2e8f0'
                }}
              >
                <div style={{
                  ...styles.badgeIcon,
                  opacity: isEarned ? 1 : 0.3
                }}>
                  {badge.icon}
                </div>
              </div>

              <div style={styles.badgeContent}>
                <h3 style={{
                  ...styles.badgeName,
                  color: isEarned ? '#1e293b' : '#94a3b8'
                }}>
                  {badge.name}
                </h3>
                <p style={{
                  ...styles.badgeDescription,
                  color: isEarned ? '#64748b' : '#cbd5e1'
                }}>
                  {badge.description}
                </p>

                {isEarned && earnedBadge && (
                  <div style={styles.badgeEarnedDate}>
                    <span style={styles.badgeEarnedIcon}>✓</span>
                    <span style={styles.badgeEarnedText}>
                      Earned on {earnedBadge.earnedAt.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {!isEarned && (
                  <div style={styles.badgeLockedStatus}>
                    <span style={styles.badgeLockedIcon}>🔒</span>
                    <span style={styles.badgeLockedText}>Locked</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation Section */}
      {earnedCount < totalCount && (
        <div style={styles.motivationCard}>
          <div style={styles.motivationIcon}>💪</div>
          <div style={styles.motivationContent}>
            <h3 style={styles.motivationTitle}>Keep Going!</h3>
            <p style={styles.motivationText}>
              You're doing great! Complete more activities to unlock all badges and become a Democracy Champion.
            </p>
          </div>
        </div>
      )}

      {earnedCount === totalCount && (
        <div style={styles.congratsCard}>
          <div style={styles.congratsIcon}>🎉</div>
          <div style={styles.congratsContent}>
            <h3 style={styles.congratsTitle}>Congratulations!</h3>
            <p style={styles.congratsText}>
              You've earned all badges! You're now a certified Democracy Champion. Share your achievement with others!
            </p>
            <button style={styles.shareButton}>
              Share Achievement 🎊
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px'
  },
  statsCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    border: '1px solid #e2e8f0'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statIcon: {
    fontSize: '40px'
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px'
  },
  statDivider: {
    width: '1px',
    height: '60px',
    backgroundColor: '#e2e8f0'
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  badgeCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s'
  },
  badgeCardEarned: {
    borderColor: '#10b981',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
  },
  badgeCardLocked: {
    opacity: 0.6
  },
  badgeIconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  badgeIcon: {
    fontSize: '40px'
  },
  badgeContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  badgeName: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  badgeDescription: {
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0 0 16px 0'
  },
  badgeEarnedDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px'
  },
  badgeEarnedIcon: {
    fontSize: '16px',
    color: '#10b981'
  },
  badgeEarnedText: {
    fontSize: '13px',
    color: '#065f46',
    fontWeight: '500'
  },
  badgeLockedStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  badgeLockedIcon: {
    fontSize: '16px'
  },
  badgeLockedText: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  motivationCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    backgroundColor: '#eff6ff',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #bfdbfe'
  },
  motivationIcon: {
    fontSize: '48px'
  },
  motivationContent: {
    flex: 1
  },
  motivationTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e40af',
    margin: '0 0 8px 0'
  },
  motivationText: {
    fontSize: '16px',
    color: '#1e40af',
    lineHeight: '1.6',
    margin: 0
  },
  congratsCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    backgroundColor: '#fef3c7',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #fbbf24'
  },
  congratsIcon: {
    fontSize: '48px'
  },
  congratsContent: {
    flex: 1
  },
  congratsTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#92400e',
    margin: '0 0 8px 0'
  },
  congratsText: {
    fontSize: '16px',
    color: '#78350f',
    lineHeight: '1.6',
    margin: '0 0 16px 0'
  },
  shareButton: {
    padding: '12px 24px',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
