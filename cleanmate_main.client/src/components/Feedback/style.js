export const styles = {
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
}