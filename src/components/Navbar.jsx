import React from 'react';
import {
  CloudSun,
  Search,
  MapPin,
  Settings,
  RotateCw,
  Globe,
  Map,
  Calendar,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar({
  state,
  t,
  onSwitchTab,
  onOpenSearch,
  onOpenSettings,
  onToggleLang,
  onToggleUnit,
  onAutoDetect,
  onRefresh,
  loading
}) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <button className="brand-badge" onClick={() => onSwitchTab('dashboard')}>
            <div className="brand-logo-icon">
              <CloudSun size={26} color="#ffffff" />
            </div>
            <div>
              <div className="brand-title">{t.appName}</div>
              <div className="brand-subtitle">{t.appSubtitle}</div>
            </div>
          </button>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab-btn ${state.activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => onSwitchTab('dashboard')}
            >
              <LayoutDashboard size={16} />
              <span>{t.tabDashboard}</span>
            </button>
            <button
              className={`nav-tab-btn ${state.activeTab === 'map' ? 'active' : ''}`}
              onClick={() => onSwitchTab('map')}
            >
              <Map size={16} />
              <span>{t.tabMap}</span>
            </button>
            <button
              className={`nav-tab-btn ${state.activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => onSwitchTab('calendar')}
            >
              <Calendar size={16} />
              <span>{t.tabCalendar}</span>
            </button>
          </nav>
        </div>

        <div className="header-right">
          {/* Live telemetry sync badge */}
          <button className="btn-pill-action" onClick={onRefresh} title="Refresh Live Telemetry">
            <span className="live-pulse" />
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>LIVE</span>
          </button>

          {/* Auto detect location */}
          <button className="btn-pill-action" onClick={onAutoDetect} title={t.autoDetect}>
            <MapPin size={15} color="#38bdf8" />
            <span className="hidden sm:inline">{t.autoDetect}</span>
          </button>

          {/* Search Trigger */}
          <button className="icon-button" onClick={onOpenSearch} title={t.searchTitle}>
            <Search size={18} />
          </button>

          {/* Language Toggle */}
          <button className="btn-pill-action" onClick={onToggleLang} title="Toggle Language">
            <span>{t.flag}</span>
            <span>{t.langLabel}</span>
          </button>

          {/* Unit Toggle */}
          <button className="btn-pill-action" onClick={onToggleUnit} title="Toggle Unit">
            <span>°{state.unit}</span>
          </button>

          {/* Settings Modal */}
          <button className="icon-button" onClick={onOpenSettings} title={t.settingsTitle}>
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
