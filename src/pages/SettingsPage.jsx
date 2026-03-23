import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db';

export default function SettingsPage() {
  const vitamins = useLiveQuery(() => db.vitamins.orderBy('sortOrder').toArray()) || [];
  const equipment = useLiveQuery(() => db.equipment.orderBy('sortOrder').toArray()) || [];

  const [newVitamin, setNewVitamin] = useState({ name: '', dose: '', timing: '' });
  const [newEquipment, setNewEquipment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const sd = await db.settings.get('startDate');
      const gw = await db.settings.get('goalWeight');
      if (sd) setStartDate(String(sd.value));
      if (gw) setGoalWeight(String(gw.value));
    }
    loadSettings();
  }, []);

  // Vitamin CRUD
  async function addVitamin() {
    if (!newVitamin.name.trim()) return;
    const maxSort = vitamins.length ? Math.max(...vitamins.map(v => v.sortOrder)) + 1 : 0;
    await db.vitamins.add({ ...newVitamin, active: 1, notes: '', sortOrder: maxSort });
    setNewVitamin({ name: '', dose: '', timing: '' });
  }

  async function toggleVitaminActive(id, active) {
    await db.vitamins.update(id, { active: active ? 1 : 0 });
  }

  async function deleteVitamin(id) {
    await db.vitamins.delete(id);
    await db.vitaminLogs.where('vitaminId').equals(id).delete();
  }

  // Equipment CRUD
  async function addEquipment() {
    if (!newEquipment.trim()) return;
    const maxSort = equipment.length ? Math.max(...equipment.map(e => e.sortOrder)) + 1 : 0;
    await db.equipment.add({ name: newEquipment.trim(), active: 1, sortOrder: maxSort });
    setNewEquipment('');
  }

  async function toggleEquipmentActive(id, active) {
    await db.equipment.update(id, { active: active ? 1 : 0 });
  }

  async function deleteEquipment(id) {
    await db.equipment.delete(id);
  }

  // Settings save
  async function saveProfile() {
    if (startDate) await db.settings.put({ key: 'startDate', value: startDate });
    if (goalWeight) await db.settings.put({ key: 'goalWeight', value: parseFloat(goalWeight) });
  }

  // Export all data
  async function exportData() {
    const data = {
      vitamins: await db.vitamins.toArray(),
      equipment: await db.equipment.toArray(),
      dailyLogs: await db.dailyLogs.toArray(),
      vitaminLogs: await db.vitaminLogs.toArray(),
      weightLogs: await db.weightLogs.toArray(),
      settings: await db.settings.toArray(),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-calendar-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import data
  async function importData(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.vitamins || !data.dailyLogs || !data.settings) {
        setImportStatus('Invalid backup file format');
        return;
      }

      if (!window.confirm('This will replace ALL existing data. Are you sure?')) {
        e.target.value = '';
        return;
      }

      await db.transaction('rw', db.vitamins, db.equipment, db.dailyLogs, db.vitaminLogs, db.weightLogs, db.settings, async () => {
        await db.vitamins.clear();
        await db.equipment.clear();
        await db.dailyLogs.clear();
        await db.vitaminLogs.clear();
        await db.weightLogs.clear();
        await db.settings.clear();

        if (data.vitamins?.length) await db.vitamins.bulkAdd(data.vitamins);
        if (data.equipment?.length) await db.equipment.bulkAdd(data.equipment);
        if (data.dailyLogs?.length) await db.dailyLogs.bulkAdd(data.dailyLogs);
        if (data.vitaminLogs?.length) await db.vitaminLogs.bulkAdd(data.vitaminLogs);
        if (data.weightLogs?.length) await db.weightLogs.bulkAdd(data.weightLogs);
        if (data.settings?.length) await db.settings.bulkAdd(data.settings);
      });

      setImportStatus('Data imported successfully!');
      setTimeout(() => setImportStatus(''), 3000);
    } catch (err) {
      setImportStatus('Error reading file: ' + err.message);
    }
    e.target.value = '';
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* Profile Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-lg text-gray-700 mb-4">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Goal Weight (lbs)</label>
            <input
              type="number"
              step="0.5"
              value={goalWeight}
              onChange={e => setGoalWeight(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
        </div>
        <button
          onClick={saveProfile}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Save Profile
        </button>
      </section>

      {/* Vitamins Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-lg text-gray-700 mb-4">Vitamins & Supplements</h2>
        <div className="space-y-2 mb-4">
          {vitamins.map(v => (
            <div key={v.id} className={`flex items-center gap-3 p-3 rounded-lg border ${v.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
              <input
                type="checkbox"
                checked={!!v.active}
                onChange={(e) => toggleVitaminActive(v.id, e.target.checked)}
                className="w-4 h-4 accent-green-500"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{v.name}</div>
                <div className="text-xs text-gray-500">{v.dose} — {v.timing}</div>
              </div>
              <button
                onClick={() => deleteVitamin(v.id)}
                className="text-red-400 hover:text-red-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            placeholder="Name"
            value={newVitamin.name}
            onChange={e => setNewVitamin(v => ({ ...v, name: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
          />
          <input
            placeholder="Dose"
            value={newVitamin.dose}
            onChange={e => setNewVitamin(v => ({ ...v, dose: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-28"
          />
          <input
            placeholder="Timing"
            value={newVitamin.timing}
            onChange={e => setNewVitamin(v => ({ ...v, timing: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-36"
          />
          <button
            onClick={addVitamin}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-lg text-gray-700 mb-4">Equipment</h2>
        <div className="space-y-2 mb-4">
          {equipment.map(e => (
            <div key={e.id} className={`flex items-center gap-3 p-3 rounded-lg border ${e.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
              <input
                type="checkbox"
                checked={!!e.active}
                onChange={(ev) => toggleEquipmentActive(e.id, ev.target.checked)}
                className="w-4 h-4 accent-green-500"
              />
              <span className="flex-1 text-sm font-medium">{e.name}</span>
              <button
                onClick={() => deleteEquipment(e.id)}
                className="text-red-400 hover:text-red-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            placeholder="Equipment name"
            value={newEquipment}
            onChange={e => setNewEquipment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addEquipment()}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
          />
          <button
            onClick={addEquipment}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </section>

      {/* Export / Import Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-lg text-gray-700 mb-4">Data Backup</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            📥 Export JSON Backup
          </button>
          <label className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors cursor-pointer">
            📤 Import JSON Backup
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
        {importStatus && (
          <div className={`mt-3 text-sm ${importStatus.includes('Error') || importStatus.includes('Invalid') ? 'text-red-600' : 'text-green-600'}`}>
            {importStatus}
          </div>
        )}
      </section>
    </div>
  );
}
