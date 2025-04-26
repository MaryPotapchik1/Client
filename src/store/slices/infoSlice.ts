import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as infoService from '../../services/infoService';
import {
  InfoMaterial,
  FAQ,
  ConsultationRequest,
  CreateInfoMaterialData,
  CreateFAQData,
  UpdateMaterialPayload,
  UpdateFaqPayload,
  CreateConsultationRequestPayload,
  GetAllConsultationRequestsParams,
  UpdateConsultationStatusPayload,
} from '../../types';

interface InfoState {
  materials: InfoMaterial[];
  currentMaterial: InfoMaterial | null;
  faqs: FAQ[];
  consultationRequests: ConsultationRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: InfoState = {
  materials: [],
  currentMaterial: null,
  faqs: [],
  consultationRequests: [],
  loading: false,
  error: null,
};

 
export const getInfoMaterials = createAsyncThunk<
  { materials: InfoMaterial[], total: number },
  { page?: number; limit?: number },
  { rejectValue: string }
>(
  'info/getInfoMaterials',
  async ({ page, limit } = {}, { rejectWithValue }) => {
    try {
      const response = await infoService.getInfoMaterials(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить информационные материалы');
    }
  }
);

export const getInfoMaterialById = createAsyncThunk<
  InfoMaterial,
  number,
  { rejectValue: string }
>(
  'info/getInfoMaterialById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await infoService.getInfoMaterialById(String(id));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить информационный материал');
    }
  }
);

export const createInfoMaterial = createAsyncThunk<
  InfoMaterial,
  CreateInfoMaterialData,
  { rejectValue: string }
>(
  'info/createInfoMaterial',
  async (materialData, { rejectWithValue }) => {
    try {
      const response = await infoService.createInfoMaterial(materialData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось создать информационный материал');
    }
  }
);

export const updateInfoMaterial = createAsyncThunk<
  InfoMaterial,
  UpdateMaterialPayload,
  { rejectValue: string }
>(
  'info/updateInfoMaterial',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await infoService.updateInfoMaterial(String(id), data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось обновить информационный материал');
    }
  }
);

export const deleteInfoMaterial = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'info/deleteInfoMaterial',
  async (id, { rejectWithValue }) => {
    try {
      await infoService.deleteInfoMaterial(String(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось удалить информационный материал');
    }
  }
);

 
export const getFAQs = createAsyncThunk<
  { faqs: FAQ[] },
  string | undefined,
  { rejectValue: string }
>(
  'info/getFAQs',
  async (category, { rejectWithValue }) => {
    try {
      const response = await infoService.getFAQs(category);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить FAQ');
    }
  }
);

export const getAllFAQs = createAsyncThunk<
  { faqs: FAQ[] },
  string | undefined,
  { rejectValue: string }
>(
  'info/getAllFAQs',
  async (category, { rejectWithValue }) => {
    try {
      const response = await infoService.getAllFAQs(category);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить все FAQ');
    }
  }
);

export const getAllPublicFAQs = createAsyncThunk<
  { faqs: FAQ[] },
  string | undefined,
  { rejectValue: string }
>(
  'info/getAllPublicFAQs',
  async (category, { rejectWithValue }) => {
    try {
      const response = await infoService.getAllPublicFAQs(category);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить все публичные FAQ');
    }
  }
);

export const createFaq = createAsyncThunk<
  FAQ,
  CreateFAQData,
  { rejectValue: string }
>(
  'info/createFAQ',
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await infoService.createFaq(faqData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось создать FAQ');
    }
  }
);

export const updateFaq = createAsyncThunk<
  FAQ,
  UpdateFaqPayload,
  { rejectValue: string }
>(
  'info/updateFAQ',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await infoService.updateFaq(String(id), data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось обновить FAQ');
    }
  }
);

export const deleteFaq = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'info/deleteFAQ',
  async (id, { rejectWithValue }) => {
    try {
      await infoService.deleteFaq(String(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось удалить FAQ');
    }
  }
);

 
export const createConsultationRequest = createAsyncThunk<
  { consultationRequest: ConsultationRequest },
  CreateConsultationRequestPayload,
  { rejectValue: string }
>(
  'info/createConsultationRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await infoService.createConsultationRequest(requestData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось создать запрос на консультацию');
    }
  }
);

export const getUserConsultationRequests = createAsyncThunk<
  { consultationRequests: ConsultationRequest[] },
  void,
  { rejectValue: string }
>(
  'info/getUserConsultationRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await infoService.getUserConsultationRequests();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить запросы на консультацию');
    }
  }
);

export const getAllConsultationRequests = createAsyncThunk<
  { consultationRequests: ConsultationRequest[] },
  GetAllConsultationRequestsParams | undefined,
  { rejectValue: string }
>(
  'info/getAllConsultationRequests',
  async (params, { rejectWithValue }) => {
    try {
      const response = await infoService.getAllConsultationRequests(params?.status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить все запросы на консультацию');
    }
  }
);

export const updateConsultationRequestStatus = createAsyncThunk<
  { consultationRequest: ConsultationRequest },
  UpdateConsultationStatusPayload,
  { rejectValue: string }
>(
  'info/updateConsultationRequestStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await infoService.updateConsultationRequestStatus(id, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось обновить статус запроса');
    }
  }
);

