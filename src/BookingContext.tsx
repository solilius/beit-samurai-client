import React, { createContext, useContext, useState, ReactNode } from 'react';
import moment from 'moment';

type WeeklyBooking = { [key: string]: number };
type BookingData = { [key: string]: WeeklyBooking };

type BookingContextType = {
  bookingData: BookingData;
  getBookingData: (date: Date) => Promise<WeeklyBooking>;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

type BookingProviderProps = {
  children: ReactNode;
};

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>({});

  const fetchBookingData = async (weekDate: string): Promise<void> => {
    const response = await fetch(`http://localhost:3005/available-beds/${weekDate}`);
    const data = await response.json();
  
    // Save all dates returned in the data object
    setBookingData((prevData) => ({
      ...prevData,
      [weekDate]: data,
    }));
  };

  const getBookingData = async (weekDate: Date): Promise<WeeklyBooking> => {
    const formattedDate = moment(weekDate).format('DD-MM-YY');
    if (!bookingData[formattedDate]) {
      await fetchBookingData(formattedDate);
    }
    return bookingData[formattedDate];
  };

  return (
    <BookingContext.Provider value={{ bookingData, getBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};