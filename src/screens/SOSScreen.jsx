<<<<<<< HEAD
// src/screens/SOSScreen.jsx

import React, { useState, useRef } from 'react';
=======
import React, { useState, useRef, useEffect } from 'react';
>>>>>>> a076e50 (initial commit)
import { useSOS } from '../hooks/useSOS';
import { SOS_TYPES, MODE_CONFIG } from '../utils/constants';

const LOCATIONS = [
  'Room 101', 'Room 202', 'Room 204', 'Room 305', 'Room 410',
  'Lobby', 'Cafeteria', 'Parking Lot', 'Stairwell A', 'Stairwell B',
  'Roof', 'Basement', 'Server Room', 'Conference Hall',
];

<<<<<<< HEAD
export default function SOSScreen({ isOnline, showToast }) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [loraMode, setLoraMode] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [lastSent, setLastSent] = useState(null);

  const holdInterval = useRef(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const HOLD_DURATION = 1500;

  const { sendSOS, sending } = useSOS();

  const location = customLocation.trim() || selectedLocation;

  // ── HOLD LOGIC (FIXED) ─────────────────────
  const startHold = () => {
    if (!selectedType || !location || sending) return;

    setHoldProgress(0);
    const startTime = Date.now();

    clearInterval(holdInterval.current);

    holdInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);

      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdInterval.current);
        triggerSOS();
      }
    }, 30);
=======
const HOLD_DURATION = 1500;

export default function SOSScreen({ isOnline, showToast }) {
  const [selectedType, setSelectedType]     = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [loraMode, setLoraMode]             = useState(false);
  const [confirmed, setConfirmed]           = useState(false);
  const [lastSent, setLastSent]             = useState(null);
  const [holdProgress, setHoldProgress]     = useState(0);
  const [isHolding, setIsHolding]           = useState(false);

  const holdInterval = useRef(null);
  const startTimeRef = useRef(null);
  const { sendSOS, sending } = useSOS();
  const location = customLocation.trim() || selectedLocation;
  const canSend = !!selectedType && !!location && !sending;
  const typeInfo = selectedType ? SOS_TYPES[selectedType] : null;

  const circumference = 2 * Math.PI * 70; // radius 70

  // cleanup on unmount
  useEffect(() => () => clearInterval(holdInterval.current), []);

  const startHold = () => {
    if (!canSend) return;
    setIsHolding(true);
    setHoldProgress(0);
    startTimeRef.current = Date.now();
    clearInterval(holdInterval.current);
    holdInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(p);
      if (p >= 100) {
        clearInterval(holdInterval.current);
        setIsHolding(false);
        triggerSOS();
      }
    }, 16);
>>>>>>> a076e50 (initial commit)
  };

  const cancelHold = () => {
    clearInterval(holdInterval.current);
<<<<<<< HEAD
    setHoldProgress(0);
  };

  // ── TRIGGER SOS (FINAL FLOW) ─────────────────
  const triggerSOS = async () => {
    setHoldProgress(0);

    const result = await sendSOS(selectedType, location, {
      forceLoRa: loraMode,
    });

    if (result.success) {
      const modeInfo = MODE_CONFIG[result.mode] || MODE_CONFIG.online;

      showToast(`SOS sent via ${modeInfo.label}`, 'success');

      // 🔥 TRIGGER MAP HIGHLIGHT
      window.dispatchEvent(new CustomEvent('sos:triggered', {
        detail: { type: selectedType }
      }));

      setLastSent({
        ...result,
        type: selectedType,
        location,
        sentAt: Date.now(),
      });

      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 4000);
    } else {
      showToast('Failed to send SOS. Try again.', 'error');
    }
  };

  const typeInfo = selectedType ? SOS_TYPES[selectedType] : null;
  const canSend = !!selectedType && !!location && !sending;

  return (
    <div style={{
      padding: '24px 20px',
      paddingBottom: 'calc(var(--nav-height) + 24px)',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
=======
    setIsHolding(false);
    setHoldProgress(0);
  };

  const triggerSOS = async () => {
    setHoldProgress(0);
    const result = await sendSOS(selectedType, location, { forceLoRa: loraMode });
    if (result.success) {
      const modeInfo = MODE_CONFIG[result.mode] || MODE_CONFIG.online;
      showToast(`SOS SENT VIA ${modeInfo.label.toUpperCase()}`, 'success');
      window.dispatchEvent(new CustomEvent('sos:triggered', { detail: { type: selectedType } }));
      setLastSent({ ...result, type: selectedType, location, sentAt: Date.now() });
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 5000);
    } else {
      showToast('TRANSMISSION FAILED — RETRY', 'error');
    }
  };

  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;
  const activeColor = typeInfo?.color || '#ff2050';

  return (
    <div style={{
      minHeight: '100dvh',
      padding: '32px 28px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
>>>>>>> a076e50 (initial commit)
      animation: 'fade-in 0.4s ease',
    }}>

      {/* HEADER */}
<<<<<<< HEAD
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '10px',
          marginBottom: '4px',
        }}>
          <h1 style={{ fontSize: '28px' }}>RESPOND</h1>

          <span style={{
            fontSize: '11px',
            color: isOnline ? '#00ff88' : '#ffc300',
=======
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}>
            CRYSALIS / SOS TRANSMIT
          </div>
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #e8f4ff, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            EMERGENCY ALERT
          </h1>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          background: isOnline ? 'rgba(0,255,157,0.08)' : 'rgba(255,195,0,0.08)',
          border: `1px solid ${isOnline ? 'rgba(0,255,157,0.25)' : 'rgba(255,195,0,0.25)'}`,
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: isOnline ? 'var(--neon-green)' : 'var(--neon-yellow)',
            animation: 'pulse-dot 1.5s ease infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: isOnline ? 'var(--neon-green)' : 'var(--neon-yellow)',
            letterSpacing: '0.1em',
>>>>>>> a076e50 (initial commit)
          }}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