export const getAdminFAQs = createAsyncThunk<
  { faqs: FAQ[] },
  void,
  { rejectValue: string }
>(
  'info/getAdminFAQs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await infoService.getAdminFAQs();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Не удалось загрузить FAQ для администратора');
    }
  }
);

 
const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    clearInfoError(state) {
      state.error = null;
    },
    resetCurrentMaterial(state) {
      state.currentMaterial = null;
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(getInfoMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInfoMaterials.fulfilled, (state, action: PayloadAction<{ materials: InfoMaterial[], total: number }>) => {
        state.materials = action.payload.materials;
        state.loading = false;
      })
      .addCase(getInfoMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при загрузке материалов';
      })
      .addCase(getInfoMaterialById.pending, (state) => {
        state.loading = true;
        state.currentMaterial = null;
        state.error = null;
      })
      .addCase(getInfoMaterialById.fulfilled, (state, action: PayloadAction<InfoMaterial>) => {
        state.currentMaterial = action.payload;
        state.loading = false;
      })
      .addCase(getInfoMaterialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при загрузке материала';
      })
      .addCase(createInfoMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInfoMaterial.fulfilled, (state, action: PayloadAction<InfoMaterial>) => {
        state.materials.push(action.payload);
        state.loading = false;
      })
      .addCase(createInfoMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при создании материала';
      })
      .addCase(updateInfoMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInfoMaterial.fulfilled, (state, action: PayloadAction<InfoMaterial>) => {
        const index = state.materials.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.materials[index] = action.payload;
        }
        if (state.currentMaterial?.id === action.payload.id) {
          state.currentMaterial = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateInfoMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при обновлении материала';
      })
      .addCase(deleteInfoMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInfoMaterial.fulfilled, (state, action: PayloadAction<number>) => {
        state.materials = state.materials.filter(m => m.id !== action.payload);
        if (state.currentMaterial?.id === action.payload) {
          state.currentMaterial = null;
        }
        state.loading = false;
      })
      .addCase(deleteInfoMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при удалении материала';
      })

    
      .addCase(getFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFAQs.fulfilled, (state, action: PayloadAction<{ faqs: FAQ[] }>) => {
        state.faqs = action.payload.faqs;
        state.loading = false;
      })
      .addCase(getFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при загрузке FAQ';
      })
      .addCase(getAllFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFAQs.fulfilled, (state, action: PayloadAction<{ faqs: FAQ[] }>) => {
        state.faqs = action.payload.faqs;
        state.loading = false;
      })
      .addCase(getAllFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при загрузке всех FAQ';
      })
      .addCase(getAllPublicFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPublicFAQs.fulfilled, (state, action: PayloadAction<{ faqs: FAQ[] }>) => {
        state.faqs = action.payload.faqs;
        state.loading = false;
      })
      .addCase(getAllPublicFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при загрузке всех публичных FAQ';
      })
      .addCase(getAdminFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminFAQs.fulfilled, (state, action: PayloadAction<{ faqs: FAQ[] }>) => {
        state.faqs = action.payload.faqs;
        state.loading = false;
      })
      .addCase(getAdminFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при загрузке FAQ для администратора';
      })
      .addCase(createFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFaq.fulfilled, (state, action: PayloadAction<FAQ>) => {
        state.faqs.push(action.payload);
        state.loading = false;
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при создании FAQ';
      })
      .addCase(updateFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFaq.fulfilled, (state, action: PayloadAction<FAQ>) => {
        const index = state.faqs.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.faqs[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при обновлении FAQ';
      })
      .addCase(deleteFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFaq.fulfilled, (state, action: PayloadAction<number>) => {
        state.faqs = state.faqs.filter(f => f.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при удалении FAQ';
      })

    
      .addCase(createConsultationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConsultationRequest.fulfilled, (state, action: PayloadAction<{ consultationRequest: ConsultationRequest }>) => {
        state.loading = false;
      })
      .addCase(createConsultationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при создании запроса на консультацию';
      })
      .addCase(getUserConsultationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserConsultationRequests.fulfilled, (state, action: PayloadAction<{ consultationRequests: ConsultationRequest[] }>) => {
        state.consultationRequests = action.payload.consultationRequests;
        state.loading = false;
      })
      .addCase(getUserConsultationRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при загрузке запросов пользователя';
      })
      .addCase(getAllConsultationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllConsultationRequests.fulfilled, (state, action: PayloadAction<{ consultationRequests: ConsultationRequest[] }>) => {
        state.consultationRequests = action.payload.consultationRequests;
        state.loading = false;
      })
      .addCase(getAllConsultationRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при загрузке всех запросов';
      })
      .addCase(updateConsultationRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConsultationRequestStatus.fulfilled, (state, action: PayloadAction<{ consultationRequest: ConsultationRequest }>) => {
        const index = state.consultationRequests.findIndex(r => r.id === action.payload.consultationRequest.id);
        if (index !== -1) {
          state.consultationRequests[index] = action.payload.consultationRequest;
        }
        state.loading = false;
      })
      .addCase(updateConsultationRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка при обновлении статуса запроса';
      });
  },
});

export const { clearInfoError, resetCurrentMaterial } = infoSlice.actions;
export default infoSlice.reducer; 