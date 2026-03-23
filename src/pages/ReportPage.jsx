import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import db from '../db';
import { formatDate } from '../utils/dateHelpers';
import { aggregateReportData } from '../utils/reportHelpers';
import { generatePlan } from '../utils/recalibrate';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function ReportPage() {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 28);
    return { from: formatDate(start), to: formatDate(end) };
  });

  const [data, setData] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Recalibrate state
  const [showRecalibrate, setShowRecalibrate] = useState(false);
  const [planDays, setPlanDays] = useState(14);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [dailyLogs, vitaminLogs, weightLogs, vits, equip, settingsArr] = await Promise.all([
        db.dailyLogs.where('date').between(dateRange.from, dateRange.to, true, true).toArray(),
        db.vitaminLogs.where('date').between(dateRange.from, dateRange.to, true, true).toArray(),
        db.weightLogs.where('date').between(dateRange.from, dateRange.to, true, true).toArray(),
        db.vitamins.toArray(),
        db.equipment.toArray(),
        db.settings.toArray(),
      ]);
      if (cancelled) return;

      const settingsObj = {};
      settingsArr.forEach(s => {
        try { settingsObj[s.key] = JSON.parse(s.value); }
        catch { settingsObj[s.key] = s.value; }
      });

      setEquipment(equip);
      setSettings(settingsObj);
      setData(aggregateReportData(dailyLogs, vitaminLogs, weightLogs, vits));
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [dateRange]);

  function handleRecalibrate() {
    if (!data) return;
    const result = generatePlan(data, equipment, settings, planDays);
    setPlan(result);
  }

  async function applyPlan() {
    if (!plan) return;
    for (const day of plan.plan) {
      const existing = await db.dailyLogs.get(day.date);
      if (!existing) {
        await db.dailyLogs.put({
          date: day.date,
          workoutRating: null,
          workoutSessionType: day.sessionType,
          mealRating: null,
          notes: `[Planned] ${day.notes}`,
        });
      }
    }
    setPlan(null);
    setShowRecalibrate(false);
  }

  if (loading || !data) {
    return <div className="p-6 text-center text-gray-500">Loading report data...</div>;
  }

  const goalWeight = settings.goalWeight || 145;

  // Chart data
  const weightChartData = {
    labels: data.weightEntries.map(w => w.date),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: data.weightEntries.map(w => w.weightLbs),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Goal',
        data: data.weightEntries.map(() => goalWeight),
        borderColor: '#ef4444',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const weeklyWorkoutData = {
    labels: data.weeklyData.map(w => w.weekStart),
    datasets: [
      {
        label: 'Workout Days',
        data: data.weeklyData.map(w => w.workoutDays),
        backgroundColor: '#22c55e',
      },
      {
        label: 'Target (3)',
        data: data.weeklyData.map(() => 3),
        type: 'line',
        borderColor: '#f59e0b',
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const ratingTrendData = {
    labels: data.weeklyData.map(w => w.weekStart),
    datasets: [
      {
        label: 'Avg Workout Rating',
        data: data.weeklyData.map(w => w.avgWorkoutRating),
        borderColor: '#22c55e',
        tension: 0.3,
      },
      {
        label: 'Avg Meal Rating',
        data: data.weeklyData.map(w => w.avgMealRating),
        borderColor: '#3b82f6',
        tension: 0.3,
      },
    ],
  };

  const vitaminComplianceData = {
    labels: data.perVitaminCompliance.map(v => v.name.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      data: data.perVitaminCompliance.map(v => v.compliance),
      backgroundColor: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'],
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
    scales: { x: { ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } },
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Report</h1>

      {/* Date Range Selector */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
        <label className="text-sm text-gray-500">From</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        />
        <label className="text-sm text-gray-500">To</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Days Tracked" value={data.totalDays} />
        <SummaryCard label="Workout Days" value={data.workoutDays} />
        <SummaryCard label="Avg Workout" value={`${data.avgWorkoutRating}★`} />
        <SummaryCard label="Avg Meal" value={`${data.avgMealRating}★`} />
        <SummaryCard label="Vitamin Compliance" value={`${data.vitaminCompliance}%`} />
        <SummaryCard label="Current Streak" value={`${data.currentStreak} days`} />
        <SummaryCard label="Best Streak" value={`${data.maxStreak} days`} />
        <SummaryCard label="Weight Entries" value={data.weightEntries.length} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.weightEntries.length > 0 && (
          <ChartCard title="Weight Trend">
            <Line data={weightChartData} options={chartOptions} />
          </ChartCard>
        )}

        {data.weeklyData.length > 0 && (
          <ChartCard title="Weekly Workout Days">
            <Bar data={weeklyWorkoutData} options={chartOptions} />
          </ChartCard>
        )}

        {data.weeklyData.length > 0 && (
          <ChartCard title="Rating Trends">
            <Line data={ratingTrendData} options={chartOptions} />
          </ChartCard>
        )}

        {data.perVitaminCompliance.length > 0 && (
          <ChartCard title="Vitamin Compliance (%)">
            <Doughnut data={vitaminComplianceData} options={{ ...chartOptions, scales: undefined }} />
          </ChartCard>
        )}
      </div>

      {/* Weekly Summary Table */}
      {data.weeklyData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-x-auto">
          <h3 className="font-semibold text-gray-700 mb-3">Weekly Summary</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 pr-4">Week</th>
                <th className="pb-2 pr-4">Workout Days</th>
                <th className="pb-2 pr-4">Avg Workout</th>
                <th className="pb-2 pr-4">Avg Meal</th>
              </tr>
            </thead>
            <tbody>
              {data.weeklyData.map(w => (
                <tr key={w.weekStart} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium">{w.weekStart}</td>
                  <td className="py-2 pr-4">
                    <span className={w.workoutDays >= 3 ? 'text-green-600 font-semibold' : 'text-red-500'}>
                      {w.workoutDays}
                    </span>
                    /3-5
                  </td>
                  <td className="py-2 pr-4">{w.avgWorkoutRating}★</td>
                  <td className="py-2 pr-4">{w.avgMealRating}★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Per-Vitamin Compliance Table */}
      {data.perVitaminCompliance.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Vitamin Compliance Detail</h3>
          <div className="space-y-2">
            {data.perVitaminCompliance.map(v => (
              <div key={v.id} className="flex items-center gap-3">
                <span className="text-sm flex-1 min-w-0 truncate">{v.name}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: `${v.compliance}%`,
                      backgroundColor: v.compliance >= 80 ? '#22c55e' : v.compliance >= 50 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{v.compliance}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recalibrate Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Recalibrate Workout Plan</h3>
          <button
            onClick={() => setShowRecalibrate(s => !s)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            {showRecalibrate ? 'Close' : '🔄 Recalibrate'}
          </button>
        </div>

        {showRecalibrate && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-500">Plan next</label>
              <select
                value={planDays}
                onChange={e => setPlanDays(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={21}>21 days</option>
                <option value={30}>30 days</option>
              </select>
              <button
                onClick={handleRecalibrate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Generate Plan
              </button>
            </div>

            {plan && (
              <div className="space-y-4">
                {/* Plan Summary */}
                <div className="bg-blue-50 rounded-lg p-4 text-sm">
                  <p className="font-semibold text-blue-700 mb-2">Plan Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-blue-600">
                    <span>Stage: {plan.summary.workoutStage.label}</span>
                    <span>Phase: {plan.summary.nutritionPhase.label}</span>
                    <span>Workouts/week: {plan.summary.workoutsPerWeek}</span>
                    <span>Calorie target: {plan.summary.calorieTarget} kcal</span>
                  </div>
                </div>

                {/* Day-by-day preview */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-2 pr-4">Date</th>
                        <th className="pb-2 pr-4">Day</th>
                        <th className="pb-2 pr-4">Session</th>
                        <th className="pb-2 pr-4">Calories</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.plan.map(day => {
                        const d = new Date(day.date + 'T12:00:00');
                        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                        return (
                          <tr key={day.date} className={`border-b border-gray-100 ${day.sessionType === 'Rest Day' ? 'text-gray-400' : ''}`}>
                            <td className="py-2 pr-4">{day.date}</td>
                            <td className="py-2 pr-4">{dayName}</td>
                            <td className="py-2 pr-4 font-medium">{day.sessionType}</td>
                            <td className="py-2 pr-4">{day.calorieTarget}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={applyPlan}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer"
                  >
                    ✓ Apply Plan
                  </button>
                  <button
                    onClick={() => setPlan(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {data.totalDays === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No data in this date range.</p>
          <p className="text-sm mt-2">Start tracking on the Calendar page to see your report here.</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-sm text-gray-700 mb-3">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
}
