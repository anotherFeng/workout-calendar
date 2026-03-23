const schedule = [
  {
    time: '11:00 AM',
    icon: '🍳',
    title: 'Breakfast',
    detail: 'Protein meal — 40–50g protein. Eggs, Greek yogurt, cottage cheese, or shake.',
  },
  {
    time: '11:00 AM',
    icon: '💊',
    title: 'Morning Supplements + Creatine',
    detail: 'Multi, D3+K2, Omega-3, Creatine — all anchored here with food.',
  },
  {
    time: '12:30 – 1:15 PM',
    icon: '🏋️',
    title: 'Workout',
    detail: 'Fed, energized, clean buffer before dinner.',
  },
  {
    time: '1:15 – 1:30 PM',
    icon: '🥤',
    title: 'Post-Workout Protein Shake',
    detail: '40–50g within 30 min post-workout. This is your lunch.',
  },
  {
    time: '5:00 – 6:00 PM',
    icon: '🍽️',
    title: 'Dinner',
    detail: 'Protein first on the plate.',
  },
  {
    time: 'Before Bed',
    icon: '💊',
    title: 'Magnesium Glycinate',
    detail: '2 caps week 1, 3 caps week 2+.',
  },
]

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function WeeklySchedulePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Weekly Schedule</h2>
      <p className="text-sm text-gray-500">Weekday routine — Mon through Fri</p>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[22px] top-3 bottom-3 w-0.5 bg-gray-200" />

        <div className="space-y-5">
          {schedule.map((item, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0 w-[44px] flex justify-center">
                <span className="text-2xl">{item.icon}</span>
              </div>

              {/* Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {item.time}
                  </span>
                  <span className="font-semibold text-gray-800">{item.title}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekday chips */}
      <div className="pt-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Applies to</h3>
        <div className="flex flex-wrap gap-2">
          {weekdays.map((d) => (
            <span
              key={d}
              className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
