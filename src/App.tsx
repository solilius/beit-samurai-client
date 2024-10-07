import React from 'react';
import { BookingProvider } from './BookingContext'; // Import the BookingProvider
import BookingComponent from './Booking'; // Import the BookingComponent

const App: React.FC = () => {
  return (
    <BookingProvider>
      <BookingComponent />
    </BookingProvider>
  );
};

export default App;