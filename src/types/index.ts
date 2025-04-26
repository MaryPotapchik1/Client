import { Alert } from '../store/slices/alertSlice';
import { ApplicationStatus, ApplicationType } from '../utils/typeUtils';

 
export interface User {
  id: number;
  email: string;
  role: string;
  profile?: UserProfile;
  created_at?: string;
}

export interface UserProfile {
  user_id?: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date: string;
  passport_series: string;
  passport_number: string;
  address: string;
  phone: string;
  has_maternal_capital: boolean;
  maternal_capital_amount: number;
  housing_type?: 'own_house' | 'own_apartment' | 'rented' | 'social_housing' | 'other';
  living_area?: number;
  ownership_status?: 'sole' | 'joint' | 'none';
}

export interface FamilyMember {
  id?: number;
  user_id?: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date: string;
  relation_type: 'spouse' | 'child';
  document_type?: 'birth_certificate' | 'passport';
  document_number?: string;
}

export interface Document {
  id?: number;
  user_id?: number;
  document_name: string;
  document_path: string;
  uploaded_at?: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  familyMembers: FamilyMember[];
  documents: Document[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

 
export interface Application {
  id: number;
  user_id: number;
  application_type: ApplicationType;
  status: ApplicationStatus;
  requested_amount: number;
  approved_amount?: number;
  purpose: string;
  description?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  user_profile?: UserProfile;
  family_members?: FamilyMember[];
  comments?: ApplicationComment[];
}

export interface ApplicationComment {
  id: number;
  application_id: number;
  user_id: number;
  is_admin: boolean;
  comment: string;
  created_at: string;
}

export interface ApplicationsState {
  applications: Application[];
  currentApplication: Application | null;
  loading: boolean;
  error: string | null;
}

 
export interface InfoMaterial {
  id: number;
  title: string;
  content: string;
  category: string;
  is_published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  is_published: boolean;
  created_at: string;
}

export interface ConsultationRequest {
  id?: number;
  user_id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: 'pending' | 'in_progress' | 'completed';
  created_at?: string;
}

export interface InfoState {
  materials: InfoMaterial[];
  currentMaterial: InfoMaterial | null;
  faqs: FAQ[];
  consultationRequests: ConsultationRequest[];
  loading: boolean;
  error: string | null;
}

 
export interface AlertState {
  alerts: Alert[];
}

export interface RootState {
  auth: AuthState;
  applications: ApplicationsState;
  info: InfoState;
  alert: AlertState;
}

 
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  profile: UserProfile;
  familyMembers: FamilyMember[];
  documents: Document[];
}

export interface CreateApplicationData {
  application_type: ApplicationType;
  requested_amount: number;
  purpose: string;
  description?: string;
}

export interface UpdateApplicationStatusData {
  status: ApplicationStatus;
  approved_amount?: number;
  comment?: string;
  rejection_reason?: string;
}

export interface CreateInfoMaterialData {
  title: string;
  content: string;
  category: string;
  is_published?: boolean;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category?: string;
  is_published?: boolean;
}

 
export interface UpdateMaterialPayload {
  id: number;
  data: Partial<CreateInfoMaterialData>;
}

export interface UpdateFaqPayload {
  id: number;
  data: Partial<CreateFAQData>;
}

export interface CreateConsultationRequestPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface GetAllConsultationRequestsParams {
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface UpdateConsultationStatusPayload {
  id: number;
  status: 'pending' | 'in_progress' | 'completed';
}

 
export interface ApplicationDetailsResponse {
  application: Application;
  comments?: ApplicationComment[];
  user_profile?: UserProfile;
  family_members?: FamilyMember[];
}
 