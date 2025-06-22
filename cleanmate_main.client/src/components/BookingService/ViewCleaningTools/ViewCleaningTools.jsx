import {
    Modal,
    Box,
    Grid,
    Typography,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import broomImg from '../../../images/cleaningTools/broom.webp';
import swepperImg from '../../../images/cleaningTools/swepper.webp';
import glassCleaningLiquidImg from '../../../images/cleaningTools/glass-cleaning-liquid.webp';
import toiletCleaningLiquidImg from '../../../images/cleaningTools/toilet-cleaning-liquid.webp';
import dishWashingLiquidImg from '../../../images/cleaningTools/dish-washing-liquid.webp';
import ragImg from '../../../images/cleaningTools/rag.webp';
import glovesImg from '../../../images/cleaningTools/gloves.webp';
import buckImg from '../../../images/cleaningTools/buck.jfif';


const style = {
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: {
            xs: '90%',
            sm: 500,
            md: 600,
        },
        maxHeight: '80vh',
        overflowY: 'auto',
        // Custom scrollbar
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a0a0a0',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
        },
    },
    toolItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        p: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        height: 120,
    },
    toolImage: {
        width: 70,
        height: 70,
        objectFit: 'contain',
    },
};

const ViewCleaningTools = ({ setOpenViewCleaningTools }) => {
    const cleaningTools = [
        { name: "Chổi", image: broomImg },
        { name: "Cây lau nhà", image: swepperImg },
        { name: "Dung dịch lau kính", image: glassCleaningLiquidImg },
        { name: "Dung dịch tẩy bồn cầu", image: toiletCleaningLiquidImg },
        { name: "Nước rửa bát", image: dishWashingLiquidImg },
        { name: "Khăn lau", image: ragImg },
        { name: "Găng tay", image: glovesImg },
        { name: "Xô", image: buckImg },
    ];

    return (
        <Box sx={style.modalBox}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Danh sách công cụ dọn dẹp</Typography>
                <IconButton onClick={() => setOpenViewCleaningTools(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {cleaningTools.map((tool, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box sx={style.toolItem}>
                            <img src={tool.image} alt={tool.name} style={style.toolImage} />
                            <Typography variant="body2" align="center">{tool.name}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ViewCleaningTools;
