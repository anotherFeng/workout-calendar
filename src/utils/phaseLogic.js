export function getCurrentPhase(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now - start;
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;

  let nutritionPhase, workoutStage;

  if (diffWeeks <= 8) {
    nutritionPhase = { number: 1, label: 'Aggressive Cut', weeks: '1-8' };
  } else if (diffWeeks <= 36) {
    nutritionPhase = { number: 2, label: 'Steady Cut', weeks: '9-36' };
  } else {
    nutritionPhase = { number: 3, label: 'Maintenance', weeks: '37+' };
  }

  if (diffWeeks <= 4) {
    workoutStage = { number: 1, label: 'Foundation', weeks: '1-4' };
  } else if (diffWeeks <= 12) {
    workoutStage = { number: 2, label: 'Build', weeks: '5-12' };
  } else {
    workoutStage = { number: 3, label: 'Intensity', weeks: '13+' };
  }

  return { weekNumber: diffWeeks, nutritionPhase, workoutStage };
}

export function getSessionOptions(workoutStage) {
  if (workoutStage <= 1) {
    return [
      { group: 'Day A — Push + Row', options: [
        'Day A — Push + Row (Primary)',
        'Day A — Push + Row (Incline Focus)',
        'Day A — Push + Row (Decline + Tricep)',
      ]},
      { group: 'Day B — Pull + Row', options: [
        'Day B — Pull + Row (Primary)',
        'Day B — Pull + Row (Rear Delt + Upper Back)',
        'Day B — Pull + Row (Bicep + Core Pull)',
      ]},
      { group: 'Day C — Legs + Row', options: [
        'Day C — Legs + Row (Primary)',
        'Day C — Legs + Row (Glute + Posterior Chain)',
        'Day C — Legs + Row (Unilateral)',
      ]},
      { group: 'Day D — Core + Mobility + Row', options: [
        'Day D — Core + Mobility + Row (Primary)',
        'Day D — Core + Mobility + Row (Anti-Rotation + Oblique)',
        'Day D — Core + Mobility + Row (Mobility + Recovery)',
      ]},
      { group: 'Other', options: ['Rest Day'] },
    ];
  }
  if (workoutStage <= 2) {
    return [
      { group: null, options: [
        'Day A — Push Heavy',
        'Day B — Pull Heavy',
        'Day C — Legs Heavy',
        'Day D — Rowing Intervals',
        'Rest Day',
      ]},
    ];
  }
  return [
    { group: null, options: [
      'Day A — Upper Compound',
      'Day B — Lower + Core',
      'Day C — Push Circuit',
      'Day D — Pull Circuit',
      'Day E — Rowing Long Intervals',
      'Rest Day',
    ]},
  ];
}
