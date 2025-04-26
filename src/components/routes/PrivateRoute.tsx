import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated /*, loading*/ } = useAppSelector(state => state.auth);
  
  return isAuthenticated ? (
    <>{element}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute; 