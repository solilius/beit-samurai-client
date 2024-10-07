import React, { useEffect, useMemo } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { useBooking } from '../BookingContext';

type WeekRowProps = {
  week: moment.Moment[];
  month: moment.Moment;
  people: number;
  handleDateClick: (date: moment.Moment) => void;
  isDateInRange: (date: moment.Moment) => boolean;
};

type DayInfo = {
  date: moment.Moment;
  backgroundColor: string;
  isPlaceholder: boolean;
  availableSlots: number | undefined;
  isAvailable: boolean;
};

// Styled Components for Day Cells and Rows
const TableRow = styled.tr``;

const TableCell = styled.td<{ backgroundColor: string; isClickable: boolean }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: solid 1px #ddd;
  width: 12.5vw;
  height: 12.5vw;
  text-align: center;
  vertical-align: top;
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};
  opacity: ${({ isClickable }) => (isClickable ? 1 : 0.5)};
  transition: background-color 0.3s ease;
`;

const CellContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center the date number */
  align-items: center; /* Center content horizontally */
`;

const DateNumber = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  color: #2d4059; /* Dark blue for the date number */
  flex-grow: 1; /* Allow it to grow to center vertically */
  display: flex;
  align-items: center; /* Center text vertically */
`;

const AvailableSlots = styled.span`
  font-size: 0.6rem;
  color: #4e9f3d;
  align-self: center; /* Center horizontally */
  margin-top: auto; /* Push it to the bottom */
`;

const WeekRow: React.FC<WeekRowProps> = ({ week, people, month, handleDateClick, isDateInRange }) => {
  const { bookingData, getBookingData } = useBooking();
  const startOfWeek = week[0];
  const formattedWeek = startOfWeek.format('DD-MM-YY');
  const weekData = bookingData[formattedWeek];

  useEffect(() => {
    const fetchData = async () => {
      if (!weekData) {
        await getBookingData(startOfWeek.toDate());
      }
    };
    fetchData();
  }, [startOfWeek, weekData, getBookingData]);

  const getBackgroundColor = (isInRange: boolean, isAvailable: boolean, isInMonth: boolean) => {
    if (!isInMonth) {
      return 'transparent';
    }
    if (isInRange) {
      return isAvailable ? '#a8d5ba' : '#ff7070'; // Light green for available in range, light red for unavailable
    }
    return isAvailable ? '#ffffff' : '#fae3e3'; // White for available, light pink for unavailable
  };

  const daysInfo: DayInfo[] = useMemo(() => {
    return week.map((sunday, dayIndex) => {
      const day = sunday.clone().add(dayIndex, 'day');
      const isInMonth = day.month() === month.month();
      const formattedDate = day.clone().format('DD/MM/YY');
      const slots = weekData ? weekData[formattedDate] : 0;
      const isAvailable = slots >= people;
      const isInRange = isDateInRange(day);
      const backgroundColor = getBackgroundColor(isInRange, isAvailable, isInMonth);

      return {
        date: day.clone(),
        backgroundColor,
        availableSlots: slots,
        isAvailable,
        isPlaceholder: !isInMonth,
      };
    });
  }, [week, weekData, people, isDateInRange]);

  return (
    <TableRow>
      {daysInfo.map((dayInfo, index) => (
        <TableCell
          key={index}
          backgroundColor={dayInfo.backgroundColor}
          isClickable={!dayInfo.isPlaceholder}
          onClick={!dayInfo.isPlaceholder ? () => handleDateClick(dayInfo.date) : undefined}
        >
          {!dayInfo.isPlaceholder && (
            <CellContent>
              <DateNumber>{dayInfo.date.format('D')}</DateNumber>
              <AvailableSlots>{dayInfo.availableSlots} slots</AvailableSlots>
            </CellContent>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default WeekRow;