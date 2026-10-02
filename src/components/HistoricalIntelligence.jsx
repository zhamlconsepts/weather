import React from 'react';
import { formatTemp } from '../services/weatherApi';
import { History, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function HistoricalIntelligence({ historical, currentTemp, state, t }) {
  if (!historical || currentTemp === undefined || currentTemp === null) {
    return null;
  }

  const renderBadge = (pastTemp) => {
    if (pastTemp === null || pastTemp === undefined || isNaN(pastTemp)) {
      return (
        <span className="history-badge badge-same">
          <Minus size={13} />
          {t.vsToday}
        </span>
      );
    }

    const diff = currentTemp - pastTemp;
    const absDiff = Math.abs(diff).toFixed(1);

    if (diff > 0.3) {
      return (
        <span className="history-badge badge-warmer">
          <ArrowUpRight size={13} />
          +{absDiff}° {t.warmerBadge}
        </span>
      );
    } else if (diff < -0.3) {
      return (
        <span className="history-badge badge-colder">
          <ArrowDownRight size={13} />
          -{absDiff}° {t.colderBadge}
        </span>
      );
    } else {
      return (
        <span className="history-badge badge-same">
          <Minus size={13} />
          {t.sameBadge}
        </span>
      );
    }
  };

  return (
    <div className="history-section">
      <div className="section-title" style={{ fontSize: '1.1rem' }}>
        <History size={18} color="#38bdf8" />
        <span>Tarixiy Taqqoslash / Historical Telemetry</span>
      </div>

      <div className="history-grid">
        {/* Yesterday */}
        <div className="glass-panel history-card">
          <span className="history-card-label">{t.yesterday}</span>
          <span className="history-card-temp">{formatTemp(historical.yesterday, state.unit)}</span>
          {renderBadge(historical.yesterday)}
        </div>

        {/* Last Week */}
        <div className="glass-panel history-card">
          <span className="history-card-label">{t.lastWeek}</span>
          <span className="history-card-temp">{formatTemp(historical.lastWeek, state.unit)}</span>
          {renderBadge(historical.lastWeek)}
        </div>

        {/* Last Month */}
        <div className="glass-panel history-card">
          <span className="history-card-label">{t.lastMonth}</span>
          <span className="history-card-temp">{formatTemp(historical.lastMonth, state.unit)}</span>
          {renderBadge(historical.lastMonth)}
        </div>
      </div>
    </div>
  );
}
