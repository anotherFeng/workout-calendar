import { Routes, Route, NavLink } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'
import ReportPage from './pages/ReportPage'
import SettingsPage from './pages/SettingsPage'

const navItems = [
  { to: '/', label: 'Calendar', icon: '📅' },
  { to: '/report', label: 'Report', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">
            <span className="hidden sm:inline">Workout Calendar</span>
            <span className="sm:hidden">🏋️</span>
          </h1>
          <div className="flex gap-1">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`
                }
              >
                <span className="sm:hidden">{icon}</span>
                <span className="hidden sm:inline">{icon} {label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-3 border-t border-gray-100">
        Workout Calendar Tracker
      </footer>
    </div>
  )
}
