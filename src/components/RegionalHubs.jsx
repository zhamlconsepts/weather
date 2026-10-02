import React from 'react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../services/weatherApi';
import { Radio, ArrowRight } from 'lucide-react';

export default function RegionalHubs({ cards, onSelectStation, state, t }) {
  return (
    <div className="rail-stations">
      <div className="section-title" style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>
        <Radio size={18} color="#38bdf8" />
        <span>{t.regionalStations}</span>
      </div>

      {cards.map((station) => (
        <div
          key={station.id}
          className="glass-panel rail-card"
          onClick={() => onSelectStation(station)}
          title={t.clickToSwitch}
        >
          <div className="rail-card-top">
            <div>
              <div className="rail-city-name">{station.city}</div>
              <div className="rail-country-name">{station.country}</div>
            </div>
            <WeatherIcon type={station.weatherInfo?.type || 'partly-cloudy'} size={28} />
          </div>

          <div className="rail-card-bottom">
            <div>
              <div className="rail-temp">{formatTemp(station.temp, state.unit)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {station.weatherInfo?.title || 'Yuklanmoqda...'}
              </div>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
              <span>{state.lang === 'uz' ? 'O‘tish' : 'View'}</span>
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
