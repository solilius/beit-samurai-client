import React from 'react';
import { useLocation } from 'react-router-dom';

type LocationState = {
    people?: number;
    start?: string,
    end?: string,
};

const BookingForm: React.FC = () => {
    const location = useLocation();
    // const { people, start, end } = location?.state as LocationState;

    const redirectToWA = () => {
        console.log('asd');
        const phoneNumber = '+972508725344'; // Replace with the actual number
        const message = 'Hello, I\'m interested in your services.';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // To redirect:
        window.location.href = url
    }
    return (
        <div>
            <h1>Form Page</h1>
            <form>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <br />
            </form>
                <button onClick={() => redirectToWA()}>Submit</button>
        </div>
    );
};

export default BookingForm;