import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";
import NoRatingSection from "../../components/NoRatingSection/NoRatingSection";
import Footer from "../../components/footer/Footer";
import Scrollbar from "../../components/scrollbar/scrollbar";
import useAuth from "../../hooks/useAuth";

const NoRating = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        const role = user?.roles?.[0];// Nếu là Cleaner thì return về trang public-work
        if (role === 'Cleaner') {
            toast.error("Bạn không có quyền truy cập trang này")
            navigate('/public-work');
        }
    }, [user, loading, navigate]);
    return (
        <>
            <Navbar />
            <NoRatingSection />
            <Footer />
            <Scrollbar />
        </>
    )
}

export default NoRating;