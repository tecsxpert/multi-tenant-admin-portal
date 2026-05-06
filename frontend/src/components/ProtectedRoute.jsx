import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SparkleLoader from './SparkleLoader';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-black">
                <SparkleLoader text="Authentizing System Access..." />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
