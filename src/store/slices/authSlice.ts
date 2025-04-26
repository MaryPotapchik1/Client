import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthToken } from '../../services/api';
import * as authService from '../../services/authService';
import { FamilyMember, UserProfile, Document } from '../../types';

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  familyMembers: FamilyMember[];
  documents: Document[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  initialLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  familyMembers: [],
  documents: [],
  isAuthenticated: false,
  isAdmin: false,
  initialLoading: true,
  loading: false,
  error: null
};

 
export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      
      const response = await authService.verify();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getUserProfile();
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const addFamilyMember = createAsyncThunk(
  'auth/addFamilyMember',
  async (familyMember: FamilyMember, { rejectWithValue }) => {
    try {
      return await authService.addFamilyMember(familyMember);
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const updateFamilyMember = createAsyncThunk(
  'auth/updateFamilyMember',
  async ({ id, data }: { id: number, data: FamilyMember }, { rejectWithValue }) => {
    try {
      return await authService.updateFamilyMember(id, data);
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const deleteFamilyMember = createAsyncThunk(
  'auth/deleteFamilyMember',
  async (id: number, { rejectWithValue }) => {
    try {
      await authService.deleteFamilyMember(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

 
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<Omit<UserProfile, 'user_id'> >, { rejectWithValue }) => {
    try {
      const response = await authService.updateUserProfile(profileData);
      return { profile: response };
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

 
export const createProfile = createAsyncThunk(
  'auth/createProfile',
  async (profileData: Omit<UserProfile, 'user_id'>, { rejectWithValue }) => {
    try {
      const response = await authService.createUserProfile(profileData);
      return { profile: response };
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

 
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.profile = null;
      state.familyMembers = [];
      state.documents = [];
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.initialLoading = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user as User;
        state.isAdmin = action.payload.user.role === 'admin';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user as User;
        state.isAdmin = action.payload.user.role === 'admin';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
 
      .addCase(checkAuth.pending, (state) => {
        state.initialLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.initialLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user as User;
          state.isAdmin = action.payload.user.role === 'admin';
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.isAdmin = false;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.initialLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isAdmin = false;
      })
      
   
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.profile = action.payload.profile as UserProfile;
          state.familyMembers = (action.payload.familyMembers || []) as FamilyMember[];
          state.documents = (action.payload.documents || []) as Document[];
        } else {
          state.profile = null;
          state.familyMembers = [];
          state.documents = [];
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
   
      .addCase(addFamilyMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        state.familyMembers.push(action.payload as FamilyMember);
      })
      .addCase(addFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  
      .addCase(updateFamilyMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.familyMember) {
          const updatedMember = action.payload.familyMember as FamilyMember;
          const index = state.familyMembers.findIndex(member => member.id === updatedMember.id);
          if (index !== -1) {
            state.familyMembers[index] = updatedMember;
          }
        }
      })
      .addCase(updateFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
   
      .addCase(deleteFamilyMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFamilyMember.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.familyMembers = state.familyMembers.filter(member => member.id !== action.payload);
        }
      })
      .addCase(deleteFamilyMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile as UserProfile;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
 
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile as UserProfile;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 