import React, { useEffect } from 'react';
import moment from 'moment';
import { useBooking } from './BookingContext';

type WeekRowProps = {
  week: moment.Moment[]; // Array representing the 7 days of the week
  people: number;
};

const WeekRow: React.FC<WeekRowProps> = ({ week, people }) => {
  const { bookingData, getBookingData } = useBooking();

  const startOfWeek = week[0]; // The first day (Sunday) of the week
  const formattedWeek = startOfWeek.format('DD-MM-YY');
  const weekData = bookingData[formattedWeek]; // Get the week's data from the context

  // Fetch the data for the entire week if it hasn't been fetched yet
  useEffect(() => {
    const fetchData = async () => {
      if (!weekData) {
        await getBookingData(startOfWeek.toDate()); // Call the async function
      }
    };

    fetchData(); // Call the inner async function
  }, [startOfWeek, weekData, getBookingData]);
  console.log(people);
  return (
    <tr>
      {week.map((day, dayIndex) => {
        const formattedDate = day.add(dayIndex, 'day').format('DD/MM/YY');
        const slots = weekData ? weekData[formattedDate] : undefined;
        const isLowSlots = slots !== undefined && slots < people;

        return (
          <td 
            key={dayIndex} 
            style={{ backgroundColor: isLowSlots ? 'red' : 'transparent' }}
          >
            {day.format('D')}
          </td>
        );
      })}
    </tr>
  );
};

export default WeekRow;