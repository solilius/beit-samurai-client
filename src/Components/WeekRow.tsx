import React, { useEffect, useMemo, useState } from 'react';
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

const Spinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #5d718c; /* Dark blue color */
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin-bottom: 4px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TableCell = styled.td<{ $backgroundColor: string; $isClickable: boolean }>`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border: solid 1px #ddd;
  width12.5vw;
  height: min(12.5vw, 50px);
  text-align: center;
  vertical-align: top;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
  opacity: ${({ $isClickable }) => ($isClickable ? 1 : 0.5)};
  transition: background-color 0.3s ease;
`;

const CellContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DateNumber = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  color: #2d4059; /* Dark blue for the date number */
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const AvailableSlots = styled.span`
  font-size: 0.6rem;
  color: #4e9f3d;
  align-self: center;
  margin-top: auto;
  margin-bottom: 3px;
`;

const WeekRow: React.FC<WeekRowProps> = ({ week, people, month, handleDateClick, isDateInRange }) => {
  const { bookingData, getBookingData } = useBooking();
  const [isLoading, setIsLoading] = useState(true);
  const startOfWeek = week[0];
  const formattedWeek = startOfWeek.format('DD-MM-YY');
  const weekData = bookingData[formattedWeek];

  useEffect(() => {
    const fetchData = async () => {
      if (!weekData) {
        setIsLoading(true);
        await getBookingData(startOfWeek.toDate());
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [startOfWeek, weekData, getBookingData]);

  const getBackgroundColor = (isInRange: boolean, isAvailable: boolean, isInMonth: boolean, isLoading: boolean) => {
    if (!isInMonth) {
      return 'transparent';
    }
    if (isLoading) {
      return '#ffffff'; // Default to white while loading
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
      const slots = weekData ? weekData[formattedDate] : undefined;
      const isAvailable = slots !== undefined && slots >= people;
      const isInRange = isDateInRange(day);
      const backgroundColor = getBackgroundColor(isInRange, isAvailable, isInMonth, isLoading);

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
          $backgroundColor={dayInfo.backgroundColor}
          $isClickable={!dayInfo.isPlaceholder}
          onClick={!dayInfo.isPlaceholder ? () => handleDateClick(dayInfo.date) : undefined}
        >
          {!dayInfo.isPlaceholder && (
            <CellContent>
              <DateNumber>{dayInfo.date.format('D')}</DateNumber>
              { isLoading ? (
                <Spinner /> 
              ) : (
                <AvailableSlots>{dayInfo.availableSlots} מיטות</AvailableSlots>
              )}
            </CellContent>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default WeekRow;