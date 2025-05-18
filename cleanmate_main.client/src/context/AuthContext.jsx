import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        const fetchBankData = async () => {
            try {
                const response = await axios.get('https://api.vietqr.io/v2/banks');
                if (response.data.code == '00') {
                    setBanks(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching bank data:', error);
            }
        }

        fetchBankData();
    }, [])


    return <AuthContext.Provider value={{ banks } }>{ children }</AuthContext.Provider>
}

export default AuthProvider;