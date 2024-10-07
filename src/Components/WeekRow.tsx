import React, { useEffect, useMemo } from 'react';
import moment from 'moment';
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
      return isAvailable ? 'blue' : 'lightblue';
    }
    return isAvailable ? 'white' : 'red';
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
        isAvailable: slots >= people,
        isPlaceholder: !isInMonth,
      };
    });
  }, [week, weekData, people, isDateInRange]);

  return (
    <tr>
      {daysInfo.map((dayInfo, index) => (
        <td
          key={index}
          style={ {
            backgroundColor: dayInfo.backgroundColor,
            border: dayInfo.isPlaceholder ? '' : 'solid 1px black',
            width: '100px',
          }}
          onClick={!dayInfo.isPlaceholder ? () => handleDateClick(dayInfo.date) : undefined}
        >
          <h3>{!dayInfo.isPlaceholder && dayInfo.date.format('D')} </h3>
          <span>{!dayInfo.isPlaceholder && dayInfo.availableSlots} </span>
        </td>
      ))}
    </tr>
  );
};

export default WeekRow;