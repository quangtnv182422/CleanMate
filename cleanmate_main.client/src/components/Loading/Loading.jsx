import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'linear-gradient(to bottom, #e3f2fd, #ffffff)',
                background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
                textAlign: 'center',
                px: 2,
            }}
        >
            <CircularProgress
                size={70}
                thickness={5}
                sx={{ color: '#1976d2' }}
            />
            <Typography
                variant="h5"
                sx={{
                    mt: 3,
                    color: '#424242',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                }}
            >
                Đang xử lý...
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    mt: 1,
                    color: '#757575',
                    maxWidth: 300,
                }}
            >
                Vui lòng chờ trong giây lát. Hệ thống đang thực hiện yêu cầu của bạn.
            </Typography>
        </Box>
    );
};

export default Loading;
