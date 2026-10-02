import React, { useState } from 'react';
import WeatherIcon from './WeatherIcon';
import { formatTemp, interpretWeatherCode } from '../services/weatherApi';
import { CalendarDays, TrendingUp } from 'lucide-react';

export default function ForecastStrip({ weather, state, t, onSelectForecastItem }) {
  const [mode, setMode] = useState('daily'); // 'daily' or 'hourly'
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!weather) return null;

  // Prepare 6 items for Daily or Hourly
  const items = [];
  const tempsForCurve = [];

  if (mode === 'daily' && weather.daily) {
    const todayIdx = new Date().getDay();
    for (let i = 0; i < 6; i++) {
      const maxT = weather.daily.temperature_2m_max[i];
      const minT = weather.daily.temperature_2m_min[i];
      const code = weather.daily.weather_code[i];
      const info = interpretWeatherCode(code, state.lang);
      const dayLabel = i === 0 ? t.today : t.daysShort[(todayIdx + i) % 7];

      items.push({
        id: i,
        label: dayLabel,
        maxTemp: maxT,
        minTemp: minT,
        code,
        info
      });
      tempsForCurve.push(maxT);
    }
  } else if (mode === 'hourly' && weather.hourly) {
    const currentHour = new Date().getHours();
    for (let i = 0; i < 6; i++) {
      const hIndex = (currentHour + i * 3) % 168;
      const temp = weather.hourly.temperature_2m[hIndex] ?? weather.current.temperature_2m;
      const code = weather.hourly.weather_code[hIndex] ?? weather.current.weather_code;
      const info = interpretWeatherCode(code, state.lang);
      const displayHour = (currentHour + i * 3) % 24;
      const hourLabel = i === 0 ? t.now : `${displayHour < 10 ? '0' : ''}${displayHour}:00`;

      items.push({
        id: i,
        label: hourLabel,
        maxTemp: temp,
        minTemp: temp - 2,
        code,
        info
      });
      tempsForCurve.push(temp);
    }
  }

  // Generate SVG Bezier Path
  const width = 800;
  const height = 120;
  const count = tempsForCurve.length;
  const minT = Math.min(...tempsForCurve);
  const maxT = Math.max(...tempsForCurve);
  const range = (maxT - minT) || 1;
  const xStep = width / (count - 1);

  const points = tempsForCurve.map((tVal, idx) => {
    const x = Math.round(idx * xStep);
    const normalized = (tVal - minT) / range;
    const y = Math.round(height - 25 - (normalized * 65));
    return { x, y, temp: tVal };
  });

  let curvePath = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = Math.round(p0.x + (p1.x - p0.x) * 0.45);
    const cp1y = p0.y;
    const cp2x = Math.round(p0.x + (p1.x - p0.x) * 0.55);
    const cp2y = p1.y;
    curvePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
  }

  const fillPath = `${curvePath} L ${width},${height} L 0,${height} Z`;

  const handleItemClick = (item, idx) => {
    setSelectedIndex(idx);
    if (onSelectForecastItem) {
      onSelectForecastItem(item);
    }
  };

  return (
    <div className="glass-panel forecast-card">
      <div className="forecast-header">
        <div className="section-title">
          <CalendarDays size={20} color="#38bdf8" />
          <span>{mode === 'daily' ? t.fModeDaily : t.fModeHourly}</span>
        </div>

        <div className="toggle-group">
          <button
            className={`toggle-btn ${mode === 'daily' ? 'active' : ''}`}
            onClick={() => { setMode('daily'); setSelectedIndex(0); }}
          >
            {t.fModeDaily}
          </button>
          <button
            className={`toggle-btn ${mode === 'hourly' ? 'active' : ''}`}
            onClick={() => { setMode('hourly'); setSelectedIndex(0); }}
          >
            {t.fModeHourly}
          </button>
        </div>
      </div>

      {/* Forecast Items Strip */}
      <div className="forecast-items-row">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`forecast-item ${selectedIndex === idx ? 'selected' : ''}`}
            onClick={() => handleItemClick(item, idx)}
          >
            <span className="forecast-item-day">{item.label}</span>
            <WeatherIcon type={item.info.type} size={28} />
            <span className="forecast-item-temp">{formatTemp(item.maxTemp, state.unit)}</span>
            <span className="forecast-item-range">
              {formatTemp(item.minTemp, state.unit)} – {formatTemp(item.maxTemp, state.unit)}
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic Smooth SVG Wave Curve */}
      <div className="curve-chart-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Area Fill */}
          <path d={fillPath} fill="url(#curveGradient)" />

          {/* Glow Line */}
          <path
            d={curvePath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glowEffect)"
          />

          {/* Interactive Data Points */}
          {points.map((p, idx) => (
            <g key={idx} style={{ cursor: 'pointer' }} onClick={() => handleItemClick(items[idx], idx)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={selectedIndex === idx ? 7 : 4.5}
                fill={selectedIndex === idx ? '#38bdf8' : '#ffffff'}
                stroke="#07090e"
                strokeWidth="2"
              />
              {selectedIndex === idx && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
        <span>{t.forecastTrajectory}</span>
        <span>{t.forecastHint}</span>
      </div>
    </div>
  );
}
