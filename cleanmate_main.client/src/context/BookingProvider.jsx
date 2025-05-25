import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const BookingContext = createContext();

const BookingProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [services, setServices] = useState([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [houseType, setHouseType] = useState('house');
    const [houseNumber, setHouseNumber] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('/cleanservice/all-clean-service'); 
                if (res.status === 200) {
                    setServices(res.data);
                } else {
                    throw new Error('Failed to fetch services');
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        }

        fetchServices();
    }, []);

    return <BookingContext.Provider value={{
        open,
        handleOpen,
        handleClose,
        services,
        selectedPlace,
        setSelectedPlace,
        houseType,
        setHouseType,
        houseNumber,
        setHouseNumber
    }}>{children}</BookingContext.Provider>
}

export default BookingProvider;