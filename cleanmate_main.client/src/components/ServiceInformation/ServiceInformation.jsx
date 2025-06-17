
import { useNavigate, useLocation } from 'react-router-dom';
import { style } from './style';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import ReplayIcon from '@mui/icons-material/Replay';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const privacyList = [
    {
        id: 1,
        title: 'Bảo hành dịch vụ',
        icon: <ReplayIcon sx={style.subHeaderIcon} />
    },
    {
        id: 2,
        title: 'Bảo hiểm hỏng, đổ vỡ',
        icon: <VerifiedUserIcon sx={style.subHeaderIcon} />
    },
    {
        id: 3,
        title: 'Nhân viên tận tâm',
        icon: <HowToRegIcon sx={style.subHeaderIcon} />
    },
    {
        id: 4,
        title: 'Dọn dẹp sạch sẽ',
        icon: <CleaningServicesIcon sx={style.subHeaderIcon} />
    },
    {
        id: 5,
        title: 'Luôn luôn lắng nghe',
        icon: <SupportAgentIcon sx={style.subHeaderIcon} />
    },
]

const regularShift = [
    {
        id: 1,
        title: 'Phòng ngủ',
        task: [
            'Quét và lau sàn',
            'Dọn gọn chăn ga gối',
            'Lau bụi bàn, kệ và tủ',
            'Lau cửa sổ',
            'Đổ rác',
        ],
    },
    {
        id: 2,
        title: 'Phòng tắm',
        task: [
            'Lau chùi bồn rửa mặt và gương',
            'Chà rửa bồn cầu và vòi sen',
            'Lau sàn và tường phòng tắm',
            'Đổ rác và thay túi rác',
            'Thay khăn nếu có yêu cầu',
        ],
    },
    {
        id: 3,
        title: 'Nhà bếp',
        task: [
            'Lau bề mặt bếp và tủ bếp',
            'Rửa và cất chén đĩa',
            'Lau bồn rửa chén',
            'Lau sàn bếp',
            'Đổ rác và thay túi rác',
        ],
    },
    {
        id: 4,
        title: 'Phòng khách & khu vực chung',
        task: [
            'Quét và lau sàn',
            'Lau bàn, ghế và kệ tivi',
            'Sắp xếp gọn gàng đồ đạc',
            'Lau cửa kính và cửa ra vào',
            'Đổ rác',
        ],
    },
];


const ServiceInformation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");


    return (
        <div style={{ position: 'relative' }}>
            <Box sx={style.container}>

                <Box sx={style.header}>
                    <WestIcon sx={style.icon} onClick={() => navigate(-1)} />
                    <Typography sx={style.headerTitle}>{type === "cleaning-per-hour" ? "Dọn dẹp theo giờ" : "Thông tin chi tiết"}</Typography>
                </Box>

                <Box sx={{ px: 1 }}>
                    <Typography variant="body2" sx={style.subHeaderTitle}>Cam kết của chúng tôi</Typography>
                    <Box sx={style.privacyList}>
                        {privacyList.map((item) => (
                            <Box sx={style.privacyItem}>
                                <Box sx={style.privacyIconContainer}>
                                    {item.icon}
                                </Box>
                                <Typography>{item.title}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ px: 1, py: 5, borderBottom: '1px solid #ccc' }}>
                    <Typography variant="body2" sx={style.subHeaderTitle}>Ca làm lẻ</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>1 người làm từ 1 đến 3 tiếng, có công cụ, dụng cụ.</Typography>
                </Box>

                <Box sx={{ px: 1, py: 5, borderBottom: '1px solid #ccc' }}>
                    <Typography variant="body2" sx={style.subHeaderTitle}>Nhân viên cần tuân thủ</Typography>
                    <Box sx={style.ruleContainer}>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Luôn mặc đầy đủ đồng phục, mang đầy đủ công cụ, dụng cụ.</Typography>
                        </Box>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Trao đổi chi tiết với khách hàng trước khi thực hiện công việc.</Typography>
                        </Box>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Mời khách hàng kiểm tra, nghiệm thu kết quả trước khi ra về.</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ px: 1, py: 5, borderBottom: '1px solid #ccc' }}>
                    <Typography variant="body2" sx={style.subHeaderTitle}>Một ca làm thông thường bao gồm</Typography>
                    <Box sx={style.shiftContainer}>
                        <Grid container spacing={2}>
                            {regularShift.map((item) => (
                                <Grid item xs={12} sm={6} md={3} key={item.id}>
                                    <Card variant="outlined" sx={style.taskCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', color: '#1976D2'} }>
                                                {item.title}
                                            </Typography>
                                            <List dense>
                                                {item.task.map((task, idx) => (
                                                    <ListItem key={idx} sx={{ pl: 0 }}>
                                                        <ListItemIcon sx={{ minWidth: '30px' }}>
                                                            <StarIcon sx={{ color: '#FBC11B', fontSize: 20 }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={`${task}`} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                <Box sx={{ px: 1, py: 5, borderBottom: '1px solid #ccc' }}>
                    <Typography variant="body2" sx={style.subHeaderTitle}>Cam kết về chất lượng</Typography>
                    <Box sx={style.ruleContainer}>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Sạch sẽ toàn diện, đúng tiêu chuẩn.</Typography>
                        </Box>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Nhân viên chuyên nghiệp, đúng giờ, đúng quy trình.</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ px: 1, py: 5 }}>
                    <Typography variant="body2" sx={style.subHeaderTitle}>Lưu ý với khách hàng</Typography>
                    <Box sx={style.ruleContainer}>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Kiểm tra kỹ thông tin của nhân viên qua App và trực tiếp với nhân viên khi đến dọn dẹp.</Typography>
                        </Box>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Không giao những việc gây nguy hiểm đến tính mạng nhân viên.</Typography>
                        </Box>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Nhân viên có quyền từ chối yêu cầu của khách hàng nếu thấy không phù hợp.</Typography>
                        </Box>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Vui lòng cất gọn đồ cá nhân, vật dụng có giá trị hoặc dễ vỡ trong quá trình dọn dẹp.</Typography>
                        </Box>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Vui lòng hạn chế trẻ nhỏ và thú cưng đi lại tại khu vực đang được dọn.</Typography>
                        </Box>
                        <Box sx={style.ruleItem}>
                            <CheckCircleIcon size="medium" color="success" />
                            <Typography variant="body1">Hãy đánh giá dịch vụ công tâm để chúng tôi có thể phục vụ bạn tốt hơn.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default ServiceInformation;