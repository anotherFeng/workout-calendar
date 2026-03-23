import { useState, useEffect, useCallback } from 'react';
import db from '../db';

export function useDailyLog(date) {
  const [log, setLog] = useState(null);
  const [vitaminChecks, setVitaminChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      const dailyLog = await db.dailyLogs.get(date);
      const vitLogs = await db.vitaminLogs.where('date').equals(date).toArray();
      if (!cancelled) {
        setLog(dailyLog || { date, workoutRating: null, workoutSessionType: '', mealRating: null, notes: '' });
        setVitaminChecks(vitLogs);
        setLoading(false);
      }
    }
    load();

    return () => { cancelled = true; };
  }, [date]);

  const saveLog = useCallback(async (updates) => {
    const newLog = { ...log, ...updates, date };
    await db.dailyLogs.put(newLog);
    setLog(newLog);
  }, [date, log]);

  const toggleVitamin = useCallback(async (vitaminId, checked) => {
    const existing = await db.vitaminLogs
      .where('[date+vitaminId]')
      .equals([date, vitaminId])
      .first();

    if (existing) {
      await db.vitaminLogs.update(existing.id, { checked });
    } else {
      await db.vitaminLogs.add({ date, vitaminId, checked });
    }

    const updated = await db.vitaminLogs.where('date').equals(date).toArray();
    setVitaminChecks(updated);
  }, [date]);

  return { log, vitaminChecks, loading, saveLog, toggleVitamin };
}

export function useMonthLogs(year, month) {
  const [logs, setLogs] = useState({});
  const [vitaminLogs, setVitaminLogs] = useState([]);
  const [activeVitaminCount, setActiveVitaminCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDay = new Date(year, month + 1, 0).getDate();
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

      const dailyLogs = await db.dailyLogs
        .where('date')
        .between(startDate, endDate, true, true)
        .toArray();

      const vitLogs = await db.vitaminLogs
        .where('date')
        .between(startDate, endDate, true, true)
        .toArray();

      const activeCount = await db.vitamins.where('active').equals(1).count();

      if (!cancelled) {
        const logMap = {};
        dailyLogs.forEach(l => { logMap[l.date] = l; });
        setLogs(logMap);
        setVitaminLogs(vitLogs);
        setActiveVitaminCount(activeCount);
      }
    }
    load();

    return () => { cancelled = true; };
  }, [year, month]);

  const getDayStatus = useCallback((dateStr) => {
    const log = logs[dateStr];
    const vitChecks = vitaminLogs.filter(vl => vl.date === dateStr && vl.checked);

    return {
      workout: log?.workoutRating || 0,
      meal: log?.mealRating || 0,
      vitamins: activeVitaminCount > 0 ? vitChecks.length / activeVitaminCount : 0,
      hasData: !!log,
    };
  }, [logs, vitaminLogs, activeVitaminCount]);

  return { logs, getDayStatus };
}
