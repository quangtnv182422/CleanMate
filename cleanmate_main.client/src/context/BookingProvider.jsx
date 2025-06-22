/*import { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
export const BookingContext = createContext();

const BookingProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [houseType, setHouseType] = useState('house');
    const [houseNumber, setHouseNumber] = useState('');
    const [userAddress, setUserAddress] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { user } = useAuth()
    const role = user?.roles?.[0] || '';

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


    const fetchUserAddress = async () => {
        if (!user || role !== "Customer") return;
        setLoading(true);
        try {
            const res = await fetch('/address/get-address', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                setUserAddress(data);
            } else {
                throw new Error('Failed to fetch');
            }
        } catch (error) {
            console.error('Fetch user address error:', error);
        } finally {
            setLoading(false);
        }
    };

    // gọi khi app load
    useEffect(() => {
        if (user && role === "Customer") {
            fetchUserAddress();
        }
    }, [user, role]);

    useEffect(() => {
        if (location.pathname === '/booking-service' && user && role === "Customer") {
            fetchUserAddress();
        }
    }, [location, user, role]);

    return <BookingContext.Provider value={{
        services,
        selectedPlace,
        setSelectedPlace,
        houseType,
        setHouseType,
        houseNumber,
        setHouseNumber,
        userAddress,
        setUserAddress,
        refetchUserAddress: fetchUserAddress,
        loading
    }}>{children}</BookingContext.Provider>
}

export default BookingProvider;*/
import { createContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

export const BookingContext = createContext();


const BookingProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [houseType, setHouseType] = useState('house');
    const [houseNumber, setHouseNumber] = useState('');
    const [userAddress, setUserAddress] = useState([]);
    const [orderLength, setOrderLength] = useState(0);
    const [noRatingOrder, setNoRatingOrder] = useState([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const { user, loading: authLoading, refreshAuth } = useAuth();
    const role = user?.roles?.[0] || '';

    // hàm fetch booking chưa feedback

    const fetchNoRatingBooking = useCallback(async () => {
        try {
            const userId = user?.id;
            const statusId = 6;

            const response = await axios.get('/bookings/get-bookings', {
                params: { userId, statusId }
            });

            if (response.data && Array.isArray(response.data)) {
                const filtered = response.data.filter(
                    booking => booking.hasFeedback === false
                );
                setNoRatingOrder(filtered);
            } else {
                console.warn('Không nhận được danh sách booking hợp lệ');
                setNoRatingOrder([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách booking:", error);
        }
    }, [user?.id, setNoRatingOrder]);

    useEffect(() => {
        fetchNoRatingBooking();
    }, [fetchNoRatingBooking])

    // Fetch services khi component mount
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
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    // Hàm fetch địa chỉ người dùng
    const fetchUserAddress = async () => {
        if (!user || role !== 'Customer') {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/address/get-address', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                setUserAddress(data);
            } else {
                throw new Error(`Failed to fetch address with status: ${res.status}`);
            }
        } catch (error) {
            console.error('Fetch user address error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch địa chỉ khi user thay đổi hoặc authLoading hoàn tất
    useEffect(() => {
        if (!authLoading && user && user.roles?.includes('Customer') && location.pathname === '/booking-service') {
            fetchUserAddress();
        }
    }, [authLoading, user, location.pathname]);

    return (
        <BookingContext.Provider
            value={{
                noRatingOrder,
                user,
                authLoading,
                services,
                selectedPlace,
                setSelectedPlace,
                houseType,
                setHouseType,
                houseNumber,
                setHouseNumber,
                userAddress,
                setUserAddress,
                refetchUserAddress: fetchUserAddress,
                loading,
                fetchNoRatingBooking,
                refreshAuth, // Thêm refreshAuth vào context để sử dụng ở nơi khác
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export default BookingProvider;