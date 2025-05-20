import { createContext, useState } from 'react';

export const BookingContext = createContext();

const BookingProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return <BookingContext.Provider value={{ open, handleOpen, handleClose }}>{children}</BookingContext.Provider>
}

export default BookingProvider;