import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { styled } from 'styled-components';
import moment from 'moment';
import 'moment/locale/he';
import { Analytics } from "@vercel/analytics/react"
import BookingComponent from './Components/Booking';
import BookingForm from './Components/BookingForm'; // The form page component
import './App.css';

moment.locale('he');

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const RouterContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5; /* Light background to resemble traditional Japanese paper */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  direction: rtl;
`;

const TitleImage = styled.img`
  width: 100vw;
    max-width: 600px;
`;

const App: React.FC = () => {
  return (
    <Router>
      <Analytics/>
      <Container>
        <TitleImage src='/beit-samurai.jpg' />
        <RouterContainer>
          <Routes>
            <Route path="/booking" element={<BookingComponent />} />
            <Route path="/form" element={<BookingForm />} />
            <Route path="/" element={<BookingComponent />} />
          </Routes>
        </RouterContainer>
      </Container>
    </Router>
  );
};

export default App;