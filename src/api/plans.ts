// src/api/plans.ts
import axios from "axios";

export interface PlanDTO {
  id: string;
  nombre: string;
  objetivo: string;
  accionesCount: number;
  iaDone: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const getPlans = async (): Promise<PlanDTO[]> => {
  const { data } = await api.get<PlanDTO[]>("/planes");
  return data;
};

export const createPlan = async (plan: Omit<PlanDTO, "id" | "iaDone">) => {
  const { data } = await api.post<PlanDTO>("/planes", {
    ...plan,
    iaDone: false,
  });
  return data;
};

export const updatePlan = async (plan: PlanDTO) => {
  const { data } = await api.put<PlanDTO>(`/planes/${plan.id}`, plan);
  return data;
};

export const deletePlan = async (id: string) => {
  await api.delete(`/planes/${id}`);
};

export const analyzePlan = async (id: string): Promise<PlanDTO> => {
  const { data } = await api.post<PlanDTO>(`/planes/${id}/analyze`);
  return data;
};
