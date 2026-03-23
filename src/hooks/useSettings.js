import { useState, useEffect, useCallback } from 'react';
import db from '../db';

export function useSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const all = await db.settings.toArray();
      const obj = {};
      all.forEach(s => {
        try {
          obj[s.key] = JSON.parse(s.value);
        } catch {
          obj[s.key] = s.value;
        }
      });
      if (!cancelled) {
        setSettings(obj);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const saveSetting = useCallback(async (key, value) => {
    const stored = typeof value === 'object' ? JSON.stringify(value) : value;
    await db.settings.put({ key, value: stored });
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return { settings, loading, saveSetting };
}
