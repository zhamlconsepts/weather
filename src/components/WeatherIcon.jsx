import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind
} from 'lucide-react';

export default function WeatherIcon({ type, size = 32, className = '' }) {
  switch (type) {
    case 'clear':
      return <Sun size={size} className={`text-amber-400 ${className}`} color="#facc15" />;
    case 'partly-cloudy':
      return <CloudSun size={size} className={`text-amber-300 ${className}`} color="#fde047" />;
    case 'cloudy':
      return <Cloud size={size} className={`text-slate-300 ${className}`} color="#cbd5e1" />;
    case 'fog':
      return <CloudFog size={size} className={`text-slate-400 ${className}`} color="#94a3b8" />;
    case 'rain':
      return <CloudRain size={size} className={`text-cyan-400 ${className}`} color="#38bdf8" />;
    case 'snow':
      return <CloudSnow size={size} className={`text-sky-200 ${className}`} color="#bae6fd" />;
    case 'thunderstorm':
      return <CloudLightning size={size} className={`text-purple-400 ${className}`} color="#c084fc" />;
    default:
      return <Sun size={size} className={`text-amber-400 ${className}`} color="#facc15" />;
  }
}
