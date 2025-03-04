import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { config } from '../config';

enum Gender {
    Male = "זכר",
    Female = "נקבה",
}

type LocationState = {
    people?: number;
    start?: string;
    end?: string;
};

type GuestInfo = {
    name: string;
    gender: Gender | '';
};


const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const DatesContainer = styled.div`
    direction: ltr;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const Label = styled.label`
    flex-shrink: 0;
`;

const Input = styled.input`
    flex-grow: 1;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

const Select = styled.select`
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

const CheckboxSection = styled.label`
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    input[type="checkbox"] {
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
        accent-color: green; /* Sets checkbox color */
    }
`;

const CheckboxText = styled.span`
    flex-grow: 1;
    white-space: nowrap;
`;

const Button = styled.button`
    width: 100px;
    padding: 10px 20px;
    background-color: ${({ disabled }) => (disabled ? 'grey' : 'green')};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    margin-top: 50px;
`;

const SendButtonContainer = styled.div`
  direction: ltr;
  display: flex;
  justify-content: flex-start; /* Aligns button to the left */
  margin-top: 10px;
  width: 100%;
`;

const Note = styled.p`
    color: grey;
    font-size: 12px;
`;

const BookingForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { people = 1, start, end } = location.state as LocationState || {};

    useEffect(() => {
        if (!location.state || !people || !start || !end) {
            navigate('/booking');
        }
    }, [location.state, navigate, people, start, end]);

    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [guests, setGuests] = useState<GuestInfo[]>(Array(people).fill({ name: '', gender: '' }));
    const [isGenderSpecificRoom, setIsGenderSpecificRoom] = useState<boolean>(false);

    const handleGuestChange = (index: number, field: 'name' | 'gender', value: string) => {
        setGuests((prevGuests) =>
            prevGuests.map((guest, i) =>
                i === index ? { ...guest, [field]: value } : guest
            )
        );
    };

    const redirectToWA = () => {
        const guestsDetails = guests
            .map((guest, index) => `${index + 1}. ${guest.name} (${guest.gender.charAt(0)})`)
            .join('\n');
        const message = `Shalom! I would like to book *${people}* beds\n`
            + `from *${start}* to *${end}*\n`
            + `*Phone Number:* ${phoneNumber}\n`
            + `${guestsDetails}\n`
            + `*Gender specific room:* ${isGenderSpecificRoom ? 'Yes' : 'No'}`

        const url = `https://wa.me/${config.phoneNumberToSend}?text=${encodeURIComponent(message)}`;
        window.location.href = url;
        console.log("Form sent to WA");
    };

    return (
        <>
            <DatesContainer>
                <h2>{start} - {end}</h2>
            </DatesContainer>
            <br />

            <Label>
                טלפון:
                <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </Label>
            <br />
            <h3>פרטי האורחים:</h3>
            {guests.map((guest, index) => (
                <Row key={index}>
                    <Label>{index + 1}. שם:</Label>
                    <Input
                        type="text"
                        value={guest.name}
                        onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                        required
                    />
                    <Select
                        value={guest.gender}
                        onChange={(e) => handleGuestChange(index, 'gender', e.target.value)}
                        required
                    >
                        <option value="">בחר  מגדר</option>
                        <option value={Gender.Male}>{Gender.Male}</option>
                        <option value={Gender.Female}>{Gender.Female}</option>
                    </Select>
                </Row>
            ))}
            <br />
            <CheckboxSection>
                <CheckboxText>עדיפות לחדר נפרד לנשים</CheckboxText>
                <input
                    type="checkbox"
                    checked={isGenderSpecificRoom}
                    onChange={(e) => setIsGenderSpecificRoom(e.target.checked)}
                />
            </CheckboxSection>
            <Note>(החדרים בדר''כ מעורבים אך נשתדל להפריד כאשר מתאפשר)</Note>
            <SendButtonContainer>
                <Button
                    onClick={redirectToWA}
                    disabled={!phoneNumber || guests.some(g => !g.name || !g.gender)}
                >
                    שלח
                </Button>
            </SendButtonContainer>
        </>
    );
};

export default BookingForm;