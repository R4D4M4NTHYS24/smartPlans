// src/context/PlansContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/plans";

interface PlansContextValue {
  planes: api.PlanDTO[];
  loading: boolean;
  createPlan: (nombre: string, objetivo: string) => Promise<void>;
  updatePlan: (plan: api.PlanDTO) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  analyzePlan: (id: string) => Promise<void>;
}

const PlansContext = createContext<PlansContextValue | undefined>(undefined);

export const PlansProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [planes, setPlanes] = useState<api.PlanDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const list = await api.getPlans();
      setPlanes(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPlanFn = async (nombre: string, objetivo: string) => {
    const newPlan = await api.createPlan({
      nombre,
      objetivo,
      accionesCount: 0,
    });
    setPlanes((prev) => [...prev, newPlan]);
  };

  const updatePlanFn = async (plan: api.PlanDTO) => {
    const updated = await api.updatePlan(plan);
    setPlanes((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deletePlanFn = async (id: string) => {
    await api.deletePlan(id);
    setPlanes((prev) => prev.filter((p) => p.id !== id));
  };

  const analyzePlanFn = async (id: string) => {
    const updated = await api.analyzePlan(id);
    setPlanes((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <PlansContext.Provider
      value={{
        planes,
        loading,
        createPlan: createPlanFn,
        updatePlan: updatePlanFn,
        deletePlan: deletePlanFn,
        analyzePlan: analyzePlanFn,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = () => {
  const ctx = useContext(PlansContext);
  if (!ctx) throw new Error("usePlans must be used within PlansProvider");
  return ctx;
};
