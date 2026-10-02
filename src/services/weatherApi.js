// Weather Codes to icons & descriptions
export function interpretWeatherCode(code, lang = 'uz') {
  const isUz = lang === 'uz';
  switch (code) {
    case 0:
      return {
        title: isUz ? 'Musaffo osmon' : 'Clear Sky',
        type: 'clear',
        desc: isUz ? 'Ochiq va quyoshli ob-havo, atmosferada yuqori tiniqlik kuzatilmoqda.' : 'Sunny and clear conditions with crisp atmospheric clarity.'
      };
    case 1:
    case 2:
      return {
        title: isUz ? 'Qisman bulutli' : 'Partly Cloudy',
        type: 'partly-cloudy',
        desc: isUz ? 'Asosan ochiq, osmonda tarqoq mayin bulutlar mavjud.' : 'Mainly clear with subtle scattered cloud cover.'
      };
    case 3:
      return {
        title: isUz ? 'Bulutli osmon' : 'Overcast',
        type: 'cloudy',
        desc: isUz ? 'Osmonni qoplagan quyuq bulutlar va yoqimli mayin havo.' : 'Full cloud cover with gentle ambient breeze.'
      };
    case 45:
    case 48:
      return {
        title: isUz ? 'Tumanli havo' : 'Foggy',
        type: 'fog',
        desc: isUz ? 'Qalin tuman va ko‘rish masofasining cheklanganligi kuzatilmoqda.' : 'Dense fog layer with restricted horizon visibility.'
      };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        title: isUz ? 'Mayda yomg‘ir (Shivalama)' : 'Light Drizzle',
        type: 'rain',
        desc: isUz ? 'Mayin shivalama yomg‘ir va yuqori nisbiy namlik darajasi.' : 'Gentle drizzle showers with elevated atmospheric humidity.'
      };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return {
        title: isUz ? 'O‘rtacha yomg‘ir' : 'Moderate Rain',
        type: 'rain',
        desc: isUz ? 'Bir tekis davom etuvchi yomg‘ir yog‘ishi qayd etilmoqda.' : 'Steady rain showers with sustained precipitation.'
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        title: isUz ? 'Qor yog‘ishi' : 'Snowfall',
        type: 'snow',
        desc: isUz ? 'Mayin qor zarralari yog‘ishi va sovuq havo oqimi.' : 'Crisp snow flurries and cool atmospheric currents.'
      };
    case 80:
    case 81:
    case 82:
      return {
        title: isUz ? 'Kuchli jala' : 'Heavy Rain',
        type: 'rain',
        desc: isUz ? 'Kuchli yog‘ingarchilik va tezkor shamol shiddatlari.' : 'Intense rain showers with gusty wind vectors.'
      };
    case 85:
    case 86:
      return {
        title: isUz ? 'Kuchli qor bo‘roni' : 'Heavy Snowstorm',
        type: 'snow',
        desc: isUz ? 'Kuchli qor bo‘roni va haroratning pasayishi.' : 'Heavy snowfall with reduced surface visibility.'
      };
    case 95:
    case 96:
    case 99:
    default:
      return {
        title: isUz ? 'Momaqaldiroqli bo‘ron' : 'Thunderstorm',
        type: 'thunderstorm',
        desc: isUz ? 'Momaqaldiroq, chaqmoq chaqishi va kuchli atmosfera faolligi.' : 'Thunderstorm activity with lightning and dynamic barometric drops.'
      };
  }
}

export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--°';
  if (unit === 'F') {
    return `${Math.round((celsius * 9) / 5 + 32)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatWind(kmh, windUnit = 'kmh') {
  if (kmh === null || kmh === undefined || isNaN(kmh)) {
    return windUnit === 'mph' ? '-- mph' : '-- km/h';
  }
  if (windUnit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getCompassDirection(degrees, compassList) {
  if (!compassList || compassList.length < 8) return '';
  if (degrees === undefined || degrees === null) return compassList[0];
  const index = Math.round((degrees % 360) / 45) % 8;
  return compassList[index];
}

export function getTempColor(celsius) {
  if (celsius <= 0) return '#38bdf8'; // Arctic
  if (celsius <= 10) return '#2dd4bf'; // Cold
  if (celsius <= 20) return '#a3e635'; // Mild
  if (celsius <= 30) return '#fb923c'; // Warm
  return '#ef4444'; // Hot
}

// Reverse geocode with api-bdc.io and fallback
export async function reverseGeocode(lat, lon, lang = 'uz') {
  try {
    const res = await fetch(`https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`);
    const d = await res.json();
    const city = d.city || d.locality || d.principalSubdivision || 'Custom Station';
    const country = d.countryName || '';
    return { city, country };
  } catch (e) {
    try {
      const res2 = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`);
      const d2 = await res2.json();
      const city = d2.city || d2.locality || d2.principalSubdivision || 'Custom Station';
      const country = d2.countryName || '';
      return { city, country };
    } catch (err2) {
      return { city: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`, country: '' };
    }
  }
}

// Fetch comprehensive forecast telemetry
export async function fetchLiveForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,uv_index,is_day&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_probability_max&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast fetch error');
  return await res.json();
}

// Fetch historical statistics (Yesterday, 1 Week Ago, 1 Month Ago)
export async function fetchHistoricalData(lat, lon) {
  try {
    const now = new Date();
    const fmtDate = (d) => d.toISOString().split('T')[0];
    const dYesterday = new Date(now); dYesterday.setDate(now.getDate() - 1);
    const dMonthAgo = new Date(now); dMonthAgo.setDate(now.getDate() - 30);

    const histUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${fmtDate(dMonthAgo)}&end_date=${fmtDate(dYesterday)}&daily=temperature_2m_mean&timezone=auto`;
    const res = await fetch(histUrl);
    const data = await res.json();

    if (data && data.daily && Array.isArray(data.daily.temperature_2m_mean)) {
      const valid = data.daily.temperature_2m_mean.filter(v => v !== null && v !== undefined && !isNaN(v));
      if (valid.length > 0) {
        return {
          yesterday: valid[valid.length - 1],
          lastWeek: valid[Math.max(0, valid.length - 7)],
          lastMonth: valid[0]
        };
      }
    }
    return null;
  } catch (e) {
    console.warn('Historical archive fallback:', e);
    return null;
  }
}

// City Search Autocomplete via Open-Meteo Geocoding
export async function searchCities(query, lang = 'uz') {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=${lang}&format=json`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}
