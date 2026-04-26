import React from 'react';
import { User } from '../types/election';
import { getIndiaElectionInfo } from '../data/india-election-data';

interface TimelineViewProps {
  user: User;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ user }) => {
  const electionInfo = getIndiaElectionInfo(user.location.state);

  return (
    <div style={styles.container}>
      <div style={styles.timelineWrapper}>
        <div style={styles.timelineLine}></div>
        {electionInfo.phases.map((phase, index) => {
          const isActive = phase.status === 'active';
          const isCompleted = phase.status === 'completed';
          
          return (
            <div
              key={phase.id}
              style={{
                ...styles.card,
                ...(isActive ? styles.cardActive : {}),
                ...(isCompleted ? styles.cardCompleted : {})
              }}
            >
              <div style={styles.cardHeader}>
                <div style={{
                  ...styles.phaseIndicator,
                  ...(isActive ? styles.phaseIndicatorActive : {}),
                  ...(isCompleted ? styles.phaseIndicatorCompleted : {})
                }}>
                  {isCompleted ? '✅' : isActive ? '🎯' : `${index + 1}`}
                </div>
                <div style={styles.phaseStatus}>
                  {phase.status === 'active' && (
                    <span style={styles.statusBadgeActive}>🟢 Active Now</span>
                  )}
                  {phase.status === 'completed' && (
                    <span style={styles.statusBadgeCompleted}>✅ Completed</span>
                  )}
                  {phase.status === 'upcoming' && (
                    <span style={styles.statusBadgeUpcoming}>⏳ Upcoming</span>
                  )}
                </div>
              </div>

              <h3 style={styles.phaseTitle}>{phase.name}</h3>
              <p style={styles.phaseDescription}>{phase.description}</p>

              {phase.userAction && (
                <div style={styles.actionBox}>
                  <div style={styles.actionIcon}>👉</div>
                  <div style={styles.actionText}>{phase.userAction}</div>
                </div>
              )}

              {phase.actionDeadline && (
                <div style={{...styles.deadline, ...(isActive ? styles.deadlineUrgent : {})}}>
                  <span style={styles.deadlineIcon}>⏳</span>
                  <span style={styles.deadlineText}>
                    {isActive 
                      ? `${Math.max(1, Math.floor((phase.actionDeadline.getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} days left to complete!`
                      : `Deadline: ${phase.actionDeadline.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}`
                    }
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Cards */}
      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>📞</div>
          <div style={styles.infoContent}>
            <div style={styles.infoTitle}>Helpline</div>
            <div style={styles.infoValue}>{electionInfo.helplineNumber}</div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>🌐</div>
          <div style={styles.infoContent}>
            <div style={styles.infoTitle}>Official Website</div>
            <a 
              href={electionInfo.officialSourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.infoLink}
            >
              Visit ECI
            </a>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoIcon}>📝</div>
          <div style={styles.infoContent}>
            <div style={styles.infoTitle}>Register</div>
            <a 
              href={electionInfo.registrationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.infoLink}
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px'
  },
  timelineWrapper: {
    position: 'relative',
    paddingLeft: '40px',
    marginBottom: '40px'
  },
  timelineLine: {
    position: 'absolute',
    left: '19px',
    top: '20px',
    bottom: '20px',
    width: '4px',
    backgroundColor: '#e2e8f0',
    borderRadius: '2px',
    zIndex: 0
  },
  card: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    marginBottom: '24px',
    zIndex: 1
  },
  cardActive: {
    borderColor: '#F59E0B',
    boxShadow: '0 8px 32px rgba(245, 158, 11, 0.2)',
    transform: 'scale(1.02)'
  },
  cardCompleted: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(240, 253, 244, 0.9)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  phaseIndicator: {
    position: 'absolute',
    left: '-40px',
    top: '24px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#475569',
    border: '4px solid #f8fafc',
    zIndex: 2,
    transform: 'translateX(-50%)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  phaseIndicatorActive: {
    backgroundColor: '#F59E0B',
    color: '#ffffff',
    boxShadow: '0 0 0 4px rgba(245, 158, 11, 0.2)'
  },
  phaseIndicatorCompleted: {
    backgroundColor: '#10B981',
    color: '#ffffff'
  },
  phaseStatus: {
    display: 'flex'
  },
  statusBadgeActive: {
    padding: '6px 14px',
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    animation: 'pulse 2s infinite'
  },
  statusBadgeCompleted: {
    padding: '6px 14px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700'
  },
  statusBadgeUpcoming: {
    padding: '6px 14px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700'
  },
  phaseTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0'
  },
  phaseDescription: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: '0 0 16px 0'
  },
  actionBox: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    marginBottom: '12px'
  },
  actionIcon: {
    fontSize: '18px'
  },
  actionText: {
    fontSize: '14px',
    color: '#78350f',
    fontWeight: '500',
    flex: 1
  },
  deadline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    borderLeft: '4px solid #ef4444'
  },
  deadlineUrgent: {
    backgroundColor: '#FEF3C7',
    borderLeft: '4px solid #F59E0B',
    animation: 'pulse 2s infinite'
  },
  deadlineIcon: {
    fontSize: '18px'
  },
  deadlineText: {
    fontSize: '14px',
    color: '#991b1b',
    fontWeight: '700'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  infoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  infoIcon: {
    fontSize: '32px'
  },
  infoContent: {
    flex: 1
  },
  infoTitle: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '4px'
  },
  infoValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b'
  },
  infoLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2563eb',
    textDecoration: 'none'
  }
};
