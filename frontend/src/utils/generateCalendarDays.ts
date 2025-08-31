function generateCalendarDays(month: number, year: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
  
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();
  
    const days: (Date | null)[] = [];
  
    // for (let i = 0; i < startWeekday; i++) {
    //   days.push(null);
    // }
  
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
  
    return days;
  }
  