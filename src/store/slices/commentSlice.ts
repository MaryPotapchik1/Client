import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as commentService from '../../services/commentService';

export interface Comment {
  id: number;
  applicationId: number;
  text: string;
  userId: number;
  createdAt: string;
  user?: {
    username: string;
    role: string;
  };
  [key: string]: any;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const getApplicationComments = createAsyncThunk(
  'comments/getApplicationComments',
  async (applicationId: number) => {
    return await commentService.getComments(applicationId);
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ applicationId, text }: { applicationId: number; text: string }) => {
    return await commentService.addComment(applicationId, text);
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicationComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = (action.payload ? (action.payload as unknown as Comment[]) : []);
      })
      .addCase(getApplicationComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке комментариев';
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload as unknown as Comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при добавлении комментария';
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer; 