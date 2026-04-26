import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  // 0=Sun, convert to Mon-based
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const MiniCalendar = ({ highlightedDates = [], todayHighlights = [] }) => {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDayOfMonth(current.year, current.month);

  const prev = () => {
    setCurrent(c => {
      const m = c.month - 1;
      return m < 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: m };
    });
  };

  const next = () => {
    setCurrent(c => {
      const m = c.month + 1;
      return m > 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: m };
    });
  };

  const isToday = (day) =>
    day === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  const isHighlighted = (day) => highlightedDates.includes(day);

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">
          {MONTHS[current.month]} {current.year}
        </span>
        <div className="flex gap-1">
          <button onClick={prev} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-xs text-gray-400 font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => (
          <div key={idx} className="flex items-center justify-center">
            {day ? (
              <button
                className={`
                  w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center
                  transition-colors relative
                  ${isToday(day)
                    ? 'bg-indigo-600 text-white font-bold'
                    : isHighlighted(day)
                    ? 'text-indigo-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {day}
                {isHighlighted(day) && !isToday(day) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
                )}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Today's highlights */}
      {todayHighlights.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">
            Today's Highlights
          </p>
          <div className="flex flex-col gap-2">
            {todayHighlights.map((item, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-0.5 bg-indigo-500 rounded-full flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-700">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.time} • {item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCalendar;
