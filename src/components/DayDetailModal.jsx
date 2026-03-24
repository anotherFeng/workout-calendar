import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db';
import { useDailyLog } from '../hooks/useDailyLog';
import { useSettings } from '../hooks/useSettings';
import { getCurrentPhase, getSessionOptions } from '../utils/phaseLogic';
import StarRating from './StarRating';
import VitaminChecklist from './VitaminChecklist';

export default function DayDetailModal({ date, onClose }) {
  const { log, vitaminChecks, loading, saveLog, toggleVitamin } = useDailyLog(date);
  const { settings } = useSettings();
  const vitamins = useLiveQuery(() => db.vitamins.where('active').equals(1).sortBy('sortOrder'), []);
  const [weight, setWeight] = useState('');
  const [saved, setSaved] = useState(false);

  const stageOverride = settings.stageOverride || null;
  const phaseInfo = settings.startDate ? getCurrentPhase(settings.startDate) : null;
  const activeStage = stageOverride || (phaseInfo ? phaseInfo.workoutStage.number : null);
  const sessionOptions = activeStage ? getSessionOptions(activeStage) : [
    { group: null, options: ['Day A — Push', 'Day B — Pull', 'Day C — Legs', 'Day D — Cardio', 'Rest Day'] }
  ];

  // Load weight for this date
  useEffect(() => {
    db.weightLogs.get(date).then(w => {
      if (w) setWeight(String(w.weightLbs));
    });
  }, [date]);

  if (loading || !vitamins) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-2xl p-6">Loading...</div>
      </div>
    );
  }

  const dayLabel = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  async function handleWeightChange(val) {
    setWeight(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      await db.weightLogs.put({ date, weightLbs: num });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="font-bold text-lg text-gray-800">{dayLabel}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer">×</button>
        </div>

        <div className="p-5 space-y-6">
          {/* Workout Section */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">💪</span> Workout
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Rating</label>
                <StarRating
                  value={log.workoutRating || 0}
                  onChange={(val) => saveLog({ workoutRating: val || null })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Session Type</label>
                <select
                  value={log.workoutSessionType || ''}
                  onChange={(e) => saveLog({ workoutSessionType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select session...</option>
                  {sessionOptions.map((group, gi) =>
                    group.group ? (
                      <optgroup key={gi} label={group.group}>
                        {group.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </optgroup>
                    ) : (
                      group.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))
                    )
                  )}
                </select>
              </div>
            </div>
          </section>

          {/* Meal/Calorie Section */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">🍽️</span> Meal / Calorie Target
            </h4>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Rating</label>
              <StarRating
                value={log.mealRating || 0}
                onChange={(val) => saveLog({ mealRating: val || null })}
              />
              <p className="text-xs text-gray-400 mt-1">Rate how well you hit your calorie/fasting target today</p>
            </div>
          </section>

          {/* Vitamins Section */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">💊</span> Vitamins & Supplements
            </h4>
            <VitaminChecklist
              vitamins={vitamins}
              vitaminChecks={vitaminChecks}
              onToggle={toggleVitamin}
            />
          </section>

          {/* Weight */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">⚖️</span> Weight (optional)
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder="e.g. 168.5"
                className="border border-gray-300 rounded-lg px-3 py-2 w-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <span className="text-sm text-gray-500">lbs</span>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-lg">📝</span> Notes
            </h4>
            <textarea
              value={log.notes || ''}
              onChange={(e) => saveLog({ notes: e.target.value })}
              placeholder="How did today go?"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </section>

          {/* Save Button */}
          <div className="pt-2 pb-1">
            <button
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
              }`}
            >
              {saved ? '✓ Saved' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
