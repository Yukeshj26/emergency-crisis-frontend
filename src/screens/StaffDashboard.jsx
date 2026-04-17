<<<<<<< HEAD
// src/screens/StaffDashboard.jsx
=======
>>>>>>> a076e50 (initial commit)
import React, { useState, useEffect } from 'react';
import {
  subscribeToIncidents,
  subscribeToStaff,
  updateIncidentStatus,
  resolveIncident,
} from '../services/incidentService';
import { SOS_TYPES, STATUS_CONFIG, MODE_CONFIG } from '../utils/constants';

const STATUS_ORDER = { active: 0, assigned: 1, in_progress: 2, resolved: 3 };

export default function StaffDashboard({ showToast }) {
  const [incidents, setIncidents] = useState([]);
<<<<<<< HEAD
  const [staff,     setStaff]     = useState([]);
  const [filter,    setFilter]    = useState('all');
  const [loading,   setLoading]   = useState(true);

  // Subscribe to real-time data
  useEffect(() => {
    const unsubIncidents = subscribeToIncidents((data) => {
      setIncidents(data);
      setLoading(false);
    });
    const unsubStaff = subscribeToStaff(setStaff);
    return () => { unsubIncidents(); unsubStaff(); };
  }, []);

  // ── Handlers ──────────────────────────────
=======
  const [staff, setStaff]         = useState([]);
  const [filter, setFilter]       = useState('all');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const unsubI = subscribeToIncidents((data) => { setIncidents(data); setLoading(false); });
    const unsubS = subscribeToStaff(setStaff);
    return () => { unsubI(); unsubS(); };
  }, []);

>>>>>>> a076e50 (initial commit)
  const handleStatusUpdate = async (incident, nextStatus) => {
    try {
      if (nextStatus === 'resolved') {
        await resolveIncident(incident.id, incident.assignedTo);
<<<<<<< HEAD
        showToast(`Incident resolved ✓`, 'success');
      } else {
        await updateIncidentStatus(incident.id, nextStatus);
        showToast(`Status → ${nextStatus}`, 'info');
      }
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  // ── Derived data ───────────────────────────
=======
        showToast('INCIDENT RESOLVED ✓', 'success');
      } else {
        await updateIncidentStatus(incident.id, nextStatus);
        showToast(`STATUS → ${nextStatus.replace('_',' ').toUpperCase()}`, 'info');
      }
    } catch {
      showToast('UPDATE FAILED', 'error');
    }
  };

>>>>>>> a076e50 (initial commit)
  const filtered = incidents
    .filter((i) => filter === 'all' || i.status === filter)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.timestamp - a.timestamp);

  const counts = {
<<<<<<< HEAD
    active:      incidents.filter((i) => i.status === 'active').length,
    assigned:    incidents.filter((i) => i.status === 'assigned').length,
    in_progress: incidents.filter((i) => i.status === 'in_progress').length,
    resolved:    incidents.filter((i) => i.status === 'resolved').length,
  };

  const availableStaff = staff.filter((s) => s.available).length;

  return (
    <div style={{
      padding:       '24px 20px',
      paddingBottom: 'calc(var(--nav-height) + 24px)',
      minHeight:     '100dvh',
      animation:     'fade-in 0.4s ease',
    }}>

      {/* Header */}
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'24px', letterSpacing:'-0.02em', marginBottom:'4px' }}>
          Staff Dashboard
        </h1>
        <p style={{ color:'var(--text-secondary)', fontSize:'13px' }}>
