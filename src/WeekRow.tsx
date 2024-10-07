import React, { useEffect, useMemo } from 'react';
import moment from 'moment';
import { useBooking } from './BookingContext';

type WeekRowProps = {
  week: moment.Moment[];
  month: moment.Moment;
  people: number;
  handleDateClick: (date: moment.Moment) => void;
  isDateInRange: (date: moment.Moment) => boolean;
};

type DayInfo = {
  date: moment.Moment;
  displyedDate: string;
  backgroundColor: string;
  isClickable: boolean;
  availableSlots: number | undefined;
  isAvailable: boolean;
};

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

  const getBackgroundColor = (isInRange: boolean, isLowSlots: boolean, isInMonth: boolean) => {
    if (!isInMonth) {
      return 'transparent';
    }
    return isInRange ? 'blue' : isLowSlots ? 'red' : 'grey';
  };

  const daysInfo: DayInfo[] = useMemo(() => {
    return week.map((sunday, dayIndex) => {
      const day = sunday.clone().add(dayIndex, 'day');
      const isInMonth = day.month() === month.month();
      const formattedDate = day.clone().add(dayIndex, 'day').format('DD/MM/YY');
      const slots = weekData ? weekData[formattedDate] : undefined;
      const isLowSlots = slots !== undefined && slots < people;
      const isInRange = isDateInRange(day);
      const backgroundColor = getBackgroundColor(isInRange, isLowSlots, isInMonth);

      return {
        date: day.clone(),
        displyedDate: isInMonth ? day.clone().format('D') : '',
        backgroundColor,
        isClickable: isInMonth,
        availableSlots: slots,
        isAvailable: slots !== undefined && slots >= people,
      };
    });
  }, [week, weekData, people, isDateInRange]);

  return (
    <tr>
      {daysInfo.map((dayInfo, index) => (
        <td
          key={index}
          style={{ backgroundColor: dayInfo.backgroundColor }}
          onClick={dayInfo.isClickable ? () => handleDateClick(dayInfo.date) : undefined}
        >
          {dayInfo.displyedDate}
        </td>
      ))}
    </tr>
  );
};

export default WeekRow;