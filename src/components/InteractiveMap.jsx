import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { formatTemp, getTempColor, reverseGeocode, interpretWeatherCode } from '../services/weatherApi';
import { Map, MapPin } from 'lucide-react';

const GLOBAL_HUBS = [
  { name: 'Toshkent', country: 'O‘zbekiston', lat: 41.2995, lon: 69.2401, temp: 22 },
  { name: 'Samarqand', country: 'O‘zbekiston', lat: 39.6542, lon: 66.9597, temp: 21 },
  { name: 'Buxoro', country: 'O‘zbekiston', lat: 39.7747, lon: 64.4286, temp: 23 },
  { name: 'Andijon', country: 'O‘zbekiston', lat: 40.7821, lon: 72.3442, temp: 20 },
  { name: 'Namangan', country: 'O‘zbekiston', lat: 40.9983, lon: 71.6726, temp: 21 },
  { name: 'London', country: 'Buyuk Britaniya', lat: 51.5074, lon: -0.1278, temp: 15 },
  { name: 'Tokyo', country: 'Yaponiya', lat: 35.6762, lon: 139.6503, temp: 19 },
  { name: 'Dubai', country: 'BAA', lat: 25.2048, lon: 55.2708, temp: 34 },
  { name: 'New York', country: 'AQSH', lat: 40.7128, lon: -74.0060, temp: 18 },
  { name: 'Istanbul', country: 'Turkiya', lat: 41.0082, lon: 28.9784, temp: 21 },
  { name: 'Paris', country: 'Fransiya', lat: 48.8566, lon: 2.3522, temp: 17 }
];

export default function InteractiveMap({ currentCity, onSelectLocation, state, t }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCity.lat, currentCity.lon],
        zoom: 4,
        minZoom: 2,
        maxZoom: 15,
        zoomControl: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add Hub markers
      GLOBAL_HUBS.forEach((hub) => {
        const color = getTempColor(hub.temp);
        const iconHtml = `
          <div style="
            background: ${color};
            color: #fff;
            padding: 3px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.4);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>${hub.name}</span>
            <span>${formatTemp(hub.temp, state.unit)}</span>
          </div>
        `;

        const icon = L.divIcon({
          className: 'leaflet-temp-pin',
          html: iconHtml,
          iconSize: [80, 24],
          iconAnchor: [40, 12]
        });

        const marker = L.marker([hub.lat, hub.lon], { icon }).addTo(map);
        marker.on('click', () => {
          onSelectLocation({
            name: hub.name,
            country: hub.country,
            lat: hub.lat,
            lon: hub.lon
          });
        });
      });

      // Click anywhere to query temperature and reverse geocode
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        const popup = L.popup()
          .setLatLng(e.latlng)
          .setContent(`<div style="padding:6px; color:#fff; font-size:12px;">${t.fetchingMapWeather}</div>`)
          .openOn(map);

        try {
          const [weatherRes, geoInfo] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,weather_code&timezone=auto`).then(r => r.json()),
            reverseGeocode(lat, lng, state.lang)
          ]);

          const temp = weatherRes?.current?.temperature_2m ?? 20;
          const info = interpretWeatherCode(weatherRes?.current?.weather_code ?? 0, state.lang);
          const color = getTempColor(temp);

          const content = document.createElement('div');
          content.style.fontFamily = "'Inter', sans-serif";
          content.style.padding = '8px 6px';
          content.style.color = '#fff';
          content.innerHTML = `
            <div style="font-weight:700; font-size:15px; color:${color}; margin-bottom:4px;">
              ${formatTemp(temp, state.unit)} — ${info.title}
            </div>
            <div style="font-size:13px; font-weight:600; color:#fff;">
              ${geoInfo.city}${geoInfo.country ? ', ' + geoInfo.country : ''}
            </div>
            <div style="font-size:11px; opacity:0.75; margin-top:2px;">
              ${lat.toFixed(2)}°, ${lng.toFixed(2)}°
            </div>
          `;

          const btn = document.createElement('button');
          btn.style.marginTop = '10px';
          btn.style.width = '100%';
          btn.style.background = color;
          btn.style.color = '#fff';
          btn.style.border = 'none';
          btn.style.padding = '6px 10px';
          btn.style.borderRadius = '8px';
          btn.style.fontWeight = '600';
          btn.style.cursor = 'pointer';
          btn.style.fontSize = '12px';
          btn.textContent = t.setAsStation;
          btn.onclick = () => {
            onSelectLocation({
              name: geoInfo.city,
              country: geoInfo.country,
              lat,
              lon: lng
            });
            map.closePopup();
          };

          content.appendChild(btn);
          popup.setContent(content);
        } catch (err) {
          popup.setContent(`<div style="padding:6px; color:#fca5a5;">${t.mapPointError}</div>`);
        }
      });

      mapInstanceRef.current = map;
    }

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      // Keep map instance or cleanup
    };
  }, [state.lang, state.unit]);

  return (
    <div className="glass-panel full-view-panel">
      <div className="section-title">
        <Map size={24} color="#38bdf8" />
        <span>{t.mapTitle}</span>
      </div>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
        {t.mapSubtext}
      </p>

      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
}
