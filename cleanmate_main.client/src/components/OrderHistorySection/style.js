export const style = {
    orderHistorySection: {
        backgroundColor: "#fff",
        padding: '50px 0',
    },
    spinnerContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
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
    orderCard: {
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
    }
};
