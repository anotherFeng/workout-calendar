import { formatDate } from './dateHelpers';
import { getCurrentPhase, getSessionOptions } from './phaseLogic';

export function generatePlan(reportData, equipment, settings, daysCount) {
  const startDate = settings.startDate || formatDate(new Date());
  const goalWeight = settings.goalWeight || 145;
  const phaseInfo = getCurrentPhase(startDate);

  const plan = [];
  const sessionOptions = getSessionOptions(phaseInfo.workoutStage.number);
  const workoutSessions = sessionOptions.filter(s => s !== 'Rest Day');

  // Determine workout frequency based on stage
  let workoutsPerWeek = 3;
  if (phaseInfo.workoutStage.number === 2) workoutsPerWeek = 4;
  if (phaseInfo.workoutStage.number === 3) workoutsPerWeek = 5;

  // Determine calorie target based on weight trend
  let calorieTarget = 1675;
  if (reportData.weightEntries && reportData.weightEntries.length >= 2) {
    const latest = reportData.weightEntries[reportData.weightEntries.length - 1].weightLbs;
    if (latest <= 158) calorieTarget = 1825;
    if (latest <= 148) calorieTarget = 2050;
  } else if (phaseInfo.nutritionPhase.number === 2) {
    calorieTarget = 1825;
  } else if (phaseInfo.nutritionPhase.number === 3) {
    calorieTarget = 2050;
  }

  // Build day-by-day plan
  const today = new Date();
  let sessionIndex = 0;
  let workoutDaysThisWeek = 0;

  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = formatDate(date);
    const dow = date.getDay(); // 0=Sun, 6=Sat

    // Reset weekly counter on Monday
    if (dow === 1) {
      workoutDaysThisWeek = 0;
    }

    const isSunday = dow === 0;
    const isSaturday = dow === 6;
    const isRestDay = isSunday || (isSaturday && workoutDaysThisWeek >= workoutsPerWeek);

    let sessionType;
    if (isRestDay) {
      sessionType = 'Rest Day';
    } else if (workoutDaysThisWeek < workoutsPerWeek) {
      sessionType = workoutSessions[sessionIndex % workoutSessions.length];
      sessionIndex++;
      workoutDaysThisWeek++;
    } else {
      sessionType = 'Rest Day';
    }

    plan.push({
      date: dateStr,
      sessionType,
      calorieTarget,
      notes: isRestDay ? 'Rest and recovery' : `${sessionType} — focus on form and progressive overload`,
    });
  }

  return {
    plan,
    summary: {
      daysCount,
      workoutsPerWeek,
      calorieTarget,
      workoutStage: phaseInfo.workoutStage,
      nutritionPhase: phaseInfo.nutritionPhase,
      equipmentUsed: equipment.filter(e => e.active).map(e => e.name),
      goalWeight,
    },
  };
}
