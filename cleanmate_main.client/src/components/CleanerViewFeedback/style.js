export const style = {
    feedbackSection: {
        backgroundColor: "#fff",
        marginBottom: '20px',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
    },
    tabCard: {
        border: '2px solid',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    workCard: {
        border: '1px solid #eee',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0 5px 8px rgba(0,0,0,0.5)',
            '@media (max-width: 600px)': {
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)', 
            },
        }, 
    },
    priceSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
    },
    status: {
        padding: '4px 8px',
        border: '1px solid #ccc',
        borderRadius: '8px',
    },
    dateTimeContent: {
        color: '#1976D2',
        fontWeight: 'bold',
    }
};
