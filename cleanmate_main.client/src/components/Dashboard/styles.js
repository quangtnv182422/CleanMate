export const styles = {
    dashboardContainer: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',

        '@media (max-width: 900px)': {
            padding: '20px',
        },
        '@media (max-width: 800px)': {
            padding: '18px',
        },
        '@media (max-width: 600px)': {
            padding: '16px',
        },
        '@media (max-width: 379px)': {
            padding: '12px',
        },
    },

    chartContainer: {
        width: '100%',
        height: '400px',

        '@media (max-width: 800px)': {
            height: '350px',
        },
        '@media (max-width: 600px)': {
            height: '300px',
        },
        '@media (max-width: 379px)': {
            height: '250px',
        },
    },

    card: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',

        '@media (max-width: 800px)': {
            padding: '14px',
        },
        '@media (max-width: 451px)': {
            padding: '12px',
        },
        '@media (max-width: 379px)': {
            padding: '8px',
        },
    },

    cardContent: {
        gap: '8px',
        padding: '12px',

        '@media (max-width: 900px)': {
            padding: '10px',
        },
        '@media (max-width: 800px)': {
            padding: '10px',
        },
        '@media (max-width: 600px)': {
            padding: '8px',
        },
        '@media (max-width: 379px)': {
            padding: '6px',
        },
    },

    cardTitleContainer: {
        display: 'flex',
        gap: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '8px',
    },

    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#B7BBBA',

        '@media (max-width: 900px)': {
            fontSize: '1rem',
        },
        '@media (max-width: 800px)': {
            fontSize: '0.95rem',
        },
        '@media (max-width: 769px)': {
            fontSize: '0.9rem',
        },
        '@media (max-width: 600px)': {
            fontSize: '0.9rem',
        },
        '@media (max-width: 451px)': {
            fontSize: '0.75rem',
        },
        '@media (max-width: 379px)': {
            fontSize: '0.65rem',
        },
    },

    cardTitleIcon: {
        color: '#B7BBBA',
        fontSize: '1.2rem',

        '@media (max-width: 800px)': {
            fontSize: '1.1rem',
        },
        '@media (max-width: 600px)': {
            fontSize: '1rem',
        },
        '@media (max-width: 451px)': {
            fontSize: '0.85rem',
        },
        '@media (max-width: 379px)': {
            fontSize: '0.7rem',
        },
    },

    cardValueContainer: {
        display: 'flex',
        gap: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '8px',

        '@media (max-width: 800px)': {
            justifyContent: 'space-between',
        },
        '@media (max-width: 600px)': {
            padding: '0 8px',
        },
    },

    cardValue: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2A493A',

        '@media (max-width: 925px)': {
            fontSize: '1.3rem',
        },

        '@media (max-width: 825px)': {
            fontSize: '1.05rem',
        },
        '@media (max-width: 600px)': {
            fontSize: '1.1rem',
        },
        '@media (max-width: 451px)': {
            fontSize: '0.9rem',
        },
        '@media (max-width: 379px)': {
            fontSize: '0.8rem',
        },
    },

    movingContainer: {
        display: 'flex',
        alignItems: 'center',
        mt: 0.5,
    },

    movingIcon: {
        color: 'green',
        fontSize: 30,
        transition: 'transform 0.3s ease',

        '@media (max-width: 800px)': {
            fontSize: 24,
        },
        '@media (max-width: 600px)': {
            fontSize: 24,
        },
        '@media (max-width: 451px)': {
            fontSize: 20,
        },
        '@media (max-width: 379px)': {
            fontSize: 18,
        },
    },

    movingValue: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'green',

        '@media (max-width: 800px)': {
            fontSize: '1rem',
        },
        '@media (max-width: 600px)': {
            fontSize: '1.1rem',
        },
        '@media (max-width: 451px)': {
            fontSize: '0.95rem',
        },
        '@media (max-width: 379px)': {
            fontSize: '0.8rem',
        },
    },
};
