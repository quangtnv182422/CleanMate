import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Benefits = (props) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className="wpo-benefits-section">
            <h2>Lợi ích</h2>
            <div className="row">
                <div className="col-lg-12 col-12">
                    <div className="wpo-benefits-item">
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography>Tiết kiệm chi phí</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Chỉ trả tiền theo số giờ sử dụng, không tốn lương cố định hay các khoản bảo hiểm như thuê nhân viên toàn thời gian.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography>Linh hoạt về thời gian.</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Có thể đặt lịch theo nhu cầu (hàng ngày, hàng tuần hoặc khi cần gấp), phù hợp với người bận rộn hoặc làm việc không cố định.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3bh-content"
                                id="panel3bh-header"
                            >
                                <Typography>Chuyên nghiệp và hiệu quả.</Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Nhân viên được đào tạo kỹ, sử dụng công cụ và hóa chất phù hợp giúp làm sạch nhanh chóng, đảm bảo vệ sinh kỹ lưỡng.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Typography>Giảm gánh nặng việc nhà.</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Giúp bạn có thêm thời gian nghỉ ngơi, chăm sóc gia đình hoặc tập trung vào công việc, thay vì lo dọn dẹp hàng ngày.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Benefits;