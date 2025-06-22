import { useContext, useState, useEffect } from 'react';
import { WorkContext } from '../../context/WorkProvider';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Box, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const EmployeeWorkDetails = () => {
    const { selectedWork, handleClose, handleAcceptWork, setData } = useContext(WorkContext);
    const [connection, setConnection] = useState(null);
    const { user } = useAuth();

    // Set up SignalR connection
    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('/workHub') // Adjust to your backend hub URL
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    }, []);

    // Start connection and listen for updates
    useEffect(() => {
        if (connection) {
            connection.start()
                .catch(err => console.error('SignalR Connection Error: ', err));

            connection.on('ReceiveWorkUpdate', (employeeId) => {
                if (employeeId === user?.id) { // Replace 'user.id' with actual employee ID from context/props
                    fetchWorkList();
                }
            });

            return () => {
                connection.off('ReceiveWorkUpdate');
                connection.stop();
            };
        }
    }, [connection]);

    // Fetch updated work list
    const fetchWorkList = async () => {
        try {
            const response = await fetch('/worklist?status=1', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const workItems = await response.json();
                setData(workItems); // Update context with new data
            }
        } catch (error) {
            console.error('Error fetching work list:', error);
        }
    };

    // Handle work acceptance with toast notifications
    const onAcceptWork = async () => {
        try {
            await handleAcceptWork();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi nhận công việc.");
        }
    };

    return (
        <Box sx={style.modal}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5">{selectedWork?.serviceName}</Typography>
                <Typography variant="body2" sx={style.lightGray}>
                    Bắt đầu lúc: <span style={style.time}>{selectedWork?.startTime}</span> ngày <span style={style.time}>{selectedWork?.date}</span>
                </Typography>
            </Box>
            <Box sx={style.mainContent}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={style.lightGray}>Làm trong:</Typography>
                    <Typography variant="h5" sx={{ color: '#FBA500' }}>{selectedWork?.duration}</Typography>
                    <Typography variant="body1">{selectedWork?.serviceDescription}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={style.lightGray}>Số tiền:</Typography>
                    <Typography variant="h5" sx={{ color: '#FBA500' }}>{selectedWork?.price}</Typography>
                    <Typography variant="body1">Hoa hồng: {selectedWork?.commission}</Typography>
                </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography sx={style.lightGray}>Khách hàng: <strong style={style.fontBlack}>{selectedWork?.customerFullName}</strong></Typography>
                <Typography sx={style.lightGray}>Số điện thoại: <strong style={style.fontBlack}>{selectedWork?.customerPhoneNumber}</strong></Typography>
                <Typography sx={style.lightGray}>Số nhà: <strong style={style.fontBlack}>{selectedWork?.addressNo}</strong></Typography>
                <Typography sx={style.lightGray}>Tại: <strong style={style.fontBlack}>{selectedWork?.address}</strong></Typography>
                <Typography sx={style.lightGray}>Ghi chú: <strong style={style.fontBlack}>{selectedWork?.note ? selectedWork?.note : "Không có ghi chú"}</strong></Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="outlined" color="error" onClick={handleClose}>Đóng</Button>
                <Button variant="contained" sx={style.confirmButton} onClick={onAcceptWork}>
                    Nhận việc
                </Button>
            </Box>
        </Box>
    );
};

const style = {
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: '5px',
        p: 2,

        '@media (max-width: 400px)': {
            width: 380,
        },

        '@media (max-width: 380px)': {
            width: 360,
        },

        '@media (max-width: 360px)': {
            width: 340,
        },

        '@media (max-width: 345px)': {
            width: 330,
        }
    },
    mainContent: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '16px',
        p: 1,
    },
    confirmButton: {
        backgroundColor: '#1565C0',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#1565C0',
            color: '#fff',
        },
    },
    lightGray: {
        color: "#969495"
    },
    fontBlack: {
        color: '#000',
    },
    time: {
        color: '#FBA500',
        fontSize: '18px'
    },
};

export default EmployeeWorkDetails;