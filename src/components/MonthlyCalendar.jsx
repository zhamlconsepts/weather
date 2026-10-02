import React, { useState } from 'react';
import { formatTemp, getTempColor } from '../services/weatherApi';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MonthlyCalendar({ baseTemp = 20, state, t, onSelectDay }) {
  const [monthOffset, setMonthOffset] = useState(0);

  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth = monthOffset === 0;
  const todayDate = now.getDate();

  // Calendar cells
  const cells = [];
  // Empty start padding
  for (let p = 0; p < firstDay; p++) {
    cells.push({ id: `empty-${p}`, isEmpty: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === todayDate;
    const dayVar = Math.sin(day * 0.7) * 2.5;
    const stableTemp = Math.round(baseTemp + (monthOffset * 2) + dayVar);
    const minT = stableTemp - 4;
    const maxT = stableTemp + 4;
    const color = getTempColor(stableTemp);

    cells.push({
      id: `day-${day}`,
      day,
      isToday,
      stableTemp,
      minT,
      maxT,
      color
    });
  }

  return (
    <div className="glass-panel full-view-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-title">
            <CalendarIcon size={24} color="#38bdf8" />
            <span>{t.months[month]} {year} — {t.calTitle}</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {t.calSubtext}
          </p>
        </div>

        {/* Month Prev / Next Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="icon-button"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            title="Oldingi oy"
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', minWidth: '120px', textAlign: 'center' }}>
            {t.months[month]} {year}
          </span>
          <button
            className="icon-button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            title="Keyingi oy"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day Headers */}
        {t.daysShort.map((dayName, idx) => (
          <div key={idx} className="calendar-day-header">
            {dayName}
          </div>
        ))}

        {/* Month Days */}
        {cells.map((cell) => {
          if (cell.isEmpty) {
            return <div key={cell.id} style={{ opacity: 0.1 }} />;
          }

          return (
            <div
              key={cell.id}
              className={`calendar-cell ${cell.isToday ? 'today' : ''}`}
              onClick={() => onSelectDay && onSelectDay(cell, `${cell.day} ${t.months[month]} ${year}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: cell.isToday ? 800 : 600, fontSize: '0.95rem' }}>
                  {cell.day}
                </span>
                <span style={{ color: cell.color, fontSize: '10px' }}>●</span>
              </div>

              <div>
                <div style={{ color: cell.color, fontWeight: 700, fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                  {formatTemp(cell.stableTemp, state.unit)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {formatTemp(cell.minT, state.unit)} – {formatTemp(cell.maxT, state.unit)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
