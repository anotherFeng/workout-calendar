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
      'Day A — Push + Row',
      'Day B — Pull + Row',
      'Day C — Legs + Core + Row',
      'Rest Day',
    ];
  }
  if (workoutStage <= 2) {
    return [
      'Day A — Push Heavy',
      'Day B — Pull Heavy',
      'Day C — Legs Heavy',
      'Day D — Rowing Intervals',
      'Rest Day',
    ];
  }
  return [
    'Day A — Upper Compound',
    'Day B — Lower + Core',
    'Day C — Push Circuit',
    'Day D — Pull Circuit',
    'Day E — Rowing Long Intervals',
    'Rest Day',
  ];
}
