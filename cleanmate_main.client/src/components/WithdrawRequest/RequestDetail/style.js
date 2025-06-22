const borderBottom = "1px solid #f0f0f0";

export const styles = {
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        maxHeight: '80vh',
        overflowY: 'auto',
        backgroundColor: '#fff',
        borderRadius: '5px',
        zIndex: 1000,

        '@media (max-width: 900px)': {
            width: '90%',
            maxHeight: '70vh',
        },
        '@media (max-width: 600px)': {
            width: '95%',
            maxHeight: '60vh',
        },
    },

    requestDetailTitle: {
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
        fontSize: '1.5rem',

        '@media (max-width: 600px)': {
            fontSize: '1rem',
            padding: '8px 0',
        },
    },

    confirmSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1,
        padding: '10px'
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
        '@media (max-width: 600px)': {
            fontSize: '40px',
        },
    },

    status: {
        fontSize: '18px',
        '@media (max-width: 600px)': {
            fontSize: '16px',
        },
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
        flexWrap: 'nowrap',
    },

    paymentButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '5px 10px',
        margin: '5px 0',
    },

    modalFeedback: {
        position: 'relative', 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        width: 350,
        zIndex: 1001,
        padding: '60px 10px 10px 10px',
        borderRadius: '8px',
    },

    serviceImage: {
        position: 'absolute',
        top: '-50px', 
        left: '50%',
        transform: 'translateX(-50%)',
        border: '1px solid #ddd',
        borderRadius: '50%',
        width: '100px',
        height: '100px',
        backgroundColor: '#fff',
        zIndex: 1002, 
    },

    feedbackTitle: {
        textAlign: 'center',
        fontWeight: 500,
        marginBottom: '10px',
        color: '#1976D2',
    },

    feedbackReason: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 1,
    }
};
