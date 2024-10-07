import ReactDOM from 'react-dom/client'; // Updated import
import App from './App';
import { BookingProvider } from './BookingContext';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!); // Create root

root.render(
    <BookingProvider>
      <App />
    </BookingProvider>
);