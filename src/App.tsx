import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingComponent from './Components/Booking';
import BookingForm from './Components/BookingForm'; // The form page component
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/booking" element={<BookingComponent />} />
        <Route path="/form" element={<BookingForm />} />
        <Route path="/" element={<BookingComponent />} />
      </Routes>
    </Router>
  );
};

export default App;