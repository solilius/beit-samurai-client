import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { styled } from 'styled-components';
import BookingComponent from './Components/Booking';
import BookingForm from './Components/BookingForm'; // The form page component
import './App.css';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5; /* Light background to resemble traditional Japanese paper */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TitleImage = styled.img`
  width: 100vw;
`;

const App: React.FC = () => {
  return (
    <Router>
      <TitleImage src='/beit-samurai.jpg' />
      <Container>
        <Routes>
          <Route path="/booking" element={<BookingComponent />} />
          <Route path="/form" element={<BookingForm />} />
          <Route path="/" element={<BookingComponent />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;