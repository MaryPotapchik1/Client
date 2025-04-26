import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkAuth } from './store/slices/authSlice';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import CreateApplicationPage from './pages/CreateApplicationPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminConsultationsPage from './pages/admin/AdminConsultationsPage';
import NotFoundPage from './pages/NotFoundPage';
import InfoMaterialsPage from './pages/InfoMaterialsPage';
import InfoMaterialDetailPage from './pages/InfoMaterialDetailPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminInfoMaterialsPage from './pages/admin/AdminInfoMaterialsPage';
import AdminFAQPage from './pages/admin/AdminFAQPage';
import AdminApplicationDetailPage from './pages/admin/AdminApplicationDetailPage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, initialLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
 
    dispatch(checkAuth());
  }, [dispatch]);

 
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      localStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [location]);

  
  if (initialLoading && (location.pathname !== '/' && location.pathname !== '/info' && 
      location.pathname !== '/faq' && location.pathname !== '/contact' &&
      !location.pathname.startsWith('/info/'))) {
    return (
      <div className="app-loading d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      {!isAdminRoute && <Header />}
      <main className={`main-content ${isAdminRoute ? 'admin-content' : ''}`}>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/info/:id" element={<InfoMaterialDetailPage />} />
          <Route path="/info" element={<InfoMaterialsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Защищенные маршруты (только для авторизованных пользователей) */}
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
          <Route path="/applications" element={<PrivateRoute element={<ApplicationsPage />} />} />
          <Route path="/applications/:id" element={<PrivateRoute element={<ApplicationDetailPage />} />} />
          <Route path="/applications/create" element={<PrivateRoute element={<CreateApplicationPage />} />} />
          
          {/* Маршруты для администратора с собственным лейаутом */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="applications/:id" element={<AdminApplicationDetailPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="info-materials" element={<AdminInfoMaterialsPage />} />
            <Route path="faq" element={<AdminFAQPage />} />
            <Route path="consultations" element={<AdminConsultationsPage />} />
          </Route>
          
          {/* Маршрут 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App; 