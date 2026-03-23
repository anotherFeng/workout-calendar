import { getMonthDays, isToday, getMonthLabel } from '../utils/dateHelpers';

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Calendar({ year, month, onPrev, onNext, onDayClick, getDayStatus }) {
  const days = getMonthDays(year, month);
  const label = getMonthLabel(year, month);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrev}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 text-xl font-bold cursor-pointer"
        >
          ‹
        </button>
        <h2 className="text-xl font-bold text-gray-800">{label}</h2>
        <button
          onClick={onNext}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 text-xl font-bold cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DOW_LABELS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, inMonth }) => {
          const today = isToday(date);
          const status = getDayStatus(date);
          const dayNum = new Date(date).getDate();

          return (
            <button
              key={date}
              onClick={() => onDayClick(date)}
              className={`
                relative p-1 sm:p-2 rounded-lg border transition-all cursor-pointer min-h-[60px] sm:min-h-[80px]
                flex flex-col items-center
                ${!inMonth ? 'opacity-30 bg-gray-50' : 'bg-white hover:bg-blue-50'}
                ${today ? 'border-blue-500 border-2 ring-1 ring-blue-200' : 'border-gray-200'}
                ${status.hasData ? 'shadow-sm' : ''}
              `}
            >
              <span className={`text-sm font-medium ${today ? 'text-blue-600' : inMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                {dayNum}
              </span>

              {/* 3 check indicators */}
              <div className="flex gap-1 mt-auto">
                <CheckDot value={status.workout} max={5} title="Workout" color="green" />
                <CheckDot value={status.meal} max={5} title="Meal" color="blue" />
                <CheckDot value={status.vitamins} max={1} title="Vitamins" color="purple" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Workout (✓=5★)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Meal (✓=5★)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Vitamins (✓=all)</span>
      </div>
    </div>
  );
}

function CheckDot({ value, max, title, color }) {
  if (value <= 0) {
    return (
      <span
        title={title}
        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-200 transition-colors"
      />
    );
  }

  const ratio = Math.min(value / max, 1);
  const isFull = ratio >= 1;

  const colorMap = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  if (isFull) {
    return (
      <span
        title={`${title} ✓`}
        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${colorMap[color]} flex items-center justify-center`}
      >
        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  // Partial: colored circle with opacity based on progress (0.25 to 0.85)
  const opacity = 0.25 + ratio * 0.6;

  return (
    <span
      title={`${title}: ${max <= 1 ? Math.round(ratio * 100) + '%' : value + '/' + max}`}
      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${colorMap[color]} transition-colors`}
      style={{ opacity }}
    />
  );
}
