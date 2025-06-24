import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
export const WorkContext = createContext();

const WorkProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [selectedWork, setSelectedWork] = useState(null);
    const [open, setOpen] = useState(false);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

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
    const refetchWorkList = async () => {
        try {
            const response = await fetch('/worklist?status=1', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const workItems = await response.json();
                setData(workItems); // Update the work list
            } else {
                throw new Error('Failed to fetch work list');
            }
        } catch (error) {
            console.error('Error fetching work list:', error);
        }
    };
    const handleAcceptWork = async () => {
        try {
            const response = await fetch(`/worklist/${selectedWork.bookingId}/accept`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `Lỗi HTTP! Trạng thái: ${response.status}`);
            }

            if (result.success) {
                toast.success("Công việc đã được nhận thành công!");
                handleClose();
                await refetchWorkList();
            } else {
                toast.error(result.message || "Không thể nhận công việc.");
            }
        } catch (error) {
            console.error('Lỗi nhận công việc:', error);
            toast.error(error.message || "Đã xảy ra lỗi khi nhận công việc.");
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedWork(null);
    };

    const getCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/customerlist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCustomers();
    }, [getCustomers])

    return <WorkContext.Provider value={{
        data,
        setData,
        selectedWork,
        setSelectedWork,
        handleOpen,
        handleClose,
        open,
        handleAcceptWork,
        openFeedback,
        setOpenFeedback,
        customers,
        setCustomers,
        loading,
        setLoading,
        getCustomers
    }}>{children}</WorkContext.Provider>
}

export default WorkProvider;