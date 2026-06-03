/**
 * Utility helper functions for managing calendar computations in clinical schedulers.
 */

export function generateCalendarDays(calendarYear, calendarMonth) {
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const startOffsetDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const daysArr = [];

  const prevMonthTotal = new Date(calendarYear, calendarMonth, 0).getDate();
  for (let i = startOffsetDay - 1; i >= 0; i--) {
    const prevMonthDay = prevMonthTotal - i;
    const prevY = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    const prevM = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const mStr = String(prevM + 1).padStart(2, "0");
    const dStr = String(prevMonthDay).padStart(2, "0");
    daysArr.push({
      dateString: `${prevY}-${mStr}-${dStr}`,
      dayNum: prevMonthDay,
      isCurrentMonth: false
    });
  }

  for (let d = 1; d <= totalDays; d++) {
    const mStr = String(calendarMonth + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    daysArr.push({
      dateString: `${calendarYear}-${mStr}-${dStr}`,
      dayNum: d,
      isCurrentMonth: true
    });
  }

  const rem = 42 - daysArr.length;
  for (let n = 1; n <= rem; n++) {
    const nextY = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
    const nextM = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const mStr = String(nextM + 1).padStart(2, "0");
    const dStr = String(n).padStart(2, "0");
    daysArr.push({
      dateString: `${nextY}-${mStr}-${dStr}`,
      dayNum: n,
      isCurrentMonth: false
    });
  }

  return daysArr;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
