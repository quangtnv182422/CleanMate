import { useContext, useState } from 'react';
import { WorkContext } from '../../context/WorkProvider';
import { Box, Typography, Button } from '@mui/material';    
const EmployeeWorkDetails = () => {
    const { selectedWork, handleClose, handleAcceptWork } = useContext(WorkContext);
    console.log(selectedWork)
    return (
        <Box sx={style.modal}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5">{selectedWork.serviceName}</Typography>
                <Typography variant="body2" sx={style.lightGray}>
                    Bắt đầu lúc: <span style={style.time}>{selectedWork.startTime} </span>ngày<span style={style.time}>  {selectedWork.date}</span>
                </Typography>
            </Box>
            <Box sx={style.mainContent}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={style.lightGray}>Làm trong:</Typography>
                    <Typography variant="h5" sx={{ color: '#FBA500' }}>{selectedWork.duration}</Typography>
                    <Typography variant="body1">{selectedWork.serviceDescription}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={style.lightGray}>Số tiền:</Typography>
                    <Typography variant="h5" sx={{ color: '#FBA500' }}>{selectedWork.price}</Typography>
                    <Typography variant="body1"> Hoa hồng: {selectedWork.commission}</Typography>
                </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography sx={style.lightGray}>Số điện thoại: <strong style={style.fontBlack}>{selectedWork.customerPhoneNumber}</strong></Typography>
                <Typography sx={style.lightGray}>Tại: <strong style={style.fontBlack}>{selectedWork.address}</strong></Typography>
                <Typography sx={style.lightGray}>Ghi chú: <strong style={style.fontBlack}>{selectedWork.note}</strong></Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="outlined" color='error' onClick={handleClose}>Từ chối</Button>
                <Button variant="outlined">Google Maps</Button>
                <Button
                    variant="contained"
                    sx={style.confirmButton}
                    onClick={handleAcceptWork}
                >
                    Nhận việc
                </Button>
            </Box>
        </Box>
    )
}

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
}

export default EmployeeWorkDetails;