<<<<<<< HEAD

        <p style={{ color: '#888', fontSize: '13px' }}>
          Emergency crisis response system
        </p>
      </div>

      {/* TYPE */}
      <div>
        <p style={{ fontSize: '12px', marginBottom: '10px' }}>
          SELECT INCIDENT TYPE
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
          {Object.entries(SOS_TYPES).map(([key, info]) => {
            const isSelected = selectedType === key;

=======
      </div>

      {/* INCIDENT TYPE */}
      <div>
        <SectionLabel>SELECT INCIDENT TYPE</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          {Object.entries(SOS_TYPES).map(([key, info]) => {
            const isSelected = selectedType === key;
>>>>>>> a076e50 (initial commit)
            return (
              <button
                key={key}
                onClick={() => setSelectedType(isSelected ? null : key)}
                style={{
<<<<<<< HEAD
                  background: isSelected ? info.bg : '#111',
                  border: `1px solid ${isSelected ? info.color : '#333'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  transition: '0.2s',
                }}
              >
                <div style={{ fontSize: '24px' }}>{info.emoji}</div>
                <div style={{
                  fontSize: '12px',
                  color: isSelected ? info.color : '#aaa',
                  fontWeight: 700,
                }}>
                  {info.label}
                </div>
=======
                  background: isSelected
                    ? `linear-gradient(135deg, ${info.color}25, ${info.color}10)`
                    : 'rgba(10,18,32,0.8)',
                  border: `1px solid ${isSelected ? info.color + '60' : 'rgba(0,212,255,0.1)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected ? `0 0 30px ${info.color}20, inset 0 1px 0 ${info.color}20` : 'none',
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(ellipse at center, ${info.color}12, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                )}
                <span style={{
                  fontSize: '28px',
                  filter: isSelected ? `drop-shadow(0 0 10px ${info.color})` : 'none',
                  transition: 'filter 0.2s',
                  lineHeight: 1,
                }}>
                  {info.emoji}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: isSelected ? info.color : 'var(--text-secondary)',
                  transition: 'color 0.2s',
                }}>
                  {info.label.toUpperCase()}
                </span>
>>>>>>> a076e50 (initial commit)
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCATION */}
      <div>
<<<<<<< HEAD
        <p style={{ fontSize: '12px', marginBottom: '10px' }}>
          YOUR LOCATION
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          {LOCATIONS.map((loc) => {
            const isSel = selectedLocation === loc;

            return (
              <button
                key={loc}
                onClick={() => {
                  setSelectedLocation(isSel ? '' : loc);
                  setCustomLocation('');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: isSel ? '1px solid #00c2ff' : '1px solid #333',
                  background: isSel ? '#00c2ff22' : '#111',
                  color: isSel ? '#00c2ff' : '#aaa',
=======
        <SectionLabel>YOUR LOCATION</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
          {LOCATIONS.map((loc) => {
            const isSel = selectedLocation === loc;
            return (
              <button
                key={loc}
                onClick={() => { setSelectedLocation(isSel ? '' : loc); setCustomLocation(''); }}
                style={{
                  padding: '6px 13px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isSel ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.12)'}`,
                  background: isSel ? 'rgba(0,212,255,0.12)' : 'rgba(10,18,32,0.6)',
                  color: isSel ? 'var(--neon-blue)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: isSel ? 600 : 400,
                  transition: 'all 0.15s ease',
                  boxShadow: isSel ? '0 0 12px rgba(0,212,255,0.15)' : 'none',
>>>>>>> a076e50 (initial commit)
                }}
              >
                {loc}
              </button>
            );
          })}
        </div>
<<<<<<< HEAD

        <input
          value={customLocation}
          onChange={(e) => {
            setCustomLocation(e.target.value);
            setSelectedLocation('');
          }}
          placeholder="Custom location..."
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#111',
            color: '#fff',
          }}
        />
      </div>

      {/* LORA */}
      <div>
        <label style={{ fontSize: '13px' }}>
          <input
            type="checkbox"
            checked={loraMode}
            onChange={() => setLoraMode(!loraMode)}
          />
          {' '}Use LoRa (offline radio)
        </label>
      </div>

      {/* SOS BUTTON */}
      <div style={{ textAlign: 'center' }}>
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          disabled={!canSend}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: canSend ? '#ff4500' : '#333',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          {sending
            ? '...'
            : holdProgress > 0
              ? `${Math.round(holdProgress)}%`
              : 'HOLD'}
        </button>

        <p style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
          Hold to send SOS
        </p>
      </div>

      {/* STATUS */}
      {confirmed && <p style={{ color: '#00ff88' }}>✅ SOS Sent</p>}

      {/* LAST SENT */}
      {lastSent && (
        <div style={{
          background: '#111',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #333',
        }}>
          <p>{SOS_TYPES[lastSent.type]?.emoji} {lastSent.type} — {lastSent.location}</p>
          <p style={{ fontSize: '12px', color: '#888' }}>
            {new Date(lastSent.sentAt).toLocaleTimeString()}
          </p>
          <p style={{ fontSize: '12px' }}>
            Mode: {lastSent.mode}
          </p>
=======
        <div style={{ position: 'relative' }}>
          <input
            value={customLocation}
            onChange={(e) => { setCustomLocation(e.target.value); setSelectedLocation(''); }}
            placeholder="Or type custom location..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${customLocation ? 'rgba(0,212,255,0.3)' : 'rgba(0,212,255,0.1)'}`,
              background: 'rgba(6,11,18,0.8)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
            onBlur={e => e.target.style.borderColor = customLocation ? 'rgba(0,212,255,0.3)' : 'rgba(0,212,255,0.1)'}
          />
          <span style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none',
          }}>📍</span>
        </div>
      </div>

      {/* LORA TOGGLE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(10,18,32,0.6)',
        border: `1px solid ${loraMode ? 'rgba(176,96,255,0.3)' : 'rgba(0,212,255,0.08)'}`,
        transition: 'all 0.2s ease',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: loraMode ? 'var(--accent-lora)' : 'var(--text-primary)',
            marginBottom: '3px',
          }}>
            📡 LoRa RADIO MODE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
            Bypass internet — use radio mesh
          </div>
        </div>
        <ToggleSwitch checked={loraMode} onChange={() => setLoraMode(!loraMode)} color="var(--accent-lora)" />
      </div>

      {/* ── MAIN SOS BUTTON ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px 0',
      }}>
        {/* Status hint */}
        {!canSend && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textAlign: 'center',
          }}>
            {!selectedType ? '↑ SELECT INCIDENT TYPE' : !location ? '↑ SELECT LOCATION' : ''}
          </div>
        )}

        {/* Radial rings */}
        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
          {/* Outer pulse rings */}
          {isHolding && [1, 2, 3].map(i => (
            <div key={i} style={{
              position: 'absolute',
              inset: `-${i * 20}px`,
              borderRadius: '50%',
              border: `1px solid ${activeColor}`,
              opacity: 0,
              animation: `pulse-ring ${1 + i * 0.3}s ease ${i * 0.2}s infinite`,
              pointerEvents: 'none',
            }} />
          ))}

          {/* SVG progress ring */}
          <svg
            width="200" height="200"
            style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
          >
            {/* Background track */}
            <circle
              cx="100" cy="100" r="70"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3"
            />
            {/* Progress arc */}
            <circle
              cx="100" cy="100" r="70"
              fill="none"
              stroke={activeColor}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: isHolding ? 'none' : 'stroke-dashoffset 0.3s ease',
                filter: `drop-shadow(0 0 4px ${activeColor})`,
              }}
            />
          </svg>

          {/* Main button */}
          <button
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={(e) => { e.preventDefault(); startHold(); }}
            onTouchEnd={cancelHold}
            disabled={!canSend && !sending}
            style={{
              position: 'absolute',
              inset: '16px',
              borderRadius: '50%',
              background: canSend
                ? `radial-gradient(circle at 35% 35%, ${activeColor}60, ${activeColor}20)`
                : 'radial-gradient(circle at 35% 35%, rgba(50,60,80,0.8), rgba(20,30,48,0.8))',
              border: `2px solid ${canSend ? activeColor + '80' : 'rgba(255,255,255,0.08)'}`,
              color: canSend ? activeColor : 'var(--text-muted)',
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              animation: canSend && !isHolding && !sending ? 'sos-breathe 3s ease infinite' : 'none',
              boxShadow: canSend
                ? `0 0 40px ${activeColor}40, 0 0 80px ${activeColor}15, inset 0 1px 0 ${activeColor}30`
                : 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            {sending ? (
              <>
                <div style={{
                  width: '28px', height: '28px',
                  border: `2px solid ${activeColor}40`,
                  borderTop: `2px solid ${activeColor}`,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.12em' }}>
                  SENDING
                </span>
              </>
            ) : confirmed ? (
              <>
                <span style={{ fontSize: '32px' }}>✓</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--neon-green)' }}>
                  SENT
                </span>
              </>
            ) : (
              <>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isHolding ? '28px' : '22px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                  transition: 'font-size 0.1s ease',
                }}>
                  {isHolding ? `${Math.round(holdProgress)}%` : 'SOS'}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  opacity: 0.8,
                }}>
                  {isHolding ? 'HOLD...' : 'HOLD TO SEND'}
                </span>
              </>
            )}
          </button>
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          textAlign: 'center',
        }}>
          HOLD FOR {HOLD_DURATION / 1000}s TO TRANSMIT EMERGENCY SIGNAL
        </p>
      </div>

      {/* LAST SENT */}
      {lastSent && (
        <div style={{
          background: 'rgba(0,255,157,0.05)',
          border: '1px solid rgba(0,255,157,0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          animation: 'slide-up 0.3s ease',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: 'var(--neon-green)',
            marginBottom: '10px',
          }}>
            ✓ LAST TRANSMISSION
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>
                {SOS_TYPES[lastSent.type]?.emoji}
              </span>
              <span style={{ fontWeight: 600, color: SOS_TYPES[lastSent.type]?.color }}>
                {SOS_TYPES[lastSent.type]?.label}
              </span>
              <span style={{ color: 'var(--text-secondary)', margin: '0 8px' }}>@</span>
              <span style={{ color: 'var(--text-primary)' }}>{lastSent.location}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge color="var(--neon-green)">
                {MODE_CONFIG[lastSent.mode]?.icon} {MODE_CONFIG[lastSent.mode]?.label}
              </Badge>
              <Badge color="var(--text-muted)">
                {new Date(lastSent.sentAt).toLocaleTimeString()}
              </Badge>
            </div>
          </div>
>>>>>>> a076e50 (initial commit)
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      letterSpacing: '0.2em',
      color: 'var(--text-muted)',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <div style={{ width: '20px', height: '1px', background: 'var(--text-muted)', opacity: 0.5 }} />
      {children}
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      letterSpacing: '0.08em',
      color,
      background: `${color}15`,
      border: `1px solid ${color}30`,
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
    }}>
      {children}
    </span>
  );
}

function ToggleSwitch({ checked, onChange, color = 'var(--neon-blue)' }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: '48px', height: '26px',
        borderRadius: '13px',
        background: checked ? color : 'rgba(255,255,255,0.08)',
        border: `1px solid ${checked ? color : 'rgba(255,255,255,0.1)'}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.25s ease',
        boxShadow: checked ? `0 0 12px ${color}60` : 'none',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: '3px',
        left: checked ? '24px' : '3px',
        width: '18px', height: '18px',
        borderRadius: '50%',
        background: checked ? '#fff' : 'rgba(255,255,255,0.4)',
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </div>
  );
}
>>>>>>> a076e50 (initial commit)
