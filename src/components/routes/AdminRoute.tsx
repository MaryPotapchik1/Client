import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface AdminRouteProps {
  element: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  const { isAuthenticated, isAdmin, loading } = useAppSelector(state => state.auth);
  
  if (loading) {
    return <div className="text-center my-5">Проверка прав доступа...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return isAdmin ? (
    <>{element}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoute; 