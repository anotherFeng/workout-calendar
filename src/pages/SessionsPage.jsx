import { useState } from 'react';
import { getCurrentPhase } from '../utils/phaseLogic';
import { useSettings } from '../hooks/useSettings';

const stages = [
  {
    number: 1,
    label: 'Foundation',
    weeks: '1–4',
    goal: 'Re-establish movement patterns, build rowing base, zero injury risk',
    daysPerWeek: 4,
    split: 'Push / Pull / Legs / Core+Mobility',
    schedule: 'Mon / Tue / Thu / Fri',
    restProtocol: {
      dayAB: { betweenSets: '60–90s', betweenExercises: '45–60s', beforeFinisher: '60s' },
      dayC: { betweenSets: '75–90s', betweenExercises: '60s', beforeFinisher: '90s' },
      dayD: { betweenSets: '45–60s', betweenExercises: '30s', beforeFinisher: '45s' },
    },
    sessions: [
      {
        id: 'day_a',
        label: 'Day A — Push + Row',
        focus: 'Chest, shoulders, triceps',
        variants: [
          {
            id: 'primary',
            label: 'Primary (Default)',
            estimatedMin: '38–42',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'Dumbbell Bench Press', detail: '3×10 — Adjustable bench flat, moderate weight. Rest 75s between sets' },
              { name: 'Dumbbell Shoulder Press', detail: '3×10 — Seated on bench. Rest 75s between sets' },
              { name: 'Dumbbell Lateral Raise', detail: '3×12 — Light weight, full ROM. Rest 60s between sets' },
              { name: 'Push-ups', detail: '3×max — Mat, controlled tempo. Rest 75–90s between sets' },
              { name: 'Rowing finisher', detail: '5 min, 22 spm, moderate' },
            ],
          },
          {
            id: 'variant_1',
            label: 'Variant A1 — Incline Focus',
            notes: 'Shifts emphasis to upper chest and front deltoids. Good rotation when flat press feels stale.',
            estimatedMin: '38–42',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'Incline DB Bench Press', detail: '3×10 — Bench at 30–45°. Upper chest focus. Rest 75s between sets' },
              { name: 'DB Arnold Press', detail: '3×10 — Seated. Rotate palms from facing you to facing forward. Hits all three delt heads. Rest 75s between sets' },
              { name: 'DB Front Raise', detail: '3×12 — Alternating arms. Control the descent. Rest 60s between sets' },
              { name: 'Tricep Overhead Extension', detail: '3×12 — Single DB held with both hands overhead. Full stretch at bottom. Rest 60s between sets' },
              { name: 'Rowing finisher', detail: '5 min, 22 spm, moderate' },
            ],
          },
          {
            id: 'variant_2',
            label: 'Variant A2 — Decline + Tricep Emphasis',
            notes: 'Hits lower chest and triceps harder. Good when shoulders need a lighter day.',
            estimatedMin: '38–42',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'Decline DB Bench Press', detail: '3×10 — Bench angled slightly down. Lower chest and tricep focus. Rest 75s between sets' },
              { name: 'DB Lateral Raise', detail: '3×12 — Light weight, slow tempo up and down. Rest 60s between sets' },
              { name: 'Tricep Kickback', detail: '3×12 — Hinge at hips, upper arm parallel to floor, full extension. Rest 60s between sets' },
              { name: 'Diamond Push-ups', detail: '3×max — Mat. Hands close together forming a diamond. Tricep and inner chest emphasis. Rest 75s between sets' },
              { name: 'Rowing finisher', detail: '5 min, 22 spm, moderate' },
            ],
          },
        ],
      },
      {
        id: 'day_b',
        label: 'Day B — Pull + Row',
        focus: 'Back, biceps, rear delts, traps',
        variants: [
          {
            id: 'primary',
            label: 'Primary (Default)',
            estimatedMin: '38–42',
            notes: 'RDL removed from this day and moved to Day C where it belongs as a hamstring movement',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'Dumbbell Bent-over Row', detail: '3×10 — Brace core, do not swing. Rest 75s between sets' },
              { name: 'Dumbbell Bicep Curl', detail: '3×12 — Controlled, no momentum. Rest 60s between sets' },
              { name: 'Renegade Row', detail: '3×8 per side — Mat, core stability. Rest 75s between sets' },
              { name: 'DB Shrug', detail: '3×15 — Full trap engagement. Rest 60s between sets' },
              { name: 'Rowing finisher', detail: '5 min, 22 spm, moderate' },
            ],
          },
          {
            id: 'variant_1',
            label: 'Variant B1 — Rear Delt + Upper Back Focus',
            notes: 'Targets the muscles that improve posture — critical for WFH desk posture. Good rotation every 2 weeks.',
            estimatedMin: '38–42',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'DB Reverse Fly', detail: '3×12 — Hinge forward at hips, arms wide, squeeze rear delts at top. Light weight. Rest 60s between sets' },
              { name: 'Single Arm DB Row', detail: '3×10 per side — Knee and hand on bench for support. Full ROM. Rest 75s between sets' },
              { name: 'DB Hammer Curl', detail: '3×12 — Neutral grip. Targets brachialis alongside bicep. Rest 60s between sets' },
              { name: 'DB Upright Row', detail: '3×12 — Pull DBs up along body to chin height. Traps and rear delts. Rest 60s between sets' },
              { name: 'Rowing finisher', detail: '5 min, 22 spm, moderate' },
            ],
          },
          {
            id: 'variant_2',
            label: 'Variant B2 — Bicep + Core Pull Emphasis',
            notes: 'Higher bicep volume with more anti-rotation core demand. Good when you want arm focus.',
            estimatedMin: '38–42',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'DB Bent-over Row', detail: '3×10 — Overhand grip — hits upper back differently than underhand. Rest 75s between sets' },
              { name: 'Concentration Curl', detail: '3×12 — Seated on bench edge, elbow on inner thigh. Full isolation. Rest 60s between sets' },
              { name: 'Renegade Row', detail: '3×10 per side — Mat. Heavier than primary if possible. Rest 75s between sets' },
              { name: 'Zottman Curl', detail: '3×10 — Curl up supinated, rotate to pronated at top, lower slowly. Hits bicep and forearm. Rest 60s between sets' },
              { name: 'Rowing finisher', detail: '5 min, 22 spm, moderate' },
            ],
          },
        ],
      },
      {
        id: 'day_c',
        label: 'Day C — Legs + Row',
        focus: 'Quads, hamstrings, glutes, calves',
        restNote: 'Legs need 75–90s between sets and 90s before rowing finisher — do not shorten this',
        variants: [
          {
            id: 'primary',
            label: 'Primary (Default)',
            estimatedMin: '40–45',
            notes: 'Legs need slightly longer rest than upper body. RDL added here from Day B as a hamstring movement.',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'Goblet Squat', detail: '3×12 — Single dumbbell, sit deep into it. Rest 90s between sets' },
              { name: 'Bench Step-up', detail: '3×10 per side — Use adjustable bench flat. Rest 75s between sets' },
              { name: 'Leg Press on Bench', detail: '3×12 — Weight attachment on bench. Rest 90s between sets' },
              { name: 'Romanian Deadlift', detail: '3×10 — Slow eccentric, feel the hamstring. Light-moderate weight. Rest 75s between sets' },
              { name: 'Rowing finisher', detail: '6 min, 24 spm, push pace — legs are warmed up, use the drive' },
            ],
          },
          {
            id: 'variant_1',
            label: 'Variant C1 — Glute + Posterior Chain Focus',
            notes: 'Shifts emphasis to glutes and hamstrings. Complements the quad-dominant primary well when alternating weeks.',
            estimatedMin: '40–45',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'DB Sumo Squat', detail: '3×12 — Wide stance, toes out, single DB between legs. Inner thigh and glute focus. Rest 90s between sets' },
              { name: 'DB Romanian Deadlift', detail: '3×10 — Both legs. Slow eccentric. Feel the hamstring stretch. Rest 75s between sets' },
              { name: 'DB Hip Thrust on Bench', detail: '3×12 — Upper back on bench, DB on hips. Drive through heels. Squeeze glutes at top. Rest 75s between sets' },
              { name: 'DB Calf Raise', detail: '3×20 — Stand on edge of mat or flat floor, DBs in hands. Full ROM. Rest 60s between sets' },
              { name: 'Rowing finisher', detail: '6 min, 24 spm, push pace' },
            ],
          },
          {
            id: 'variant_2',
            label: 'Variant C2 — Unilateral (Single Leg) Focus',
            notes: 'Single leg work exposes and corrects left-right imbalances. Harder than it looks. Expect soreness in new places.',
            estimatedMin: '40–45',
            exercises: [
              { name: 'Rowing warm-up', detail: '5 min, 18–20 spm, easy' },
              { name: 'DB Reverse Lunge', detail: '3×10 per side — Step back, knee hovers above floor. More knee-friendly than forward lunge. Rest 75s between sets' },
              { name: 'Single Leg Romanian Deadlift', detail: '3×8 per side — Hinge at hip, one leg back for balance. Light weight. Rest 75s between sets' },
              { name: 'Bench Step-up with Knee Drive', detail: '3×10 per side — Add knee drive at top. Glute and hip flexor. Rest 75s between sets' },
              { name: 'DB Calf Raise Single Leg', detail: '3×15 per side — Hold one DB, single leg. Use bench for balance if needed. Rest 60s between sets' },
              { name: 'Rowing finisher', detail: '6 min, 24 spm, push pace' },
            ],
          },
        ],
      },
      {
        id: 'day_d',
        label: 'Day D — Core + Mobility + Row',
        focus: 'Core stability, anti-rotation, mobility, endurance',
        restNote: 'Core recovers faster than large muscle groups — 45–60s between sets is sufficient',
        variants: [
          {
            id: 'primary',
            label: 'Primary (Default)',
            estimatedMin: '32–38',
            notes: 'Shorter session by design. Rowing after core is intentional — fatigued core during rowing builds functional endurance.',
            exercises: [
              { name: 'Rowing warm-up', detail: '4 min, easy, focus on posture and drive' },
              { name: 'Plank', detail: '3×45 sec — Mat. Squeeze glutes and core together. Rest 45s between sets' },
              { name: 'Dead Bug', detail: '3×10 per side — Mat, slow and controlled. No lower back arch. Rest 45s between sets' },
              { name: 'Side Plank', detail: '3×30 sec per side — Mat. Rest 45s between sets' },
              { name: 'Hollow Body Hold', detail: '3×20–30 sec — Mat. Lower back pressed into floor throughout. Rest 60s between sets' },
              { name: 'Bird Dog', detail: '3×10 per side — Mat. Opposite arm and leg. Anti-rotation focus. Rest 45s between sets' },
              { name: 'Rowing finisher', detail: '8 min, 22 spm, moderate' },
            ],
          },
          {
            id: 'variant_1',
            label: 'Variant D1 — Anti-Rotation + Oblique Focus',
            notes: 'Targets obliques and rotational stability — the core muscles most people neglect. Pairs well with heavy leg days earlier in the week.',
            estimatedMin: '32–38',
            exercises: [
              { name: 'Rowing warm-up', detail: '4 min, easy' },
              { name: 'Side Plank with Hip Dip', detail: '3×10 per side — From side plank, dip hip to mat and raise back. Oblique focus. Rest 45s between sets' },
              { name: 'DB Suitcase Carry', detail: '3×20 steps per side — Hold one DB at side, walk 10 steps and back. Anti-lateral flexion. Rest 45s between sets' },
              { name: 'Russian Twist', detail: '3×12 per side — Mat. Hold single light DB. Feet elevated for more challenge. Rest 45s between sets' },
              { name: 'Pallof Press Hold', detail: '3×30 sec — Hold DB at chest, extend arms forward and hold. Anti-rotation isometric. Light weight. Rest 45s between sets' },
              { name: 'Rowing finisher', detail: '8 min, 22 spm, moderate' },
            ],
          },
          {
            id: 'variant_2',
            label: 'Variant D2 — Mobility + Active Recovery Focus',
            notes: 'Lower intensity option — ideal after a hard leg day, after poor sleep, or mid-week when cumulative fatigue is high. Still counts as a training day.',
            estimatedMin: '30–35',
            exercises: [
              { name: 'Rowing warm-up', detail: '4 min, 18 spm, very easy — pure warm-up' },
              { name: '90-90 Hip Stretch', detail: '3×45 sec per side — Mat. Both legs at 90°. Forward fold over front leg. Hip flexor and external rotator. Rest 30s between sets' },
              { name: 'Cat-Cow', detail: '3×12 — Mat, hands and knees. Slow and controlled. Thoracic mobility. Rest 30s between sets' },
              { name: 'Thoracic Rotation', detail: '3×8 per side — Mat, hands and knees. Thread one arm under body. WFH posture reset. Rest 30s between sets' },
              { name: 'Dead Bug', detail: '3×8 per side — Slow and deliberate. Focus on breathing and lower back contact with mat. Rest 45s between sets' },
              { name: "World's Greatest Stretch", detail: '3×5 per side — Mat. Lunge position, same side elbow to floor, rotate arm to sky. Full body mobility. Rest 30s between sets' },
              { name: 'Rowing finisher', detail: '6 min, 20 spm, easy — conversational pace only' },
            ],
          },
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
  const currentStage = settings.stageOverride || phase.workoutStage.number;

  const [openStage, setOpenStage] = useState(currentStage);
  const [openSession, setOpenSession] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});

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

            {stage.restProtocol && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-400 text-xs">Rest Period Protocol</span>
                <div className="text-sm text-gray-700 mt-1 space-y-1">
                  {stage.restProtocol.dayAB && (
                    <div><span className="font-medium">Day A / Day B:</span> {stage.restProtocol.dayAB.betweenSets} between sets · {stage.restProtocol.dayAB.betweenExercises} between exercises · {stage.restProtocol.dayAB.beforeFinisher} before finisher</div>
                  )}
                  {stage.restProtocol.dayC && (
                    <div><span className="font-medium">Day C:</span> {stage.restProtocol.dayC.betweenSets} between sets · {stage.restProtocol.dayC.betweenExercises} between exercises · {stage.restProtocol.dayC.beforeFinisher} before finisher</div>
                  )}
                  {stage.restProtocol.dayD && (
                    <div><span className="font-medium">Day D:</span> {stage.restProtocol.dayD.betweenSets} between sets · {stage.restProtocol.dayD.betweenExercises} between exercises · {stage.restProtocol.dayD.beforeFinisher} before finisher</div>
                  )}
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
              const hasVariants = session.variants && session.variants.length > 0;
              const variantKey = session.id + stage.number;
              const activeVariantId = selectedVariants[variantKey] || (hasVariants ? session.variants[0].id : null);
              const activeVariant = hasVariants ? session.variants.find(v => v.id === activeVariantId) || session.variants[0] : null;
              const exercises = hasVariants ? activeVariant.exercises : session.exercises;
              const estimatedMin = hasVariants ? activeVariant.estimatedMin : session.estimatedMin;
              const sessionNotes = hasVariants ? activeVariant.notes : session.notes;

              return (
                <div key={session.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setOpenSession(isOpen ? null : session.id + stage.number)}
                    className="w-full px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🏋️</span>
                      <span className="font-semibold text-gray-800">{session.label}</span>
                      {estimatedMin && (
                        <span className="text-xs text-gray-400 font-normal">~{estimatedMin} min</span>
                      )}
                    </div>
                    <span className="text-gray-400 text-lg">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 border-t border-gray-100">
                      {session.focus && (
                        <p className="text-xs text-gray-400 mt-3 mb-1">Focus: <span className="text-gray-600">{session.focus}</span></p>
                      )}
                      {session.restNote && (
                        <p className="text-xs text-amber-600 mb-2">⏱️ {session.restNote}</p>
                      )}

                      {/* Variant Picker */}
                      {hasVariants && (
                        <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                          {session.variants.map(v => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariants(prev => ({ ...prev, [variantKey]: v.id }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                activeVariantId === v.id
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {session.note && (
                        <p className="text-sm text-amber-600 italic mt-2 mb-2">⚠️ {session.note}</p>
                      )}
                      {sessionNotes && (
                        <p className="text-sm text-gray-500 italic mt-1 mb-2">📝 {sessionNotes}</p>
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
                          {exercises.map((ex, i) => (
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
