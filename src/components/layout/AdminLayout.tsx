import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import AdminHeader from './AdminHeader';
import { Container } from 'react-bootstrap';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

 
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');  
    }
  }, [isAuthenticated, isAdmin, navigate]);

   
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminHeader />
      <Container className="py-4">
        <Outlet />
      </Container>
    </div>
  );
};

export default AdminLayout; 