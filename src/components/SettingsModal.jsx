import React from 'react';
import { Settings, X, Globe, Thermometer, Wind, MapPin } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  state,
  t,
  onSetLang,
  onSetUnit,
  onSetWindUnit,
  onTriggerGps
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div className="section-title">
            <Settings size={22} color="#38bdf8" />
            <span>{t.settingsTitle}</span>
          </div>
          <button className="icon-button" onClick={onClose} title="Yopish">
            <X size={18} />
          </button>
        </div>

        {/* Language setting */}
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
            <Globe size={18} color="#38bdf8" />
            <span>{t.langSetting}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`toggle-btn ${state.lang === 'uz' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.65rem' }}
              onClick={() => onSetLang('uz')}
            >
              🇺🇿 O‘zbekcha
            </button>
            <button
              className={`toggle-btn ${state.lang === 'en' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.65rem' }}
              onClick={() => onSetLang('en')}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Temperature unit setting */}
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
            <Thermometer size={18} color="#f97316" />
            <span>{t.tempUnit}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`toggle-btn ${state.unit === 'C' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.65rem' }}
              onClick={() => onSetUnit('C')}
            >
              Celsius (°C)
            </button>
            <button
              className={`toggle-btn ${state.unit === 'F' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.65rem' }}
              onClick={() => onSetUnit('F')}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        {/* Wind speed unit setting */}
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
            <Wind size={18} color="#10b981" />
            <span>{t.windUnit}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`toggle-btn ${state.windUnit === 'kmh' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.65rem' }}
              onClick={() => onSetWindUnit('kmh')}
            >
              km/h
            </button>
            <button
              className={`toggle-btn ${state.windUnit === 'mph' ? 'active' : ''}`}
              style={{ flex: 1, padding: '0.65rem' }}
              onClick={() => onSetWindUnit('mph')}
            >
              mph
            </button>
          </div>
        </div>

        {/* Trigger GPS */}
        <button
          className="btn-pill-action"
          style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          onClick={() => {
            onTriggerGps();
            onClose();
          }}
        >
          <MapPin size={18} color="#38bdf8" />
          <span>{t.detectGps}</span>
        </button>
      </div>
    </div>
  );
}
