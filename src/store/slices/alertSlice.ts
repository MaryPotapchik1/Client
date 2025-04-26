import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

 
export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

 
export interface Alert {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  timeout: number;
}

interface AlertState {
  alerts: Alert[];
}

 
const initialState: AlertState = {
  alerts: [],
};

 
const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<Alert, 'id'> & { timeout?: number }>) => {
      const { type, message, timeout = 5000 } = action.payload;
      const id = Date.now().toString();
      
      state.alerts.push({
        id,
        type,
        message,
        timeout
      });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    }
  }
});

 
export const setSuccessAlert = (message: string, timeout = 5000) => (dispatch: AppDispatch) => {
  dispatch(addAlert({ type: 'success', message, timeout }));
};

export const setErrorAlert = (message: string, timeout = 5000) => (dispatch: AppDispatch) => {
  dispatch(addAlert({ type: 'danger', message, timeout }));
};

export const setWarningAlert = (message: string, timeout = 5000) => (dispatch: AppDispatch) => {
  dispatch(addAlert({ type: 'warning', message, timeout }));
};

export const setInfoAlert = (message: string, timeout = 5000) => (dispatch: AppDispatch) => {
  dispatch(addAlert({ type: 'info', message, timeout }));
};

 
export const setAlert = (alertData: { type: AlertType, message: string, timeout?: number }) => (dispatch: AppDispatch) => {
  const { type, message, timeout = 5000 } = alertData;
  
  const alertType = type === AlertType.SUCCESS ? 'success' :
                   type === AlertType.ERROR ? 'danger' :
                   type === AlertType.WARNING ? 'warning' : 'info';
                   
  dispatch(addAlert({ type: alertType, message, timeout }));
};

export const { addAlert, removeAlert, clearAlerts } = alertSlice.actions;
export default alertSlice.reducer; 