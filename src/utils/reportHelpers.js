export function aggregateReportData(dailyLogs, vitaminLogs, weightLogs, vitamins) {
  if (!dailyLogs.length) {
    return {
      totalDays: 0,
      workoutDays: 0,
      avgWorkoutRating: 0,
      avgMealRating: 0,
      vitaminCompliance: 0,
      perVitaminCompliance: [],
      weightEntries: [],
      weeklyData: [],
    };
  }

  const activeVitamins = vitamins.filter(v => v.active);
  const totalDays = dailyLogs.length;
  const workoutDays = dailyLogs.filter(d => d.workoutRating && d.workoutRating >= 1 && d.workoutSessionType !== 'Rest Day').length;

  const workoutRatings = dailyLogs.filter(d => d.workoutRating).map(d => d.workoutRating);
  const mealRatings = dailyLogs.filter(d => d.mealRating).map(d => d.mealRating);

  const avgWorkoutRating = workoutRatings.length ? workoutRatings.reduce((a, b) => a + b, 0) / workoutRatings.length : 0;
  const avgMealRating = mealRatings.length ? mealRatings.reduce((a, b) => a + b, 0) / mealRatings.length : 0;

  // Vitamin compliance: % of days where all active vitamins were checked
  const datesWithAllChecked = dailyLogs.filter(log => {
    const logsForDate = vitaminLogs.filter(vl => vl.date === log.date && vl.checked);
    return activeVitamins.length > 0 && logsForDate.length >= activeVitamins.length;
  }).length;
  const vitaminCompliance = totalDays > 0 ? Math.round((datesWithAllChecked / totalDays) * 100) : 0;

  // Per-vitamin compliance
  const perVitaminCompliance = activeVitamins.map(v => {
    const checkedCount = vitaminLogs.filter(vl => vl.vitaminId === v.id && vl.checked).length;
    return {
      id: v.id,
      name: v.name,
      compliance: totalDays > 0 ? Math.round((checkedCount / totalDays) * 100) : 0,
    };
  });

  // Weight entries sorted by date
  const weightEntries = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));

  // Weekly aggregation
  const weekMap = {};
  dailyLogs.forEach(log => {
    const d = new Date(log.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday start
    const weekKey = weekStart.toISOString().slice(0, 10);
    if (!weekMap[weekKey]) {
      weekMap[weekKey] = { weekStart: weekKey, workoutDays: 0, totalDays: 0, workoutRatings: [], mealRatings: [] };
    }
    weekMap[weekKey].totalDays++;
    if (log.workoutRating && log.workoutSessionType !== 'Rest Day') weekMap[weekKey].workoutDays++;
    if (log.workoutRating) weekMap[weekKey].workoutRatings.push(log.workoutRating);
    if (log.mealRating) weekMap[weekKey].mealRatings.push(log.mealRating);
  });

  const weeklyData = Object.values(weekMap)
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
    .map(w => ({
      ...w,
      avgWorkoutRating: w.workoutRatings.length ? (w.workoutRatings.reduce((a, b) => a + b, 0) / w.workoutRatings.length).toFixed(1) : 0,
      avgMealRating: w.mealRatings.length ? (w.mealRatings.reduce((a, b) => a + b, 0) / w.mealRatings.length).toFixed(1) : 0,
    }));

  // Streaks
  const sortedDates = dailyLogs.map(d => d.date).sort();
  let currentStreak = 0;
  let maxStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    const log = dailyLogs.find(d => d.date === sortedDates[i]);
    const allVitaminsChecked = vitaminLogs.filter(vl => vl.date === sortedDates[i] && vl.checked).length >= activeVitamins.length;
    const isGoodDay = (log.workoutRating >= 4 || !log.workoutRating) && (log.mealRating >= 4 || !log.mealRating) && allVitaminsChecked;

    if (isGoodDay) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return {
    totalDays,
    workoutDays,
    avgWorkoutRating: +avgWorkoutRating.toFixed(1),
    avgMealRating: +avgMealRating.toFixed(1),
    vitaminCompliance,
    perVitaminCompliance,
    weightEntries,
    weeklyData,
    currentStreak,
    maxStreak,
  };
}
