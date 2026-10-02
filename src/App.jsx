import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroWeather from './components/HeroWeather';
import ForecastStrip from './components/ForecastStrip';
import HistoricalIntelligence from './components/HistoricalIntelligence';
import RegionalHubs from './components/RegionalHubs';
import InteractiveMap from './components/InteractiveMap';
import MonthlyCalendar from './components/MonthlyCalendar';
import SearchModal from './components/SearchModal';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';

import { I18N } from './data/i18n';
import {
  fetchLiveForecast,
  fetchHistoricalData,
  reverseGeocode,
  interpretWeatherCode,
  formatTemp
} from './services/weatherApi';

const DEFAULT_STATIONS = [
  { id: 'st1', city: 'Samarqand', country: 'O‘zbekiston', lat: 39.6542, lon: 66.9597, temp: 21 },
  { id: 'st2', city: 'Tokyo', country: 'Yaponiya', lat: 35.6762, lon: 139.6503, temp: 19 },
  { id: 'st3', city: 'London', country: 'Buyuk Britaniya', lat: 51.5074, lon: -0.1278, temp: 15 },
  { id: 'st4', city: 'Dubai', country: 'BAA', lat: 25.2048, lon: 55.2708, temp: 34 }
];

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('weather_lang') || 'uz');
  const [unit, setUnit] = useState(() => localStorage.getItem('weather_unit') || 'C');
  const [windUnit, setWindUnit] = useState(() => localStorage.getItem('wind_unit') || 'kmh');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [currentCity, setCurrentCity] = useState({
    name: 'Toshkent',
    country: 'O‘zbekiston',
    lat: 41.2995,
    lon: 69.2401
  });

  const [liveForecast, setLiveForecast] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [regionalStations, setRegionalStations] = useState(DEFAULT_STATIONS);
  const [bgImage, setBgImage] = useState('/assets/storm-background.jpg');
  const [loading, setLoading] = useState(false);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const t = I18N[lang];

  const showToast = (message, icon = '✨') => {
    setToast({ message, icon });
  };

  // Determine atmospheric background
  const computeBgImage = (weatherCode, tempCelsius, isDay = 1) => {
    if ([95, 96, 99].includes(weatherCode)) {
      return '/assets/storm-background.jpg';
    }
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode) || tempCelsius <= 0) {
      return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920&q=80';
    }
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
      return 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920&q=80';
    }
    if ([45, 48].includes(weatherCode)) {
      return 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1920&q=80';
    }
    if (isDay === 0 || isDay === false) {
      return 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?auto=format&fit=crop&w=1920&q=80';
    }
    if (tempCelsius >= 32) {
      return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80';
    }
    if ([2, 3].includes(weatherCode)) {
      return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80';
    }
    return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920&q=80';
  };

  // Load Main Station Weather
  const loadMainWeather = useCallback(async (cityToLoad = currentCity) => {
    setLoading(true);
    try {
      const forecast = await fetchLiveForecast(cityToLoad.lat, cityToLoad.lon);
      setLiveForecast(forecast);

      if (forecast?.current) {
        const bg = computeBgImage(
          forecast.current.weather_code,
          forecast.current.temperature_2m,
          forecast.current.is_day
        );
        setBgImage(bg);
      }

      // Historical Archive
      const hist = await fetchHistoricalData(cityToLoad.lat, cityToLoad.lon);
      setHistoricalData(hist);
    } catch (err) {
      console.error('Failed to load weather:', err);
      showToast(lang === 'uz' ? 'Ob-havo ma’lumotini yuklashda xatolik yuz berdi' : 'Failed to fetch weather data', '⚠️');
    } finally {
      setLoading(false);
    }
  }, [currentCity, lang]);

  // Load Regional Companion Stations
  const loadRegionalStations = useCallback(async () => {
    try {
      const updated = await Promise.all(
        regionalStations.map(async (st) => {
          try {
            const data = await fetchLiveForecast(st.lat, st.lon);
            const current = data?.current;
            return {
              ...st,
              temp: current?.temperature_2m ?? st.temp,
              weatherInfo: interpretWeatherCode(current?.weather_code ?? 0, lang)
            };
          } catch (e) {
            return st;
          }
        })
      );
      setRegionalStations(updated);
    } catch (e) {
      console.warn('Regional stations update error', e);
    }
  }, [lang]);

  // Initial Load
  useEffect(() => {
    loadMainWeather(currentCity);
    loadRegionalStations();
  }, [currentCity]);

  // Periodic Refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadMainWeather(currentCity);
      loadRegionalStations();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentCity, loadMainWeather, loadRegionalStations]);

  // Auto Geolocation via GPS or IP
  const handleAutoDetectLocation = () => {
    showToast(lang === 'uz' ? 'Geolokatsiya aniqlanmoqda...' : 'Detecting your geolocation...', '🛰️');

    const fallbackIp = async () => {
      try {
        const res = await fetch('https://ipwho.is/');
        const d = await res.json();
        if (d && d.success !== false && d.latitude && d.longitude) {
          const newCity = {
            name: d.city || 'Toshkent',
            country: d.country || 'O‘zbekiston',
            lat: parseFloat(d.latitude),
            lon: parseFloat(d.longitude)
          };
          setCurrentCity(newCity);
          showToast(lang === 'uz' ? `IP orqali ulandi: ${newCity.name}` : `Connected via IP: ${newCity.name}`, '🌐');
          return;
        }
      } catch (e) {}

      try {
        const res2 = await fetch('https://freeipapi.com/api/json');
        const d2 = await res2.json();
        if (d2 && d2.latitude && d2.longitude) {
          const newCity = {
            name: d2.cityName || 'Toshkent',
            country: d2.countryName || 'O‘zbekiston',
            lat: parseFloat(d2.latitude),
            lon: parseFloat(d2.longitude)
          };
          setCurrentCity(newCity);
          showToast(lang === 'uz' ? `IP orqali ulandi: ${newCity.name}` : `Connected via IP: ${newCity.name}`, '🌐');
        }
      } catch (e) {}
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geo = await reverseGeocode(lat, lon, lang);
          const newCity = {
            name: geo.city,
            country: geo.country,
            lat,
            lon
          };
          setCurrentCity(newCity);
          showToast(lang === 'uz' ? `GPS orqali ulandi: ${newCity.name}` : `Connected to GPS: ${newCity.name}`, '📍');
        },
        () => fallbackIp(),
        { timeout: 7000, enableHighAccuracy: false, maximumAge: 300000 }
      );
    } else {
      fallbackIp();
    }
  };

  // State handlers
  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('weather_lang', newLang);
    showToast(newLang === 'uz' ? 'Til: O‘zbekcha' : 'Language: English', '🌐');
  };

  const handleToggleLang = () => {
    handleSetLang(lang === 'uz' ? 'en' : 'uz');
  };

  const handleSetUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('weather_unit', newUnit);
    showToast(`${t.tempUnit}: °${newUnit}`, '🌡️');
  };

  const handleToggleUnit = () => {
    handleSetUnit(unit === 'C' ? 'F' : 'C');
  };

  const handleSetWindUnit = (newWindUnit) => {
    setWindUnit(newWindUnit);
    localStorage.setItem('wind_unit', newWindUnit);
    showToast(`${t.windUnit}: ${newWindUnit}`, '💨');
  };

  const handleSelectCity = (city) => {
    setCurrentCity(city);
    setActiveTab('dashboard');
    showToast(`${city.name} — ${t.setLocSuccess}`, '🎯');
  };

  // Swap companion station with current station
  const handleSelectCompanion = (station) => {
    const oldCity = { ...currentCity };
    setCurrentCity({
      name: station.city,
      country: station.country,
      lat: station.lat,
      lon: station.lon
    });
    setRegionalStations((prev) =>
      prev.map((s) =>
        s.id === station.id
          ? { ...s, city: oldCity.name, country: oldCity.country, lat: oldCity.lat, lon: oldCity.lon }
          : s
      )
    );
    showToast(`${station.city} stansiyasiga o‘tildi`, '📍');
  };

  const handleRefreshAll = () => {
    loadMainWeather(currentCity);
    loadRegionalStations();
    showToast(t.weatherRefreshed, '✨');
  };

  const appState = {
    lang,
    unit,
    windUnit,
    activeTab
  };

  return (
    <div className="app-shell">
      {/* Dynamic Atmospheric Background */}
      <div className="app-atmosphere">
        <div
          className="atmosphere-image"
          style={{ backgroundImage: `url("${bgImage}")` }}
        />
        <div className="atmosphere-gradient" />
      </div>

      {/* Top Navbar */}
      <Navbar
        state={appState}
        t={t}
        onSwitchTab={setActiveTab}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onToggleLang={handleToggleLang}
        onToggleUnit={handleToggleUnit}
        onAutoDetect={handleAutoDetectLocation}
        onRefresh={handleRefreshAll}
        loading={loading}
      />

      {/* Main View Container */}
      <main className="app-container">
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            {/* Left Main Column */}
            <div>
              <HeroWeather
                weather={liveForecast}
                city={currentCity}
                state={appState}
                t={t}
              />

              <ForecastStrip
                weather={liveForecast}
                state={appState}
                t={t}
                onSelectForecastItem={(item) => {
                  showToast(`${item.label}: ${item.info.title} (${formatTemp(item.minTemp, unit)} – ${formatTemp(item.maxTemp, unit)})`, '🌤️');
                }}
              />

              <HistoricalIntelligence
                historical={historicalData}
                currentTemp={liveForecast?.current?.temperature_2m}
                state={appState}
                t={t}
              />
            </div>

            {/* Right Rail Column */}
            <div>
              <RegionalHubs
                cards={regionalStations}
                onSelectStation={handleSelectCompanion}
                state={appState}
                t={t}
              />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            currentCity={currentCity}
            onSelectLocation={handleSelectCity}
            state={appState}
            t={t}
          />
        )}

        {activeTab === 'calendar' && (
          <MonthlyCalendar
            baseTemp={liveForecast?.current?.temperature_2m || 20}
            state={appState}
            t={t}
            onSelectDay={(cell, dateLabel) => {
              showToast(`${dateLabel}: ${formatTemp(cell.stableTemp, unit)} (${formatTemp(cell.minT, unit)} – ${formatTemp(cell.maxT, unit)})`, '📅');
            }}
          />
        )}
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectCity={handleSelectCity}
        state={appState}
        t={t}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        state={appState}
        t={t}
        onSetLang={handleSetLang}
        onSetUnit={handleSetUnit}
        onSetWindUnit={handleSetWindUnit}
        onTriggerGps={handleAutoDetectLocation}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
