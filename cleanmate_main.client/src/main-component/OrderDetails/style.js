const borderBottom = "1px solid #f0f0f0";

export const styles = {
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        maxHeight: '80vh', // hoặc height: '500px'
        overflowY: 'auto',
        bgcolor: 'background.paper',
        borderRadius: '5px',
        zIndex: '1000',
    },
    orderDetailTitle: {
        position: 'sticky',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: '#fff',
        textAlign: 'center',
        fontWeight: 500,
        color: '#1976D2',
        padding: '10px 0',
        borderBottom: borderBottom,
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        marginTop: '15px',
        marginBottom: '15px',
    },
    iconLarge: {
        fontSize: '60px',
    },
    status: {
        fontSize: '18px',
    },
    informationTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        backgroundColor: '#F3F3F3',
        padding: '8px 10px',
    },
    subtitleIcon: {
        color: '#1976D2',
    },
    subtitle: {
        fontWeight: 500,
        color: '#6D6D6D',
    },
    informationContent: {
        padding: '5px 10px',
        margin: '5px 0',
    },
    contentTitle: {
        fontWeight: 600,
        color: '#666',
        marginBottom: '2px',
    },
    bookingTitle: {
        fontWeight: 600,
        color: '#666',
    },
    content: {
        fontWeight: 500,
        color: '#666',
    },
    bookingContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #ccc',
        padding: '10px 0',
    }
}