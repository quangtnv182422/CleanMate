/*
import { useEffect, useState } from 'react';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/Authen/me', {
            method: 'GET',
            credentials: 'include' // để gửi cookie JWT
        })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => {
                setUser(data);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { user, loading };
};

export default useAuth;
*/

import { useState, useEffect } from 'react';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0); // Thêm state để trigger fetch lại

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await fetch('/Authen/me', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [refresh]); // Fetch lại khi refresh thay đổi

    return { user, loading, refreshAuth: () => setRefresh(prev => prev + 1), setUser };
};

export default useAuth;