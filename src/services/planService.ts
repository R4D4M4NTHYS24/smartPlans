// src/services/planService.ts
import axios from "axios";

const API = "http://localhost:8000"; // asegúrate de usar el mismo host/puerto
export interface Plan {
  id: string;
  nombre: string;
  responsable: string;
  objetivo: string;
  fecha: string;
  prioridad: string;
  descripcion: string;
  acciones: any[];
  feedback: any | null;
}

export const listPlanes = () =>
  axios.get<Plan[]>(`${API}/planes`).then((res) => res.data);

export const createPlan = (p: Omit<Plan, "id" | "acciones" | "feedback">) =>
  axios.post<Plan>(`${API}/planes`, p).then((res) => res.data);

export const updatePlan = (
  id: string,
  p: Omit<Plan, "id" | "acciones" | "feedback">
) => axios.put<Plan>(`${API}/planes/${id}`, p).then((res) => res.data);

export const deletePlan = (id: string) => axios.delete(`${API}/planes/${id}`);

export const analyzePlan = (id: string) =>
  axios
    .post<{ riesgos: string[]; sugerencias: string[] }>(
      `${API}/planes/${id}/analyze`
    )
    .then((res) => res.data);
