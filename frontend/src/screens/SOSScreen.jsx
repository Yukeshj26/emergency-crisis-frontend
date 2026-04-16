// src/screens/SOSScreen.jsx

import React, { useState, useRef } from 'react';
import { useSOS } from '../hooks/useSOS';
import { SOS_TYPES, MODE_CONFIG } from '../utils/constants';

const LOCATIONS = [
  'Room 101', 'Room 202', 'Room 204', 'Room 305', 'Room 410',
  'Lobby', 'Cafeteria', 'Parking Lot', 'Stairwell A', 'Stairwell B',
  'Roof', 'Basement', 'Server Room', 'Conference Hall',
];

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
  };

  const cancelHold = () => {
    clearInterval(holdInterval.current);
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
      animation: 'fade-in 0.4s ease',
    }}>

      {/* HEADER */}
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
          }}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

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

            return (
              <button
                key={key}
                onClick={() => setSelectedType(isSelected ? null : key)}
                style={{
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
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCATION */}
      <div>
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
                }}
              >
                {loc}
              </button>
            );
          })}
        </div>

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
        </div>
      )}
    </div>
  );
}