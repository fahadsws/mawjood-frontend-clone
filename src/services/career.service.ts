import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';

export interface CareerOpening {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  employmentType: 'PART_TIME' | 'FULL_TIME';
  isActive: boolean;
  createdAt?: string;
}

export interface CareerApplicationPayload {
  careerOpeningId: string;
  name: string;
  email: string;
  phone?: string;
  resume: File;
  coverLetter?: string;
}
export interface CareerApplication extends Partial<CareerApplicationPayload> { id: string; resumeUrl?: string; createdAt?: string; careerOpening?: CareerOpening; }

const getPayload = <T,>(response: { data: { data?: T } | T }): T => {
  const body = response.data;
  return (body && typeof body === 'object' && 'data' in body ? body.data : body) as T;
};

export const careerService = {
  async getOpenings(): Promise<CareerOpening[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.CAREERS.GET_ALL);
    const payload = getPayload<CareerOpening[] | { careers?: CareerOpening[]; openings?: CareerOpening[] }>(response);
    return Array.isArray(payload) ? payload : payload.careers ?? payload.openings ?? [];
  },

  async submitApplication(payload: CareerApplicationPayload) {
    const formData = new FormData();
    formData.append('careerOpeningId', payload.careerOpeningId);
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.coverLetter) formData.append('coverLetter', payload.coverLetter);
    formData.append('resume', payload.resume);
    const response = await axiosInstance.post(API_ENDPOINTS.CAREERS.SUBMIT_APPLICATION, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getAdminOpenings(): Promise<CareerOpening[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.CAREERS.GET_ALL_ADMIN);
    const payload = getPayload<CareerOpening[] | { careers?: CareerOpening[]; openings?: CareerOpening[] }>(response);
    return Array.isArray(payload) ? payload : payload.careers ?? payload.openings ?? [];
  },
  async getAdminApplications(): Promise<CareerApplication[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.CAREERS.GET_APPLICATIONS_ADMIN);
    const payload = getPayload<CareerApplication[] | { applications?: CareerApplication[] }>(response);
    return Array.isArray(payload) ? payload : payload.applications ?? [];
  },

  async createOpening(payload: Omit<CareerOpening, 'id' | 'createdAt'>) {
    const response = await axiosInstance.post(API_ENDPOINTS.CAREERS.CREATE, payload);
    return response.data;
  },

  async updateOpening(id: string, payload: Partial<Omit<CareerOpening, 'id' | 'createdAt'>>) {
    const response = await axiosInstance.patch(API_ENDPOINTS.CAREERS.UPDATE(id), payload);
    return response.data;
  },

  async deleteOpening(id: string) {
    await axiosInstance.delete(API_ENDPOINTS.CAREERS.DELETE(id));
  },
};
