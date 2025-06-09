import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

/**
 * @param {React.ReactNode} children - component muốn render
 * @param {Array<string>} allowedRoles - danh sách roles được phép truy cập
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; 
    }

    

    const userRole = user?.roles?.[0]

    // Kiểm tra user có ít nhất 1 role trong allowedRoles không
    const isAllowed = Array.isArray(allowedRoles)
        ? allowedRoles.includes(userRole)
        : userRole === allowedRoles;
    

   

    // Nếu hợp lệ thì render component con
    return children;
};

export default ProtectedRoute;