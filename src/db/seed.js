import db from './index';
import fitnessPlan from '../../fitness-plan.json';

export async function seedIfEmpty() {
  const vitaminCount = await db.vitamins.count();
  if (vitaminCount > 0) return;

  // Seed vitamins from supplements array
  const vitamins = fitnessPlan.supplements.map((s, i) => ({
    name: s.name,
    dose: s.dose || s.dose_week_2_plus || '',
    timing: s.timing || '',
    notes: s.notes || '',
    active: 1,
    sortOrder: i,
  }));
  await db.vitamins.bulkAdd(vitamins);

  // Seed equipment
  const equipment = fitnessPlan.workout_plan.equipment.map((name, i) => ({
    name,
    active: 1,
    sortOrder: i,
  }));
  await db.equipment.bulkAdd(equipment);

  // Seed settings
  const settingsEntries = [
    { key: 'startDate', value: fitnessPlan.meta.created },
    { key: 'goalWeight', value: fitnessPlan.profile.goal_weight_lbs },
    { key: 'goalWeightPrimary', value: fitnessPlan.profile.goal_weight_primary_lbs },
    { key: 'startingWeight', value: fitnessPlan.profile.starting_weight_lbs },
    { key: 'currentWeight', value: fitnessPlan.profile.current_weight_lbs },
    { key: 'phaseLogic', value: JSON.stringify(fitnessPlan.tracker_app_spec.phase_logic) },
    { key: 'timeline', value: JSON.stringify(fitnessPlan.timeline) },
    { key: 'profile', value: JSON.stringify(fitnessPlan.profile) },
    { key: 'workoutPlan', value: JSON.stringify(fitnessPlan.workout_plan) },
    { key: 'nutrition', value: JSON.stringify(fitnessPlan.nutrition) },
  ];
  await db.settings.bulkAdd(settingsEntries);
}
