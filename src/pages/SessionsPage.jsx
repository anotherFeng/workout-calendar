import { useState } from 'react';
import { getCurrentPhase } from '../utils/phaseLogic';
import { useSettings } from '../hooks/useSettings';

const stages = [
  {
    number: 1,
    label: 'Foundation',
    weeks: '1–4',
    goal: 'Re-establish movement patterns, build rowing base, zero injury risk',
    daysPerWeek: 3,
    split: 'Full body each session',
    schedule: 'Mon / Wed / Fri',
    structure: { warmUp: 'Rowing 5 min (18–20 spm, easy)', strength: '3 rounds × 25 min circuit', coolDown: 'Mat stretch 5 min' },
    sessions: [
      {
        id: 'day_a',
        label: 'Day A — Push + Row',
        exercises: [
          { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
          { name: 'Dumbbell Bench Press', detail: '3×10 — Adjustable bench, moderate weight' },
          { name: 'Dumbbell Shoulder Press', detail: '3×10 — Seated on bench' },
          { name: 'Dumbbell Lateral Raise', detail: '3×12 — Light weight, full ROM' },
          { name: 'Push-ups', detail: '3×max — Mat, controlled tempo' },
          { name: 'Rowing finisher', detail: '5 min, 22 spm, moderate' },
        ],
      },
      {
        id: 'day_b',
        label: 'Day B — Pull + Row',
        exercises: [
          { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
          { name: 'Dumbbell Romanian Deadlift', detail: '3×10 — Slow eccentric, feel the hamstring' },
          { name: 'Dumbbell Bent-over Row', detail: '3×10 — Brace core, no swing' },
          { name: 'Dumbbell Bicep Curl', detail: '3×12 — Controlled, no momentum' },
          { name: 'Renegade Row', detail: '3×8 per side — Mat, core stability' },
          { name: 'Rowing finisher', detail: '5 min, 22 spm, moderate' },
        ],
      },
      {
        id: 'day_c',
        label: 'Day C — Legs + Core + Row',
        exercises: [
          { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
          { name: 'Goblet Squat', detail: '3×12 — Single dumbbell, sit into it' },
          { name: 'Bench Step-up', detail: '3×10 per side — Flat bench' },
          { name: 'Leg Press on Bench', detail: '3×12 — Weight attachment' },
          { name: 'Plank', detail: '3×30–45 sec — Mat' },
          { name: 'Dead Bug', detail: '3×10 per side — Core control' },
          { name: 'Rowing finisher', detail: '5 min, 24 spm, push pace' },
        ],
      },
    ],
  },
  {
    number: 2,
    label: 'Build',
    weeks: '5–12',
    goal: 'Increase rowing intensity, progressive overload, add 4th training day',
    daysPerWeek: 4,
    split: 'Push / Pull / Legs / Cardio',
    schedule: 'Mon / Tue / Thu / Sat',
    changes: [
      'Rowing finishers become interval-based (1 min hard / 1 min easy)',
      'Rep ranges drop to 8–10 with heavier weight',
      '4th day added — dedicated rowing/cardio day',
      'Rest periods tighten from 90 sec to 60 sec',
    ],
    sessions: [
      {
        id: 'day_a',
        label: 'Day A — Push Heavy',
        exercises: [
          { name: 'Rowing warm-up', detail: '4 min, build to moderate' },
          { name: 'Incline DB Bench Press', detail: '4×8 — 30–45° angle' },
          { name: 'DB Shoulder Press', detail: '4×8 — Standing, strict form' },
          { name: 'Lateral Raise', detail: '3×15 — Superset with shoulder press' },
          { name: 'Tricep Kickback', detail: '3×12 — Full extension' },
          { name: 'Push-up to failure', detail: '1×max — Burnout set' },
        ],
      },
      {
        id: 'day_b',
        label: 'Day B — Pull Heavy',
        exercises: [
          { name: 'Rowing warm-up', detail: '4 min, build pace' },
          { name: 'DB Romanian Deadlift', detail: '4×8 — Heavier than Stage 1' },
          { name: 'DB Bent-over Row', detail: '4×8 — Stricter form' },
          { name: 'DB Hammer Curl', detail: '3×12 — Neutral grip' },
          { name: 'DB Shrug', detail: '3×15 — Full trap engagement' },
          { name: 'Renegade Row', detail: '3×10 per side — Heavier DB' },
        ],
      },
      {
        id: 'day_c',
        label: 'Day C — Legs Heavy',
        exercises: [
          { name: 'Rowing warm-up', detail: '4 min' },
          { name: 'Goblet Squat', detail: '4×10 — Heavier DB' },
          { name: 'Bulgarian Split Squat', detail: '3×8 per side — Rear foot on bench' },
          { name: 'Bench Leg Press', detail: '4×12 — Add weight plates' },
          { name: 'Romanian Deadlift', detail: '3×10 — Light-moderate, hamstring focus' },
          { name: 'Plank variations', detail: '3×45 sec — Side, standard, RKC' },
        ],
      },
      {
        id: 'day_d',
        label: 'Day D — Rowing Intervals',
        exercises: [
          { name: 'Easy warm-up row', detail: '3 min, 18 spm, easy' },
          { name: 'Interval set', detail: '20 min — 10 rounds: 60s hard (26–28 spm) / 60s easy' },
          { name: 'Cool-down row', detail: '5 min, easy, breath control' },
          { name: 'Mat stretch', detail: '5 min — Hip flexors, hamstrings, thoracic spine' },
        ],
      },
    ],
  },
  {
    number: 3,
    label: 'Intensity',
    weeks: '13+',
    goal: 'Peak fat loss, 5th training day, heavier compound lifts, longer rowing intervals',
    daysPerWeek: 5,
    split: 'Upper / Lower / Push / Pull / Cardio',
    schedule: 'Mon / Tue / Wed / Thu / Fri',
    changes: [
      '5th training day added',
      'Rowing intervals extend to 25–30 min',
      'Supersets introduced throughout',
      'Weight targets approach 50lb/side ceiling',
    ],
    sessions: [
      {
        id: 'day_a',
        label: 'Day A — Upper Compound',
        exercises: [
          { name: 'Heavier DB press combos', detail: 'Compound push/pull supersets' },
          { name: 'Row combos', detail: 'Back-to-back heavy pulling movements' },
        ],
        note: 'Full breakdown built at Week 12 review',
      },
      {
        id: 'day_b',
        label: 'Day B — Lower + Core',
        exercises: [
          { name: 'Heavy goblet squat', detail: 'Progressive overload' },
          { name: 'Split squats', detail: 'High difficulty, high reward' },
          { name: 'Weighted core work', detail: 'Plank variations with added resistance' },
        ],
        note: 'Full breakdown built at Week 12 review',
      },
      {
        id: 'day_c',
        label: 'Day C — Push Circuit',
        exercises: [
          { name: 'Back-to-back push sets', detail: '45 sec rest between supersets' },
        ],
        note: 'Full breakdown built at Week 12 review',
      },
      {
        id: 'day_d',
        label: 'Day D — Pull Circuit',
        exercises: [
          { name: 'Row + curl + shrug supersets', detail: 'High volume, minimal rest' },
        ],
        note: 'Full breakdown built at Week 12 review',
      },
      {
        id: 'day_e',
        label: 'Day E — Rowing Long Intervals',
        exercises: [
          { name: '30 min interval work', detail: '500m repeats with rest intervals' },
        ],
        note: 'Full breakdown built at Week 12 review',
      },
    ],
  },
];

const progressionRules = [
  'Add weight only when all reps are completed with clean form',
  'Track weights every session',
  'Never skip the rowing finisher — it is the primary fat loss driver',
  'If you miss a day, do not double up — resume next scheduled session',
  'Soreness is acceptable, sharp joint pain is not — stop immediately',
];

export default function SessionsPage() {
  const { settings } = useSettings();
  const startDate = settings.startDate || new Date().toISOString().slice(0, 10);
  const phase = getCurrentPhase(startDate);
  const currentStage = phase.workoutStage.number;

  const [openStage, setOpenStage] = useState(currentStage);
  const [openSession, setOpenSession] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Session Types</h2>
      <p className="text-sm text-gray-500">
        Your current stage: <span className="font-semibold text-blue-600">Stage {currentStage} — {phase.workoutStage.label}</span> (Week {phase.weekNumber})
      </p>

      {/* Progression Rules */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-semibold text-amber-800 text-sm mb-2">📋 Progression Rules</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          {progressionRules.map((rule, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amber-400 flex-shrink-0">•</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* Stage Tabs */}
      <div className="flex gap-2">
        {stages.map(s => (
          <button
            key={s.number}
            onClick={() => { setOpenStage(s.number); setOpenSession(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              openStage === s.number
                ? 'bg-blue-500 text-white'
                : s.number === currentStage
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Stage {s.number}
            {s.number === currentStage && openStage !== s.number && ' ←'}
          </button>
        ))}
      </div>

      {/* Active Stage Detail */}
      {stages.filter(s => s.number === openStage).map(stage => (
        <div key={stage.number} className="space-y-4">
          {/* Stage Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-800">Stage {stage.number}: {stage.label}</h3>
              {stage.number === currentStage && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Current</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{stage.goal}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-400 text-xs">Weeks</span>
                <div className="font-medium">{stage.weeks}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Days/Week</span>
                <div className="font-medium">{stage.daysPerWeek}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Split</span>
                <div className="font-medium">{stage.split}</div>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-gray-400 text-xs">Schedule</span>
                <div className="font-medium">{stage.schedule}</div>
              </div>
            </div>

            {stage.structure && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-400 text-xs">Session Structure</span>
                <div className="text-sm text-gray-700 mt-1 space-y-0.5">
                  <div>🚣 Warm-up: {stage.structure.warmUp}</div>
                  <div>💪 Strength: {stage.structure.strength}</div>
                  <div>🧘 Cool-down: {stage.structure.coolDown}</div>
                </div>
              </div>
            )}

            {stage.changes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-400 text-xs">Changes from Previous Stage</span>
                <ul className="text-sm text-gray-700 mt-1 space-y-0.5">
                  {stage.changes.map((c, i) => (
                    <li key={i} className="flex gap-2"><span className="text-blue-400">→</span> {c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Session Cards */}
          <div className="space-y-3">
            {stage.sessions.map(session => {
              const isOpen = openSession === session.id + stage.number;
              return (
                <div key={session.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setOpenSession(isOpen ? null : session.id + stage.number)}
                    className="w-full px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🏋️</span>
                      <span className="font-semibold text-gray-800">{session.label}</span>
                    </div>
                    <span className="text-gray-400 text-lg">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 border-t border-gray-100">
                      {session.note && (
                        <p className="text-sm text-amber-600 italic mt-3 mb-2">⚠️ {session.note}</p>
                      )}
                      <table className="w-full text-sm mt-2">
                        <thead>
                          <tr className="text-left text-gray-400 text-xs">
                            <th className="pb-2 pr-3">#</th>
                            <th className="pb-2 pr-3">Exercise</th>
                            <th className="pb-2">Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {session.exercises.map((ex, i) => (
                            <tr key={i} className="border-t border-gray-50">
                              <td className="py-2 pr-3 text-gray-400 align-top">{i + 1}</td>
                              <td className="py-2 pr-3 font-medium text-gray-800 align-top whitespace-nowrap">{ex.name}</td>
                              <td className="py-2 text-gray-500">{ex.detail}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
