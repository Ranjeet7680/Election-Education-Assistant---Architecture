import React, { useState, useEffect } from 'react';
import electionData from '../data/election_data.json';

export const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seats' | 'votes'>('seats');
  const [count, setCount] = useState({ seats: 0, votes: 0, turnout: 0 });
  
  const totalSeats = electionData.totalSeats;
  const totalVotes = electionData.totalVotes;
  const maxSeats = Math.max(...electionData.parties.map(p => p.seats));
  const maxVotes = Math.max(...electionData.parties.map(p => p.votes));

  useEffect(() => {
    // Animate numbers counting up
    let start = 0;
    const duration = 1500; // ms
    const increment = 20; // ms
    const steps = duration / increment;
    
    const timer = setInterval(() => {
      start += 1;
      setCount({
        seats: Math.min(totalSeats, Math.floor((totalSeats / steps) * start)),
        votes: Math.min(totalVotes, (totalVotes / steps) * start),
        turnout: Math.min(65.79, (65.79 / steps) * start)
      });
      if (start >= steps) clearInterval(timer);
    }, increment);

    return () => clearInterval(timer);
  }, [totalSeats, totalVotes]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Election 2024 Analytics</h2>
        <p style={styles.subtitle}>Comprehensive overview of the 2024 general election results</p>
      </div>

      <div style={styles.statsGrid}>
        <div className="stat-card-fx glass-card" style={styles.statCard}>
          <div style={styles.statIcon}>🗳️</div>
          <div style={styles.statInfo}>
            <div style={styles.statLabel}>Total Votes Cast</div>
            <div style={styles.statValue}>{(count.votes / 1000000).toFixed(1)}M+</div>
          </div>
        </div>
        <div className="stat-card-fx glass-card" style={styles.statCard}>
          <div style={styles.statIcon}>🏛️</div>
          <div style={styles.statInfo}>
            <div style={styles.statLabel}>Total Constituencies</div>
            <div style={styles.statValue}>{count.seats}</div>
          </div>
        </div>
        <div className="stat-card-fx glass-card" style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statInfo}>
            <div style={styles.statLabel}>Voter Turnout</div>
            <div style={styles.statValue}>{count.turnout.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* Left Side: Charts */}
        <div className="glass-card" style={styles.chartContainer}>
        <div style={styles.chartHeader}>
          <h3 style={styles.chartTitle}>Party Performance</h3>
          <div style={styles.tabGroup}>
            <button
              onClick={() => setActiveTab('seats')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'seats' ? styles.tabButtonActive : {})
              }}
            >
              Seats Won
            </button>
            <button
              onClick={() => setActiveTab('votes')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'votes' ? styles.tabButtonActive : {})
              }}
            >
              Vote Share
            </button>
          </div>
        </div>

        <div style={styles.chartArea}>
          {electionData.parties.map((party, index) => {
            const value = activeTab === 'seats' ? party.seats : party.votes;
            const maxVal = activeTab === 'seats' ? maxSeats : maxVotes;
            const percentage = (value / maxVal) * 100;
            const sharePercentage = activeTab === 'seats' 
              ? ((party.seats / totalSeats) * 100).toFixed(1)
              : ((party.votes / totalVotes) * 100).toFixed(1);

            return (
              <div key={index} className="bar-row-fx" style={{...styles.barWrapper, animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`}}>
                <div style={styles.barLabelGroup}>
                  <span style={styles.partyName}>{party.name}</span>
                  <span style={styles.partyValue}>
                    {activeTab === 'seats' ? `${party.seats} Seats` : `${(party.votes / 1000000).toFixed(2)}M Votes`}
                    <span style={styles.shareTag}>({sharePercentage}%)</span>
                  </span>
                </div>
                <div style={styles.barBackground}>
                  <div 
                    style={{
                      ...styles.barFill,
                      width: `${percentage}%`,
                      backgroundColor: party.color || '#3b82f6',
                      animation: 'fillBar 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        </div>
        
        {/* Right Side: Maps & Geography */}
        <div className="glass-card" style={styles.mapContainer}>
          <h3 style={styles.chartTitle}>🗺️ Turnout Heatmap</h3>
          <p style={{fontSize: '13px', color: '#64748b', marginBottom: '16px'}}>Live view of voter density and state-wise turnout performance.</p>
          
          <div style={styles.mapPlaceholder}>
            <iframe 
                title="India Turnout Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.112284179835!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd3d3c8c6c5b%3A0x6b8d4f40f3b06e92!2sElection%20Commission%20of%20India!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '12px', opacity: 0.8, filter: 'hue-rotate(90deg)' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={styles.mapOverlay}>Interactive Heatmap Engaged</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '24px',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '8px',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default',
  },
  statIcon: {
    fontSize: '32px',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9'
  },
  mapContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column'
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    minHeight: '200px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  },
  mapOverlay: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(30, 58, 138, 0.9)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    animation: 'pulseRed 2s infinite'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  tabGroup: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    padding: '4px',
    borderRadius: '8px',
    gap: '4px'
  },
  tabButton: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  chartArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  barLabelGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  partyName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#334155'
  },
  partyValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  shareTag: {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '500',
    backgroundColor: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  barBackground: {
    height: '12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};
