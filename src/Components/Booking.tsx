import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import WeekRow from './WeekRow';
import { useBooking } from '../BookingContext';

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5; /* Light background to resemble traditional Japanese paper */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TitleImage = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 30vw;
`;

const CalendarContainer = styled.div`
  margin: 20px 0;
`;

const Button = styled.button<{ primary?: boolean }>`
  background-color: ${({ primary }) => (primary ? '#4e9f3d' : '#dddddd')};
  color: ${({ primary }) => (primary ? '#ffffff' : '#333')};
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ primary }) => (primary ? '#3e8f32' : '#cccccc')};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const PeopleInput = styled.input`
  width: 10%;
  padding: 10px;
  margin: 10px 0;
  margin-top: 30vw;
  border-radius: 4px;
  border: 1px solid #dddddd;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const BookingComponent: React.FC = () => {
  const navigate = useNavigate();
  const { bookingData } = useBooking();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [people, setPeople] = useState<number>(1);
  const [isBookingAvailable, setIsBookingAvailable] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<{ start: moment.Moment | null, end: moment.Moment | null }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    setIsBookingAvailable(!!selectedRange.start && !!selectedRange.end && checkAvailability());
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
  };

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

  const navigateToForm = () => {
    navigate('/form', {
      state: {
        people,
        start: selectedRange.start!.format('YYYY/MM/DD'),
        end: selectedRange.end!.format('YYYY/MM/DD'),
      },
    });
  };

  const renderCalendar = (month: moment.Moment) => {
    const weeks = getWeeksInMonth(month);

    return (
      <CalendarContainer>
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
      </CalendarContainer>
    );
  };

  return (
    <Container>
      <TitleImage src='/beit-samurai.jpg' />
        <span>Number of People: &nbsp;&nbsp;</span> 
        <PeopleInput
          type="number"
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          min="1"
          max="15"
          placeholder="Number of People"
        />


      <ButtonGroup>
        <Button onClick={handlePreviousMonth}>Previous Month</Button>
        <Button onClick={handleNextMonth}>Next Month</Button>
      </ButtonGroup>

      <h3>{currentMonth.format('MMMM YYYY')}</h3>
      {renderCalendar(currentMonth)}

      <h3>{currentMonth.clone().add(1, 'month').format('MMMM YYYY')}</h3>
      {renderCalendar(currentMonth.clone().add(1, 'month'))}

      <Button
        primary={isBookingAvailable}
        onClick={() => isBookingAvailable && navigateToForm()}
        disabled={!isBookingAvailable}
      >
        Next
      </Button>
    </Container>
  );
};

export default BookingComponent;

const getWeeksInMonth = (month: moment.Moment) => {
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