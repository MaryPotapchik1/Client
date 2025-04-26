import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as adminService from '../../services/adminService';
import { User } from '../../types';  

interface AdminState {
  users: User[];
  loadingUsers: boolean;
  usersError: string | null;
 
}

const initialState: AdminState = {
  users: [],
  loadingUsers: false,
  usersError: null,
};

 
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllUsers();
     
      return response.users;
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

 
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.usersError = null;
    },
   
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingUsers = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.usersError = action.payload as string;
        state.users = [];  
      });
     
  }
});

export const { clearUsersError } = adminSlice.actions;
export default adminSlice.reducer; 