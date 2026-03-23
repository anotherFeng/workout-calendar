export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Pad start with previous month days (Mon=0 start)
  let startDow = firstDay.getDay();
  // Convert Sunday=0 to Monday-start: Mon=0, Tue=1, ..., Sun=6
  startDow = startDow === 0 ? 6 : startDow - 1;

  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: formatDate(d), inMonth: false });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: formatDate(new Date(year, month, d)), inMonth: true });
  }

  // Pad end to fill 6 rows (42 cells) or at least complete the week
  while (days.length % 7 !== 0) {
    const nextDate = new Date(year, month + 1, days.length - lastDay.getDate() - startDow + 1);
    days.push({ date: formatDate(nextDate), inMonth: false });
  }

  return days;
}

export function getWeekNumber(startDate, currentDate) {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const diffMs = current - start;
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export function isToday(dateStr) {
  return dateStr === formatDate(new Date());
}

export function getMonthLabel(year, month) {
  return new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
}
