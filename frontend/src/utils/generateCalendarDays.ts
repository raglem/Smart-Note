export default function generateCalendarDays(month: number, year: number): (Date | null)[] {
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const days: (Date | null)[] = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
  
    return days;
}
  