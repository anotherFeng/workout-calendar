import { useState } from 'react';
import { useMonthLogs } from '../hooks/useDailyLog';
import { useSettings } from '../hooks/useSettings';
import { getCurrentPhase } from '../utils/phaseLogic';
import Calendar from '../components/Calendar';
import DayDetailModal from '../components/DayDetailModal';

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const { getDayStatus } = useMonthLogs(year, month);
  const { settings } = useSettings();

  const phaseInfo = settings.startDate ? getCurrentPhase(settings.startDate) : null;
  const stageOverride = settings.stageOverride || null;
  const activeStageNumber = stageOverride || (phaseInfo ? phaseInfo.workoutStage.number : null);
  const stageLabels = { 1: 'Foundation', 2: 'Build', 3: 'Intensity' };

  const handlePrev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const handleNext = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  // Refresh month logs when modal closes (date changes might have updated data)
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-4 sm:p-6">
      {/* Phase indicator */}
      {phaseInfo && (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            Phase {phaseInfo.nutritionPhase.number}: {phaseInfo.nutritionPhase.label}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            Stage {activeStageNumber}: {stageLabels[activeStageNumber] || phaseInfo.workoutStage.label}
            {stageOverride ? ' (override)' : ''}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            Week {phaseInfo.weekNumber}
          </span>
        </div>
      )}

      <Calendar
        key={refreshKey}
        year={year}
        month={month}
        onPrev={handlePrev}
        onNext={handleNext}
        onDayClick={setSelectedDate}
        getDayStatus={getDayStatus}
      />

      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setRefreshKey(k => k + 1);
          }}
        />
      )}
    </div>
  );
}
