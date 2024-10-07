import React, { useState } from 'react';
import moment from 'moment';
import WeekRow from './WeekRow';
import { getWeeksInMonth } from './dateUtils';

const BookingComponent: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [people, setPeople] = useState<number>(1);

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  };

  const renderCalendar = (month: moment.Moment) => {
    const weeks = getWeeksInMonth(month);

    return (
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <WeekRow 
              key={weekIndex} 
              week={week} 
              people={people} 
            />
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <label htmlFor="people">Number of People:</label>
      <input
        type="number"
        id="people"
        value={people}
        onChange={(e) => setPeople(Number(e.target.value))}
        min="1"
      />

      <div>
        <button onClick={handlePreviousMonth}>Previous Month</button>
        <button onClick={handleNextMonth}>Next Month</button>
      </div>

      <h2>{currentMonth.format('MMMM YYYY')}</h2>
      {renderCalendar(currentMonth)}

      <h2>{currentMonth.clone().add(1, 'month').format('MMMM YYYY')}</h2>
      {renderCalendar(currentMonth.clone().add(1, 'month'))}
    </div>
  );
};

export default BookingComponent;