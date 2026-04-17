<<<<<<< HEAD
// src/components/Toast.jsx
import React, { useEffect } from 'react';

const TOAST_COLORS = {
  success: { bg: 'rgba(0,255,136,0.12)', border: 'rgba(0,255,136,0.3)', text: '#00ff88', icon: '✓' },
  error:   { bg: 'rgba(255,0,64,0.12)',  border: 'rgba(255,0,64,0.3)',  text: '#ff0040', icon: '✕' },
  warning: { bg: 'rgba(255,195,0,0.12)', border: 'rgba(255,195,0,0.3)', text: '#ffc300', icon: '⚠' },
  info:    { bg: 'rgba(0,194,255,0.12)', border: 'rgba(0,194,255,0.3)', text: '#00c2ff', icon: 'ℹ' },
};

export default function Toast({ message, type = 'info', onClose, duration = 3500 }) {
  const config = TOAST_COLORS[type] || TOAST_COLORS.info;

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
=======
import React, { useEffect } from 'react';

const TOAST_CONFIG = {
  success: { border: 'rgba(0,255,157,0.3)', text: '#00ff9d', icon: '✓', bg: 'rgba(0,255,157,0.08)' },
  error:   { border: 'rgba(255,32,80,0.3)',  text: '#ff2050', icon: '✕', bg: 'rgba(255,32,80,0.08)' },
  warning: { border: 'rgba(255,214,10,0.3)', text: '#ffd60a', icon: '⚠', bg: 'rgba(255,214,10,0.08)' },
  info:    { border: 'rgba(0,212,255,0.3)',  text: '#00d4ff', icon: 'ℹ', bg: 'rgba(0,212,255,0.08)' },
};

export default function Toast({ message, type = 'info', onClose, duration = 3500 }) {
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
>>>>>>> a076e50 (initial commit)
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div style={{
<<<<<<< HEAD
      position:       'fixed',
      bottom:         `calc(var(--nav-height) + 20px + var(--safe-bottom))`,
      left:           '50%',
      transform:      'translateX(-50%)',
      zIndex:         9999,
      maxWidth:       '360px',
      width:          'calc(100% - 40px)',
      background:     config.bg,
      border:         `1px solid ${config.border}`,
      backdropFilter: 'blur(16px)',
      borderRadius:   '14px',
      padding:        '14px 18px',
      display:        'flex',
      alignItems:     'center',
      gap:            '12px',
      animation:      'slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow:      '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <span style={{
        fontSize:   '20px',
        color:      config.text,
        fontWeight: 700,
        lineHeight: 1,
        minWidth:   '24px',
        textAlign:  'center',
=======
      position: 'fixed',
      bottom: '28px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      maxWidth: '380px',
      width: 'calc(100% - 40px)',
      background: config.bg,
      border: `1px solid ${config.border}`,
      backdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slide-up 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 20px ${config.border}`,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '16px',
        color: config.text,
        fontWeight: 700,
        minWidth: '20px',
        textAlign: 'center',
        textShadow: `0 0 10px ${config.text}`,
>>>>>>> a076e50 (initial commit)
      }}>
        {config.icon}
      </span>
      <p style={{
<<<<<<< HEAD
        flex:       1,
        fontSize:   '14px',
        fontWeight: 600,
        color:      '#f0f0ff',
        fontFamily: 'var(--font-display)',
        margin:     0,
        lineHeight: 1.4,
=======
        flex: 1,
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        margin: 0,
        lineHeight: 1.4,
        letterSpacing: '0.02em',
>>>>>>> a076e50 (initial commit)
      }}>
        {message}
      </p>
      <button
        onClick={onClose}
        style={{
          background: 'none',
<<<<<<< HEAD
          color:      'var(--text-muted)',
          fontSize:   '18px',
          padding:    '2px 6px',
          borderRadius: '6px',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => e.target.style.color = '#f0f0ff'}
        onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
=======
          color: 'var(--text-muted)',
          fontSize: '18px',
          padding: '2px 4px',
          borderRadius: '4px',
          lineHeight: 1,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
>>>>>>> a076e50 (initial commit)
      >
        ×
      </button>
    </div>
  );
}

<<<<<<< HEAD
// ─────────────────────────────────────────────
// Toast hook for easy use
// ─────────────────────────────────────────────
=======
>>>>>>> a076e50 (initial commit)
export function useToast() {
  const [toast, setToast] = React.useState(null);

  const showToast = React.useCallback((message, type = 'info') => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const hideToast = React.useCallback(() => setToast(null), []);

  const ToastComponent = toast ? (
<<<<<<< HEAD
    <Toast
      key={toast.key}
      message={toast.message}
      type={toast.type}
      onClose={hideToast}
    />
=======
    <Toast key={toast.key} message={toast.message} type={toast.type} onClose={hideToast} />
>>>>>>> a076e50 (initial commit)
  ) : null;

  return { showToast, ToastComponent };
}
