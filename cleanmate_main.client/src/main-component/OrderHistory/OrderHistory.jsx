import Navbar from "../../components/Navbar/Navbar";
import OrderHistorySection from "../../components/OrderHistorySection/OrderHistorySection";
import Footer from "../../components/footer/Footer";
import Scrollbar from "../../components/scrollbar/scrollbar";

const OrderHistory = () => {
    return (
        <>
            <Navbar />
            <OrderHistorySection />
            <Footer />
            <Scrollbar />
        </>
    )
}

export default OrderHistory;