=======
    active:      incidents.filter(i => i.status === 'active').length,
    assigned:    incidents.filter(i => i.status === 'assigned').length,
    in_progress: incidents.filter(i => i.status === 'in_progress').length,
    resolved:    incidents.filter(i => i.status === 'resolved').length,
  };
  const availableStaff = staff.filter(s => s.available).length;

  const STATS = [
    { label: 'ACTIVE',    value: counts.active,      color: '#ff2050', icon: '🔴', glow: 'rgba(255,32,80,0.3)' },
    { label: 'ASSIGNED',  value: counts.assigned,    color: '#ffd60a', icon: '🟡', glow: 'rgba(255,214,10,0.2)' },
    { label: 'IN PROG.',  value: counts.in_progress, color: '#00d4ff', icon: '🔵', glow: 'rgba(0,212,255,0.2)' },
    { label: 'STAFF FREE',value: availableStaff,     color: '#00ff9d', icon: '👤', glow: 'rgba(0,255,157,0.2)' },
  ];

  return (
    <div style={{
      minHeight: '100dvh',
      padding: '32px 28px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      animation: 'fade-in 0.4s ease',
    }}>

      {/* HEADER */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '6px' }}>
          CRYSALIS / COMMAND CENTER
        </div>
        <h1 style={{
          fontSize: 'clamp(20px, 4vw, 30px)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.08em',
          background: 'linear-gradient(135deg, #e8f4ff, #00d4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          STAFF DASHBOARD
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px', fontFamily: 'var(--font-body)' }}>
>>>>>>> a076e50 (initial commit)
          Real-time incident coordination
        </p>
      </div>

<<<<<<< HEAD
      {/* Stats row */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap:                 '10px',
        marginBottom:        '24px',
      }}>
        {[
          { label:'Active',   value: counts.active,      color:'#ff4500', icon:'🔴' },
          { label:'Assigned', value: counts.assigned,    color:'#ffc300', icon:'🟡' },
          { label:'Progress', value: counts.in_progress, color:'#00c2ff', icon:'🔵' },
          { label:'Available Staff', value: availableStaff, color:'#00ff88', icon:'👤' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background:   'var(--bg-surface)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding:      '14px 16px',
            display:      'flex',
            justifyContent:'space-between',
            alignItems:   'center',
          }}>
            <div>
              <p style={{ fontSize:'22px', fontWeight:800, color: stat.color, lineHeight:1.1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>
                {stat.label}
              </p>
            </div>
            <span style={{ fontSize:'24px', opacity:0.7 }}>{stat.icon}</span>
=======
      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {STATS.map((stat) => (
          <div key={stat.label} style={{
            background: `linear-gradient(135deg, ${stat.glow ? stat.color + '12' : 'rgba(10,18,32,0.8)'}, rgba(6,11,18,0.8))`,
            border: `1px solid ${stat.color}25`,
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: counts.active > 0 && stat.label === 'ACTIVE' ? `0 0 30px ${stat.glow}` : 'none',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '40%',
              background: `radial-gradient(ellipse at right, ${stat.color}08, transparent)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 900,
              color: stat.color,
              lineHeight: 1,
              textShadow: `0 0 20px ${stat.color}80`,
              animation: 'count-up 0.4s ease',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              marginTop: '6px',
            }}>
              {stat.label}
            </div>
>>>>>>> a076e50 (initial commit)
          </div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Staff pills */}
      <div style={{ marginBottom:'20px' }}>
        <p style={{
          fontSize:'11px', fontFamily:'var(--font-mono)', color:'var(--text-muted)',
          letterSpacing:'0.12em', marginBottom:'10px',
        }}>
          STAFF AVAILABILITY
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {staff.map((s) => (
            <div key={s.id} style={{
              background:   s.available ? 'rgba(0,255,136,0.08)' : 'rgba(255,69,0,0.08)',
              border:       `1px solid ${s.available ? 'rgba(0,255,136,0.25)' : 'rgba(255,69,0,0.25)'}`,
              borderRadius: 'var(--radius-full)',
              padding:      '6px 12px',
              fontSize:     '13px',
              display:      'flex',
              alignItems:   'center',
              gap:          '6px',
            }}>
              <span style={{
                width:'7px', height:'7px', borderRadius:'50%',
                background: s.available ? '#00ff88' : '#ff4500',
                flexShrink: 0,
                animation:  s.available ? 'none' : 'pulse-dot 1.5s ease infinite',
              }} />
              <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{s.name}</span>
              <span style={{ fontSize:'11px', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
=======
      {/* STAFF AVAILABILITY */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--text-muted)', opacity: 0.5 }} />
          FIELD PERSONNEL
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {staff.length === 0 ? (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
              No staff data
            </span>
          ) : staff.map((s) => (
            <div key={s.id} style={{
              background: s.available ? 'rgba(0,255,157,0.06)' : 'rgba(255,32,80,0.06)',
              border: `1px solid ${s.available ? 'rgba(0,255,157,0.2)' : 'rgba(255,32,80,0.2)'}`,
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: s.available ? 'var(--neon-green)' : 'var(--neon-red)',
                flexShrink: 0,
                boxShadow: `0 0 6px ${s.available ? 'var(--neon-green)' : 'var(--neon-red)'}`,
                animation: !s.available ? 'pulse-dot 1.5s ease infinite' : 'none',
              }} />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.05)',
                padding: '1px 6px',
                borderRadius: '4px',
              }}>
>>>>>>> a076e50 (initial commit)
                F{s.floor}
              </span>
            </div>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* Filter tabs */}
      <div style={{
        display:       'flex',
        gap:           '6px',
        marginBottom:  '16px',
        overflowX:     'auto',
        paddingBottom: '4px',
      }}>
        {['all', 'active', 'assigned', 'in_progress', 'resolved'].map((f) => {
          const isActive = filter === f;
          const cfg      = STATUS_CONFIG[f];
=======
      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['all', 'active', 'assigned', 'in_progress', 'resolved'].map((f) => {
          const isActive = filter === f;
          const cfg = STATUS_CONFIG[f];
          const count = f === 'all' ? incidents.length : counts[f];
>>>>>>> a076e50 (initial commit)
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
<<<<<<< HEAD
                background:   isActive ? (cfg?.color ? `${cfg.color}22` : 'rgba(255,255,255,0.1)') : 'transparent',
                border:       `1px solid ${isActive ? (cfg?.color || 'var(--border-active)') : 'var(--border)'}`,
                borderRadius: 'var(--radius-full)',
                padding:      '6px 14px',
                fontSize:     '12px',
                fontWeight:   700,
                color:        isActive ? (cfg?.color || 'var(--text-primary)') : 'var(--text-muted)',
                whiteSpace:   'nowrap',
                transition:   'all 0.15s ease',
                letterSpacing:'0.04em',
              }}
            >
              {f === 'all' ? `ALL (${incidents.length})` : f.replace('_', ' ').toUpperCase()}
              {f !== 'all' && counts[f] > 0 && ` · ${counts[f]}`}
=======
                background: isActive
                  ? (cfg?.color ? `${cfg.color}18` : 'rgba(255,255,255,0.08)')
                  : 'rgba(10,18,32,0.6)',
                border: `1px solid ${isActive ? (cfg?.color + '50' || 'rgba(255,255,255,0.3)') : 'rgba(0,212,255,0.1)'}`,
                borderRadius: 'var(--radius-full)',
                padding: '7px 16px',
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                fontWeight: 600,
                color: isActive ? (cfg?.color || 'var(--text-primary)') : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive && cfg?.color ? `0 0 12px ${cfg.color}20` : 'none',
              }}
            >
              {f === 'all' ? 'ALL' : f.replace('_', ' ').toUpperCase()}
              {count > 0 && <span style={{ marginLeft: '6px', opacity: 0.7 }}>({count})</span>}
>>>>>>> a076e50 (initial commit)
            </button>
          );
        })}
      </div>

<<<<<<< HEAD
      {/* Incident list */}
=======
      {/* INCIDENT LIST */}
>>>>>>> a076e50 (initial commit)
      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
<<<<<<< HEAD
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
=======
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
>>>>>>> a076e50 (initial commit)
          {filtered.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              staff={staff}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
// ─────────────────────────────────────────────
// Incident Card
// ─────────────────────────────────────────────
function IncidentCard({ incident, staff, onStatusUpdate }) {
  const typeInfo   = SOS_TYPES[incident.type]   || { emoji:'❓', label:'Unknown', color:'#888', bg:'#111' };
  const statusInfo = STATUS_CONFIG[incident.status] || STATUS_CONFIG.active;
  const modeInfo   = MODE_CONFIG[incident.mode]   || MODE_CONFIG.online;
  const assignedStaff = staff.find((s) => s.id === incident.assignedTo);

  const nextStatuses = {
=======
function IncidentCard({ incident, staff, onStatusUpdate }) {
  const typeInfo   = SOS_TYPES[incident.type]    || { emoji: '❓', label: 'Unknown', color: '#888', bg: '#111' };
  const statusInfo = STATUS_CONFIG[incident.status] || STATUS_CONFIG.active;
  const modeInfo   = MODE_CONFIG[incident.mode]   || MODE_CONFIG.online;
  const assignedStaff = staff.find(s => s.id === incident.assignedTo);
  const isActive = incident.status === 'active';

  const nextStatuses = ({
>>>>>>> a076e50 (initial commit)
    active:      ['assigned', 'in_progress'],
    assigned:    ['in_progress'],
    in_progress: ['resolved'],
    resolved:    [],
<<<<<<< HEAD
  }[incident.status] || [];

  const age = Math.floor((Date.now() - incident.timestamp) / 1000);
  const ageStr = age < 60 ? `${age}s ago`
    : age < 3600 ? `${Math.floor(age/60)}m ago`
    : `${Math.floor(age/3600)}h ago`;

  return (
    <div style={{
      background:   'var(--bg-surface)',
      border:       `1px solid ${incident.status === 'active' ? typeInfo.color + '44' : 'var(--border)'}`,
      borderLeft:   `3px solid ${typeInfo.color}`,
      borderRadius: 'var(--radius-md)',
      padding:      '16px',
      animation:    'slide-up 0.3s ease',
      ...(incident.status === 'active' ? {
        boxShadow: `0 0 20px ${typeInfo.color}22`,
      } : {}),
    }}>
      {/* Top row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <span style={{
            fontSize:'24px',
            filter: incident.status === 'active' ? `drop-shadow(0 0 6px ${typeInfo.color})` : 'none',
          }}>
            {typeInfo.emoji}
          </span>
          <div>
            <p style={{ fontSize:'16px', fontWeight:800, marginBottom:'2px' }}>
              {typeInfo.label}
            </p>
            <p style={{ fontSize:'13px', color:'var(--text-secondary)' }}>
              📍 {incident.location}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          display:      'flex',
          flexDirection:'column',
          alignItems:   'flex-end',
          gap:          '4px',
        }}>
          <span style={{
            fontSize:     '11px',
            fontFamily:   'var(--font-mono)',
            fontWeight:   700,
            color:        statusInfo.color,
            background:   `${statusInfo.color}18`,
            border:       `1px solid ${statusInfo.color}33`,
            padding:      '3px 8px',
            borderRadius: '6px',
            letterSpacing:'0.06em',
            display:      'flex',
            alignItems:   'center',
            gap:          '5px',
          }}>
            {statusInfo.pulse && (
              <span style={{
                width:'5px', height:'5px', borderRadius:'50%',
                background: statusInfo.color,
                display:'inline-block',
                animation: 'pulse-dot 1.5s ease infinite',
              }} />
            )}
            {incident.status.replace('_',' ').toUpperCase()}
          </span>
          <span style={{ fontSize:'11px', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
            {ageStr}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'14px', flexWrap:'wrap' }}>
        <span style={{
          fontSize:'11px', fontFamily:'var(--font-mono)',
          color: modeInfo.color,
          background:`${modeInfo.color}12`,
          border:`1px solid ${modeInfo.color}25`,
          padding:'2px 8px', borderRadius:'4px',
        }}>
          {modeInfo.icon} {modeInfo.label}
        </span>
        {assignedStaff && (
          <span style={{
            fontSize:'11px', fontFamily:'var(--font-mono)',
            color:'#00ff88', background:'rgba(0,255,136,0.08)',
            border:'1px solid rgba(0,255,136,0.2)',
            padding:'2px 8px', borderRadius:'4px',
          }}>
            👤 {assignedStaff.name} (F{assignedStaff.floor})
          </span>
        )}
        <span style={{
          fontSize:'11px', fontFamily:'var(--font-mono)',
          color:'var(--text-muted)',
        }}>
          #{incident.id.slice(-6)}
        </span>
      </div>

      {/* Action buttons */}
      {nextStatuses.length > 0 && (
        <div style={{ display:'flex', gap:'8px' }}>
          {nextStatuses.map((nextStatus) => {
            const nextCfg = STATUS_CONFIG[nextStatus];
            const isResolve = nextStatus === 'resolved';
            return (
              <button
                key={nextStatus}
                onClick={() => onStatusUpdate(incident, nextStatus)}
                style={{
                  flex:         isResolve ? 1 : 'none',
                  background:   isResolve ? `${nextCfg?.color}22` : 'var(--bg-raised)',
                  border:       `1px solid ${nextCfg?.color || 'var(--border)'}55`,
                  borderRadius: 'var(--radius-sm)',
                  padding:      '8px 14px',
                  fontSize:     '12px',
                  fontWeight:   700,
                  color:        nextCfg?.color || 'var(--text-primary)',
                  letterSpacing:'0.06em',
                  transition:   'all 0.15s ease',
                }}
              >
                → {nextStatus.replace('_',' ').toUpperCase()}
=======
  })[incident.status] || [];

  const age = Math.floor((Date.now() - incident.timestamp) / 1000);
  const ageStr = age < 60 ? `${age}s ago` : age < 3600 ? `${Math.floor(age/60)}m ago` : `${Math.floor(age/3600)}h ago`;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${typeInfo.color}08, rgba(6,11,18,0.9))`,
      border: `1px solid ${isActive ? typeInfo.color + '40' : 'rgba(0,212,255,0.1)'}`,
      borderLeft: `3px solid ${typeInfo.color}`,
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      animation: 'slide-up 0.3s ease',
      boxShadow: isActive ? `0 0 30px ${typeInfo.color}15, 0 4px 20px rgba(0,0,0,0.5)` : '0 4px 20px rgba(0,0,0,0.3)',
      transition: 'all 0.2s ease',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px',
            borderRadius: 'var(--radius-md)',
            background: `${typeInfo.color}15`,
            border: `1px solid ${typeInfo.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0,
            filter: isActive ? `drop-shadow(0 0 8px ${typeInfo.color})` : 'none',
          }}>
            {typeInfo.emoji}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: typeInfo.color,
              marginBottom: '4px',
            }}>
              {typeInfo.label.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              📍 {incident.location}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            color: statusInfo.color,
            background: `${statusInfo.color}15`,
            border: `1px solid ${statusInfo.color}30`,
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            letterSpacing: '0.08em',
          }}>
            {statusInfo.pulse && (
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: statusInfo.color,
                animation: 'pulse-dot 1.5s ease infinite',
              }} />
            )}
            {incident.status.replace('_', ' ').toUpperCase()}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
            {ageStr}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <MetaBadge color={modeInfo.color}>{modeInfo.icon} {modeInfo.label}</MetaBadge>
        {assignedStaff && (
          <MetaBadge color="var(--neon-green)">👤 {assignedStaff.name} F{assignedStaff.floor}</MetaBadge>
        )}
        <MetaBadge color="var(--text-muted)">#{incident.id.slice(-6).toUpperCase()}</MetaBadge>
      </div>

      {/* Actions */}
      {nextStatuses.length > 0 && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {nextStatuses.map((ns) => {
            const nsCfg = STATUS_CONFIG[ns];
            const isResolve = ns === 'resolved';
            return (
              <button
                key={ns}
                onClick={() => onStatusUpdate(incident, ns)}
                style={{
                  flex: isResolve ? 1 : 'none',
                  background: isResolve ? `${nsCfg?.color}15` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${nsCfg?.color ? nsCfg.color + '40' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 16px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: nsCfg?.color || 'var(--text-primary)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${nsCfg?.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.background = isResolve ? `${nsCfg?.color}15` : 'rgba(255,255,255,0.04)'; }}
              >
                → {ns.replace('_', ' ').toUpperCase()}
>>>>>>> a076e50 (initial commit)
              </button>
            );
          })}
        </div>
      )}

      {incident.status === 'resolved' && (
<<<<<<< HEAD
        <p style={{ fontSize:'12px', color:'#00ff88', fontFamily:'var(--font-mono)', textAlign:'center' }}>
          ✓ Incident resolved
        </p>
=======
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--neon-green)',
          textAlign: 'center',
          letterSpacing: '0.1em',
        }}>
          ✓ INCIDENT RESOLVED
        </div>
>>>>>>> a076e50 (initial commit)
      )}
    </div>
  );
}

<<<<<<< HEAD
function LoadingState() {
  return (
    <div style={{ textAlign:'center', padding:'60px 0' }}>
      <span style={{ fontSize:'32px', animation:'spin 1s linear infinite', display:'inline-block' }}>⟳</span>
      <p style={{ color:'var(--text-muted)', marginTop:'16px', fontFamily:'var(--font-mono)', fontSize:'13px' }}>
        Loading incidents...
=======
function MetaBadge({ children, color }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      color,
      background: `${color}12`,
      border: `1px solid ${color}25`,
      padding: '3px 8px',
      borderRadius: '4px',
      letterSpacing: '0.06em',
    }}>
      {children}
    </span>
  );
}

function LoadingState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{
        width: '40px', height: '40px',
        border: '2px solid rgba(0,212,255,0.2)',
        borderTop: '2px solid var(--neon-blue)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 16px',
      }} />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em' }}>
        LOADING INCIDENTS...
>>>>>>> a076e50 (initial commit)
      </p>
    </div>
  );
}

function EmptyState({ filter }) {
  return (
<<<<<<< HEAD
    <div style={{ textAlign:'center', padding:'60px 0' }}>
      <span style={{ fontSize:'48px', display:'block', marginBottom:'16px', opacity:0.4 }}>
        {filter === 'resolved' ? '✓' : '📭'}
      </span>
      <p style={{ color:'var(--text-secondary)', fontWeight:600, marginBottom:'6px' }}>
        {filter === 'all' ? 'No incidents reported' : `No ${filter.replace('_',' ')} incidents`}
      </p>
      <p style={{ color:'var(--text-muted)', fontSize:'13px' }}>
        All clear for now
=======
    <div style={{
      textAlign: 'center', padding: '60px 0',
      background: 'rgba(10,18,32,0.4)',
      borderRadius: 'var(--radius-xl)',
      border: '1px dashed rgba(0,212,255,0.1)',
    }}>
      <div style={{ fontSize: '48px', opacity: 0.3, marginBottom: '16px' }}>
        {filter === 'resolved' ? '✓' : '📭'}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.08em', marginBottom: '6px' }}>
        {filter === 'all' ? 'NO INCIDENTS REPORTED' : `NO ${filter.replace('_', ' ').toUpperCase()} INCIDENTS`}
      </p>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        All clear — system nominal
>>>>>>> a076e50 (initial commit)
      </p>
    </div>
  );
}
