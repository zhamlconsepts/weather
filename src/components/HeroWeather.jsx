import React from 'react';
import WeatherIcon from './WeatherIcon';
import {
  formatTemp,
  formatWind,
  getCompassDirection,
  interpretWeatherCode
} from '../services/weatherApi';
import {
  Thermometer,
  CloudRain,
  Gauge,
  Wind,
  Droplets,
  SunMedium,
  Compass,
  MapPin,
  Clock
} from 'lucide-react';

export default function HeroWeather({ weather, city, state, t }) {
  if (!weather || !weather.current) {
    return (
      <div className="glass-panel hero-weather-card">
        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>
          {t.syncingTelemetry}
        </div>
      </div>
    );
  }

  const current = weather.current;
  const weatherInfo = interpretWeatherCode(current.weather_code, state.lang);
  const windDir = getCompassDirection(current.wind_direction_10m, t.compass);
  const rainChance = (weather.daily && weather.daily.precipitation_probability_max && weather.daily.precipitation_probability_max[0] !== undefined)
    ? weather.daily.precipitation_probability_max[0]
    : (current.precipitation > 0 ? 60 : 0);

  const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="glass-panel hero-weather-card">
      {/* Top Header Row */}
      <div className="hero-header-row">
        <div>
          <span className="glass-pill" style={{ marginBottom: '0.85rem' }}>
            <span className="live-pulse" />
            {t.heroChip}
          </span>
          <h1 className="location-title">
            <MapPin size={28} color="#38bdf8" />
            {city.name}{city.country ? `, ${city.country}` : ''}
          </h1>
          <div className="location-subtext">
            <span>GPS: {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°</span>
            <span>•</span>
            <Clock size={14} />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="glass-pill" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.35)' }}>
            {weatherInfo.title}
          </span>
        </div>
      </div>

      {/* Main Temperature and Icon Block */}
      <div className="hero-temp-block">
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span className="hero-temp-number">{formatTemp(current.temperature_2m, state.unit).replace('°', '')}</span>
          <span className="hero-temp-unit">°{state.unit}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <WeatherIcon type={weatherInfo.type} size={64} />
          <div className="hero-condition-col">
            <span className="hero-condition-badge">{weatherInfo.title}</span>
            <p className="hero-condition-desc">{weatherInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="telemetry-grid">
        {/* Feels Like */}
        <div className="telemetry-metric">
          <div className="telemetry-metric-header">
            <Thermometer size={14} color="#f97316" />
            <span>{t.feelsLike}</span>
          </div>
          <div className="telemetry-metric-value">
            {formatTemp(current.apparent_temperature, state.unit)}
          </div>
        </div>

        {/* Rain Chance */}
        <div className="telemetry-metric">
          <div className="telemetry-metric-header">
            <CloudRain size={14} color="#38bdf8" />
            <span>{t.rainChance}</span>
          </div>
          <div className="telemetry-metric-value">
            {rainChance}%
          </div>
        </div>

        {/* Pressure */}
        <div className="telemetry-metric">
          <div className="telemetry-metric-header">
            <Gauge size={14} color="#a855f7" />
            <span>{t.pressure}</span>
          </div>
          <div className="telemetry-metric-value">
            {Math.round(current.surface_pressure || 1013)} hPa
          </div>
        </div>

        {/* Wind */}
        <div className="telemetry-metric">
          <div className="telemetry-metric-header">
            <Wind size={14} color="#10b981" />
            <span>{t.wind}</span>
          </div>
          <div className="telemetry-metric-value" style={{ fontSize: '1.15rem' }}>
            {formatWind(current.wind_speed_10m, state.windUnit)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {windDir} ({Math.round(current.wind_direction_10m || 0)}°)
          </span>
        </div>

        {/* Humidity */}
        <div className="telemetry-metric">
          <div className="telemetry-metric-header">
            <Droplets size={14} color="#06b6d4" />
            <span>{t.humidity}</span>
          </div>
          <div className="telemetry-metric-value">
            {current.relative_humidity_2m}%
          </div>
        </div>

        {/* Wind Gusts */}
        <div className="telemetry-metric">
          <div className="telemetry-metric-header">
            <Compass size={14} color="#ec4899" />
            <span>{t.gusts}</span>
          </div>
          <div className="telemetry-metric-value" style={{ fontSize: '1.15rem' }}>
            {formatWind(current.wind_gusts_10m, state.windUnit)}
          </div>
        </div>

        {/* UV Index */}
        <div className="telemetry-metric">
          <div className="telemetry-metric-header">
            <SunMedium size={14} color="#eab308" />
            <span>{t.uvIndex}</span>
          </div>
          <div className="telemetry-metric-value">
            {current.uv_index !== undefined ? current.uv_index.toFixed(1) : '2.4'}
          </div>
        </div>
      </div>
    </div>
  );
}
