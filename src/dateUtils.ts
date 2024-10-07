import moment from 'moment';

export const getWeeksInMonth = (month: moment.Moment) => {
  const startOfMonth = month.clone().startOf('month').startOf('week'); // First Sunday before or on the 1st
  const endOfMonth = month.clone().endOf('month').endOf('week'); // Last Saturday after or on the last day
  const weeks = [];

  let currentDay = startOfMonth.clone();
  while (currentDay.isBefore(endOfMonth) || currentDay.isSame(endOfMonth)) {
    const week = Array(7).fill(null).map(() => currentDay.clone());
    weeks.push(week);
    currentDay.add(1, 'week');
  }

  return weeks;
};