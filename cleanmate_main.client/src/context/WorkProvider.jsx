import { createContext, useState } from 'react';
import useAuth from '../hooks/useAuth';
export const WorkContext = createContext();

const WorkProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [selectedWork, setSelectedWork] = useState(null);
    const [open, setOpen] = useState(false);
    const { user } = useAuth()

    const handleOpen = async (bookingId) => {
        try {
            const response = await fetch(`/worklist/${bookingId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`HTTP error! status: ${response.status}, response: ${text}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const workDetail = await response.json();
            setSelectedWork(workDetail);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching work detail:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedWork(null);
    };

    return <WorkContext.Provider value={{
        data,
        setData,
        selectedWork,
        setSelectedWork,
        handleOpen,
        handleClose,
        open,
    }}>{children}</WorkContext.Provider>
}

export default WorkProvider;