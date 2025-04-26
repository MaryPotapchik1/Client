import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeAlert } from '../../store/slices/alertSlice';

const AlertMessage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { alerts } = useAppSelector(state => state.alert);

  useEffect(() => {
     
    alerts.forEach(alert => {
      if (alert.timeout) {
        const timer = setTimeout(() => {
          dispatch(removeAlert(alert.id));
        }, alert.timeout);
        
        return () => clearTimeout(timer);
      }
    });
  }, [alerts, dispatch]);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="alert-container" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }}>
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          variant={alert.type.toLowerCase()}
          dismissible
          onClose={() => dispatch(removeAlert(alert.id))}
          className="mb-2"
        >
          {alert.message}
        </Alert>
      ))}
    </div>
  );
};

export default AlertMessage; 