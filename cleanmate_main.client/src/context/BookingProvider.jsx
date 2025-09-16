
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
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const { user, loading: authLoading, refreshAuth } = useAuth();
    const role = user?.roles?.[0] || '';

    const getVouchers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/customervoucher/available', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setVouchers(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }, [setVouchers])


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
        getVouchers();
        fetchNoRatingBooking();
    }, [fetchNoRatingBooking, getVouchers])

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
                refreshAuth, // Thêm refreshAuth vào context để sử dụng ở nơi khác,
                vouchers,
                setVouchers,
                getVouchers,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export default BookingProvider;