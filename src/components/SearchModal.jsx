import React, { useState, useEffect, useRef } from 'react';
import { searchCities } from '../services/weatherApi';
import { Search, X, MapPin, ArrowRight } from 'lucide-react';

const POPULAR_HUBS = [
  { name: 'Toshkent', country: 'O‘zbekiston', lat: 41.2995, lon: 69.2401, flag: '🇺🇿' },
  { name: 'Samarqand', country: 'O‘zbekiston', lat: 39.6542, lon: 66.9597, flag: '🇺🇿' },
  { name: 'Buxoro', country: 'O‘zbekiston', lat: 39.7747, lon: 64.4286, flag: '🇺🇿' },
  { name: 'Andijon', country: 'O‘zbekiston', lat: 40.7821, lon: 72.3442, flag: '🇺🇿' },
  { name: 'Namangan', country: 'O‘zbekiston', lat: 40.9983, lon: 71.6726, flag: '🇺🇿' },
  { name: 'Farg‘ona', country: 'O‘zbekiston', lat: 40.3842, lon: 71.7843, flag: '🇺🇿' },
  { name: 'London', country: 'Buyuk Britaniya', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
  { name: 'Tokyo', country: 'Yaponiya', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
  { name: 'Dubai', country: 'BAA', lat: 25.2048, lon: 55.2708, flag: '🇦🇪' },
  { name: 'New York', country: 'AQSH', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
  { name: 'Istanbul', country: 'Turkiya', lat: 41.0082, lon: 28.9784, flag: '🇹🇷' }
];

export default function SearchModal({ isOpen, onClose, onSelectCity, state, t }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await searchCities(query, state.lang);
        setResults(res);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timeout);
  }, [query, state.lang]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && results.length > 0) {
      const first = results[0];
      onSelectCity({
        name: first.name,
        country: first.country || '',
        lat: first.latitude,
        lon: first.longitude
      });
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-title">
            <Search size={22} color="#38bdf8" />
            <span>{t.searchTitle}</span>
          </div>
          <button className="icon-button" onClick={onClose} title="Yopish">
            <X size={18} />
          </button>
        </div>

        {/* Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
          />
        </div>

        {/* Results List */}
        {loading && (
          <div style={{ padding: '0.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {t.searching}
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div style={{ padding: '0.75rem', fontSize: '0.88rem', color: 'var(--text-dim)' }}>
            {t.noCities}
          </div>
        )}

        {results.length > 0 && (
          <div className="search-results-list">
            {results.map((item, idx) => (
              <div
                key={idx}
                className="search-item"
                onClick={() => {
                  onSelectCity({
                    name: item.name,
                    country: item.country || '',
                    lat: item.latitude,
                    lon: item.longitude
                  });
                  onClose();
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {item.admin1 ? `${item.admin1}, ` : ''}{item.country || ''}
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
                  {t.selectCityAction}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Popular Hubs */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.popularHubs}
          </div>
          <div className="quick-chips-grid">
            {POPULAR_HUBS.map((hub, idx) => (
              <button
                key={idx}
                className="quick-chip"
                onClick={() => {
                  onSelectCity(hub);
                  onClose();
                }}
              >
                <span>{hub.flag}</span>
                <span>{hub.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
