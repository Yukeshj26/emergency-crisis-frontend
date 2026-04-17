<<<<<<< HEAD
// src/components/OfflineBanner.jsx
import React from 'react';
import { getPendingCount } from '../services/offlineQueue';

export default function OfflineBanner({ isOnline, syncing, syncProgress }) {
  const pending = getPendingCount();

=======
import React from 'react';

export default function OfflineBanner({ isOnline, syncing, syncProgress }) {
>>>>>>> a076e50 (initial commit)
  if (isOnline && !syncing) return null;

  return (
    <div style={{
<<<<<<< HEAD
      position:        'fixed',
      top:             0,
      left:            '50%',
      transform:       'translateX(-50%)',
      width:           '100%',
      maxWidth:        '480px',
      zIndex:          1000,
      background:      isOnline ? 'rgba(0,255,136,0.12)' : 'rgba(255,195,0,0.12)',
      borderBottom:    `1px solid ${isOnline ? 'rgba(0,255,136,0.3)' : 'rgba(255,195,0,0.3)'}`,
      backdropFilter:  'blur(12px)',
      padding:         '10px 20px',
      display:         'flex',
      alignItems:      'center',
      gap:             '10px',
      animation:       'slide-down 0.3s ease',
    }}>
      <span style={{ fontSize: '18px' }}>
        {isOnline ? '🔄' : '📴'}
      </span>
      <div style={{ flex: 1 }}>
        {!isOnline && (
          <p style={{
            fontSize:   '13px',
            fontWeight: 700,
            color:      '#ffc300',
            fontFamily: 'var(--font-display)',
            margin:     0,
          }}>
            OFFLINE MODE — {pending} incident{pending !== 1 ? 's' : ''} queued
          </p>
        )}
        {syncing && (
          <p style={{
            fontSize:   '12px',
            color:      '#00ff88',
            fontFamily: 'var(--font-mono)',
            margin:     0,
          }}>
            Syncing... {syncProgress ? `${syncProgress.synced}/${syncProgress.total}` : ''}
          </p>
        )}
      </div>
      {!isOnline && (
        <span style={{
          fontSize:        '11px',
          fontFamily:      'var(--font-mono)',
          color:           '#ffc300',
          background:      'rgba(255,195,0,0.1)',
          padding:         '3px 8px',
          borderRadius:    '4px',
          border:          '1px solid rgba(255,195,0,0.2)',
          animation:       'pulse-dot 2s ease infinite',
        }}>
          QUEUE
        </span>
=======
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      background: isOnline
        ? 'rgba(0,255,157,0.08)'
        : 'rgba(255,195,0,0.08)',
      borderBottom: `1px solid ${isOnline ? 'rgba(0,255,157,0.25)' : 'rgba(255,195,0,0.25)'}`,
      backdropFilter: 'blur(12px)',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slide-down 0.3s ease',
    }}>
      <span style={{ fontSize: '16px' }}>{isOnline ? '🔄' : '📴'}</span>
      <div style={{ flex: 1 }}>
        {!isOnline && (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 600,
            color: '#ffd60a',
            letterSpacing: '0.12em',
          }}>
            OFFLINE MODE — INCIDENTS QUEUED
          </span>
        )}
        {syncing && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--neon-green)',
            letterSpacing: '0.1em',
          }}>
            SYNCING{syncProgress ? ` ${syncProgress.synced}/${syncProgress.total}` : '...'}
          </span>
        )}
      </div>
      {!isOnline && (
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#ffd60a',
          boxShadow: '0 0 6px #ffd60a',
          animation: 'pulse-dot 1.5s ease infinite',
        }} />
>>>>>>> a076e50 (initial commit)
      )}
    </div>
  );
}
