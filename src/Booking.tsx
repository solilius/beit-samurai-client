import React, { useEffect, useState } from 'react';
import moment from 'moment';
import WeekRow from './WeekRow';
import { getWeeksInMonth } from './dateUtils';
import { useBooking } from './BookingContext';

const BookingComponent: React.FC = () => {
  const { bookingData } = useBooking();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [people, setPeople] = useState<number>(1);
  const [isBookingAvailable, setIsBookingAavilable] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<{ start: moment.Moment | null, end: moment.Moment | null }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    setIsBookingAavilable(!!selectedRange.start && !!selectedRange.end && checkAvailability);
  }, [selectedRange]);
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  };

  const handleDateClick = (date: moment.Moment) => {
    const { start, end } = selectedRange;
    if (!start) {
      setSelectedRange({ start: date, end: null });
    } else if (start.isSame(date)) {
      setSelectedRange({ start: null, end: null });
    } else if (start && !end) {
      if (date.isAfter(start)) {
        setSelectedRange({ start, end: date });
      } else {
        setSelectedRange({ start: date, end: null });
      }
    } else {
      setSelectedRange({ start: date, end: null });
    }
  }

const isDateInRange = (date: moment.Moment) => {
  const { start, end } = selectedRange;
  return date.isSameOrAfter(start) && date.isSameOrBefore(end || start);
};

  const checkAvailability = () => {
    const { start, end } = selectedRange;
    if (!start || !end) return false;

    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      const weekData = bookingData[current.clone().startOf('week').format('DD-MM-YY')];
      const formattedDate = current.format('DD/MM/YY');
      const slots = weekData ? weekData[formattedDate] : 0;
      if (slots < people) {
        return false;
      }
      current.add(1, 'day');
    }
    return true;
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
              month={month}
              people={people}
              handleDateClick={handleDateClick}
              isDateInRange={isDateInRange}
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

      <button style={{ backgroundColor: isBookingAvailable ? 'green' : 'grey' }} onClick={() => isBookingAvailable ?? alert('next')}>
        Next
      </button>
    </div>
  );
};

export default BookingComponent;