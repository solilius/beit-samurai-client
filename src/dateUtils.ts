import moment from 'moment';

export const getWeeksInMonth = (month: moment.Moment) => {
  const startOfMonth = month.clone().startOf('month');
  const endOfMonth = month.clone().endOf('month');
  const weeks = [];

  // Adjust the start to the beginning of the week that includes the first day of the month.
  let currentDay = startOfMonth.clone().startOf('week');

  while (currentDay.isBefore(endOfMonth) || currentDay.isSame(endOfMonth)) {
    const week = Array(7)
      .fill(null)
      .map(() => currentDay.clone());
    weeks.push(week);
    currentDay.add(1, 'week');
  }

  return weeks;
};