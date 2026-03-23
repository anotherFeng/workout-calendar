import Dexie from 'dexie';

const db = new Dexie('WorkoutCalendarDB');

db.version(1).stores({
  vitamins: '++id, name, active, sortOrder',
  equipment: '++id, name, active, sortOrder',
  dailyLogs: '&date',
  vitaminLogs: '++id, [date+vitaminId], date, vitaminId',
  weightLogs: '&date',
  settings: '&key',
});

export default db;
