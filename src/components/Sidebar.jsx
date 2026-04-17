// src/components/Sidebar.jsx
import React, { useState } from 'react';

const NAV_ITEMS = [
  {
    id: 'sos',
    label: 'SOS ALERT',
    shortLabel: 'SOS',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: '#ff2050',
  },
  {
    id: 'dashboard',
    label: 'DASHBOARD',
    shortLabel: 'DASH',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    color: '#00d4ff',
  },
  {
    id: 'nearby',
    label: 'NEARBY',
    shortLabel: 'MAP',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    color: '#b060ff',
  },
];

export default function Sidebar({ activeTab, onTabChange, isOpen, onToggle, isOnline }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: isOpen ? '220px' : '70px',
      background: 'rgba(6, 11, 18, 0.96)',
      backdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(0,212,255,0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 99,
      transition: 'width 0.35s ease',
      overflow: 'hidden',
      boxShadow: '4px 0 40px rgba(0,0,0,0.6)',
    }}>

      {/* LOGO SECTION */}
      <div style={{
        padding: isOpen ? '24px' : '20px 10px',
        borderBottom: '1px solid rgba(0,212,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>

        {/* 🔥 YOUR LOGO IMAGE */}
        <img
          src="/logo.png"
          alt="CRYSALIS Logo"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            objectFit: 'cover',
            boxShadow: '0 0 20px rgba(176,96,255,0.6)',
          }}
        />

        {isOpen && (
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              background: 'linear-gradient(90deg, #00c2ff, #b060ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              CRYSALIS
            </div>

            <div style={{
              fontSize: '10px',
              color: '#8888aa',
              letterSpacing: '0.15em',
              marginTop: '3px',
            }}>
              SMART CRISIS SYSTEM
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: isOpen ? '12px 16px' : '12px',
                borderRadius: '12px',
                background: isActive
                  ? `${item.color}20`
                  : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: isActive ? item.color : '#aaa',
                transition: 'all 0.2s',
                justifyContent: isOpen ? 'flex-start' : 'center',
              }}
            >
              {item.icon}

              {isOpen && (
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* TOGGLE BUTTON */}
      <div style={{ padding: '12px' }}>
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
            color: '#888',
            cursor: 'pointer',
          }}
        >
          {isOpen ? 'Collapse' : 'Expand'}
        </button>
      </div>

    </aside>
  );
}