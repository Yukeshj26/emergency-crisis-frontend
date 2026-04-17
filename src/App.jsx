// src/App.jsx
import React, { useState, useEffect } from 'react';
import './styles/global.css';

<<<<<<< HEAD
import OfflineBanner    from './components/OfflineBanner';
import { useToast }     from './components/Toast';

import SOSScreen        from './screens/SOSScreen';
import StaffDashboard   from './screens/StaffDashboard';
import NearbyServices   from './screens/NearbyServices';

import { initNotifications, listenForegroundMessages } from './firebase/notifications';
import { registerNetworkListeners }                    from './services/offlineQueue';

const NAV_ITEMS = [
  { id: 'sos',       label: 'SOS Alert',  icon: SosIcon  },
  { id: 'dashboard', label: 'Dashboard',  icon: DashIcon },
  { id: 'nearby',    label: 'Nearby',     icon: MapIcon  },
];

export default function App() {
  const [activeTab,    setActiveTab]    = useState('sos');
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [isOnline,     setIsOnline]     = useState(navigator.onLine);
  const [syncing,      setSyncing]      = useState(false);
  const [syncProgress, setSyncProgress] = useState(null);
  const { showToast, ToastComponent }   = useToast();

  useEffect(() => {
    const cleanup = registerNetworkListeners(
      ({ online }) => {
        setIsOnline(online);
        if (online) { showToast('Back online — syncing', 'success'); setSyncing(true); }
        else { showToast('Offline — incidents queued', 'warning'); setSyncing(false); }
      },
      (progress) => {
        setSyncProgress(progress);
        if (progress.synced === progress.total) {
          setTimeout(() => { setSyncing(false); setSyncProgress(null); }, 1500);
          showToast(`Synced ${progress.synced} incident(s)`, 'success');
        }
      }
    );
    return cleanup;
  }, []);

  useEffect(() => {
    initNotifications();
    const unsub = listenForegroundMessages(({ title, body }) => showToast(`${title}: ${body}`, 'info'));
    return unsub;
  }, []);

  const handleTabChange = (id) => { setActiveTab(id); setSidebarOpen(false); };

  const renderScreen = () => {
    switch (activeTab) {
      case 'sos':       return <SOSScreen      isOnline={isOnline} showToast={showToast} />;
      case 'dashboard': return <StaffDashboard showToast={showToast} />;
      case 'nearby':    return <NearbyServices showToast={showToast} />;
      default:          return <SOSScreen      isOnline={isOnline} showToast={showToast} />;
=======
import Sidebar        from './components/Sidebar';
import OfflineBanner  from './components/OfflineBanner';
import { useToast }   from './components/Toast';

import SOSScreen      from './screens/SOSScreen';
import StaffDashboard from './screens/StaffDashboard';
import NearbyServices from './screens/NearbyServices';

import { syncQueue }  from './services/offlineQueue';
import {
  initNotifications,
  listenForegroundMessages
} from './firebase/notifications';

export default function App() {
  const [activeTab, setActiveTab] = useState('sos');
  const [isOnline, setIsOnline]   = useState(navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [syncing, setSyncing]           = useState(false);
  const [syncProgress, setSyncProgress] = useState(null);

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      showToast('NETWORK RESTORED — SYNCING', 'success');
      setSyncing(true);
      try {
        const result = await syncQueue();
        if (result?.total > 0) {
          showToast(`SYNCED ${result.synced} INCIDENT(S)`, 'success');
        }
      } catch (err) {
        showToast('SYNC FAILED', 'error');
      }
      setTimeout(() => { setSyncing(false); setSyncProgress(null); }, 1200);
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('OFFLINE — INCIDENTS WILL BE QUEUED', 'warning');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
      initNotifications?.().then((token) => {
        if (token) console.log('[FCM] Token ready');
      });
      const unsub = listenForegroundMessages?.(({ title, body }) => {
        showToast(`${title}: ${body}`, 'info');
      });
      return () => unsub && unsub();
    } catch (err) {
      console.warn('[FCM] Not configured yet');
    }
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'sos':       return <SOSScreen isOnline={isOnline} showToast={showToast} />;
      case 'dashboard': return <StaffDashboard showToast={showToast} />;
      case 'nearby':    return <NearbyServices showToast={showToast} />;
      default:          return <SOSScreen isOnline={isOnline} showToast={showToast} />;
>>>>>>> a076e50 (initial commit)
    }
  };

  return (
<<<<<<< HEAD
    <div className="app-root">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Crysalis" className="sidebar-logo-img" />
          <div className="sidebar-logo-text">
            <span className="sidebar-brand">CRYSALIS</span>
            <span className="sidebar-sub">Crisis Response</span>
          </div>
        </div>

        <div className={`sidebar-status ${isOnline ? 'online' : 'offline'}`}>
          <span className="status-dot" />
          <span>{isOnline ? 'System Online' : 'Offline Mode'}</span>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label">NAVIGATION</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} className={`sidebar-nav-item ${isActive ? 'active' : ''}`} onClick={() => handleTabChange(item.id)}>
                <span className="sidebar-nav-icon"><Icon /></span>
                <span className="sidebar-nav-text">{item.label}</span>
                {isActive && <span className="sidebar-active-bar" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>RESPOND v1.0</p>
          <p>Hackathon Build 2026</p>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
            <span className={`ham-lines ${sidebarOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
          <div className="topbar-center">
            <img src="/logo.png" alt="Crysalis" className="topbar-logo-img" />
            <span className="topbar-title">{NAV_ITEMS.find(n => n.id === activeTab)?.label}</span>
          </div>
          <div className={`topbar-online-dot ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'Online' : 'Offline'} />
        </header>

        <OfflineBanner isOnline={isOnline} syncing={syncing} syncProgress={syncProgress} />

        <main className="screen-content" style={{ paddingTop: (!isOnline || syncing) ? '44px' : '0' }}>
          {renderScreen()}
        </main>

        <nav className="bottom-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} className={`bottom-nav-item ${isActive ? 'active' : ''}`} onClick={() => handleTabChange(item.id)}>
                {isActive && <span className="bnav-indicator" />}
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

=======
    <div style={{
      display: 'flex',
      minHeight: '100dvh',
      width: '100%',
      background: 'var(--bg-void)',
      position: 'relative',
    }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); if (window.innerWidth <= 768) setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isOnline={isOnline}
      />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: window.innerWidth > 768 ? (sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)') : '0',
        transition: 'margin-left 0.35s cubic-bezier(0.4,0,0.2,1)',
        minHeight: '100dvh',
        position: 'relative',
      }}>
        <OfflineBanner isOnline={isOnline} syncing={syncing} syncProgress={syncProgress} />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingTop: (!isOnline || syncing) ? '48px' : '0',
          transition: 'padding-top 0.3s ease',
          minHeight: '100dvh',
        }}>
          {renderScreen()}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)', zIndex: 98,
          }}
        />
      )}

>>>>>>> a076e50 (initial commit)
      {ToastComponent}
    </div>
  );
}
<<<<<<< HEAD

function SosIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
}
function DashIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>;
}
function MapIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>;
}
=======
>>>>>>> a076e50 (initial commit)
