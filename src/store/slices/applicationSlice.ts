import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as applicationService from '../../services/applicationService';
 
import { 
    Application as ApplicationType, 
    ApplicationComment as CommentType, 
    ApplicationsState as AppState, 
    UpdateApplicationStatusData,  
    CreateApplicationData,
    ApplicationDetailsResponse
} from '../../types';

 
interface ApplicationsState {  
  applications: ApplicationType[];           
  currentApplication: ApplicationType | null;  
  comments: CommentType[];         
  loading: boolean;                      
  error: string | null;                   
  
 
  currentApplicationDetails: ApplicationDetailsResponse | null; 
  loadingDetails: boolean;
  errorDetails: string | null;
 
}

 
const initialState: ApplicationsState = {
  applications: [],
  currentApplication: null,
  comments: [],
  loading: false,
  error: null,
 
  currentApplicationDetails: null,
  loadingDetails: false,
  errorDetails: null,
 
};

 
export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (applicationData: any, { rejectWithValue }) => {
    try {
      const response = await applicationService.createApplication(applicationData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const getUserApplications = createAsyncThunk(
  'applications/getUserApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationService.getUserApplications();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const getApplicationById = createAsyncThunk(
  'applications/getApplicationById',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const numId = typeof id === 'string' ? parseInt(id) : id;
      const response = await applicationService.getApplicationById(numId);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const getAllApplications = createAsyncThunk(
  'applications/getAllApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await applicationService.getAllApplications();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
 
  async ({ id, statusData }: { id: number | string; statusData: UpdateApplicationStatusData }, { rejectWithValue }) => { 
    try {
      const numId = typeof id === 'string' ? parseInt(id) : id;
      const response = await applicationService.updateApplicationStatus(numId, statusData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

export const addApplicationComment = createAsyncThunk(
  'applications/addApplicationComment',
  async ({ id, comment }: { id: number | string; comment: string }, { rejectWithValue }) => {
    try {
      const numId = typeof id === 'string' ? parseInt(id) : id;
      const response = await applicationService.addApplicationComment(numId, comment);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).toString());
    }
  }
);

 
export const fetchApplicationDetails = createAsyncThunk(
  'applications/fetchDetails',
  async (id: number, { rejectWithValue }) => {
    try {
 
      const data = await applicationService.getApplicationById(id);
      return data;  
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

 
const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    resetCurrentApplication: (state) => {
      state.currentApplication = null;
      state.comments = [];
    },
    clearApplicationError: (state) => {
      state.error = null;
      state.errorDetails = null;
    },
    clearCurrentApplicationDetails: (state) => {
      state.currentApplicationDetails = null;
      state.currentApplication = null;
      state.comments = [];
      state.errorDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
  
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          if (!Array.isArray(state.applications)) {
            state.applications = [];
          }
          state.applications.push(action.payload as any);
          state.currentApplication = action.payload as any;
        }
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
     
      .addCase(getUserApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload?.applications || [];
      })
      .addCase(getUserApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.applications = [];
      })
      
 
      .addCase(getApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.application) {
          state.currentApplication = action.payload.application as ApplicationType;
          state.comments = (action.payload.comments || []) as CommentType[];
          
          if (action.payload.user_profile) {
            state.currentApplication.user_profile = action.payload.user_profile;
          }
          if (action.payload.family_members) {
            state.currentApplication.family_members = action.payload.family_members;
          }
        }
      })
      .addCase(getApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
     
      .addCase(getAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        
        state.applications = (action.payload?.applications || []) as ApplicationType[]; 
      })
      .addCase(getAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.applications = [];
      })
      
  
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.application) {
          const updatedApp = action.payload.application as ApplicationType;
          state.currentApplication = updatedApp;  
          
     
          const index = state.applications.findIndex(app => app.id === updatedApp.id);
          if (index !== -1) {
          
            const existingProfile = state.applications[index].user_profile;
            state.applications[index] = updatedApp;
            if (existingProfile) {
                state.applications[index].user_profile = existingProfile;
            }
          }
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
 
      .addCase(addApplicationComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApplicationComment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.comments.push(action.payload as any);
        }
      })
      .addCase(addApplicationComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
 
      .addCase(fetchApplicationDetails.pending, (state) => {
        state.loadingDetails = true;
        state.errorDetails = null;
        state.currentApplicationDetails = null;
      })
      .addCase(fetchApplicationDetails.fulfilled, (state, action: PayloadAction<ApplicationDetailsResponse>) => {
        state.loadingDetails = false;
        state.currentApplicationDetails = action.payload;
        state.currentApplication = action.payload.application;
        state.comments = action.payload.comments || [];
      })
      .addCase(fetchApplicationDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.errorDetails = action.payload as string;
      });
  }
});

export const { resetCurrentApplication, clearApplicationError, clearCurrentApplicationDetails } = applicationSlice.actions;
export default applicationSlice.reducer; 