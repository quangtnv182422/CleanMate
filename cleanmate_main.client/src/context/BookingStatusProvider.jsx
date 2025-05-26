import { createContext, useState, useEffect } from 'react';

export const BookingStatusContext = createContext();

const BookingStatusProvider = ({ children }) => {
    const [statusList, setStatusList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingStatuses = async () => {
            try {
                const response = await fetch('/bookingstatus', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const statuses = await response.json();
                const formattedStatuses = statuses.map(status => ({
                    id: status.id || status.statusId,
                    name: status.name || status.statusName || status.toString(),
                }));
                setStatusList(formattedStatuses);
            } catch (error) {
                console.error('Error fetching booking statuses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingStatuses();
    }, []);

    return (
        <BookingStatusContext.Provider value={{ statusList, loading }}>
            {children}
        </BookingStatusContext.Provider>
    );
};

export default BookingStatusProvider;