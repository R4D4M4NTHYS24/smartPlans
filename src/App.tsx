// src/App.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import PlanForm from "./components/PlanForm";
import PlanList from "./components/PlanList";

import { listPlanes, deletePlan, analyzePlan } from "./services/planService";
import type { PlanDTO, FeedbackIA } from "./services/planService";

export default function App() {
  /* ---------------- estado ---------------- */
  const [planes, setPlanes] = useState<PlanDTO[]>([]);
  const [editing, setEditing] = useState<PlanDTO | null>(null);

  /* -------------- utilidades -------------- */
  const reloadAll = useCallback(() => {
    listPlanes().then((data) => setPlanes(data.slice().reverse()));
  }, []);

  useEffect(reloadAll, [reloadAll]);

  /* --------------- handlers --------------- */
  const handleCreated = reloadAll;

  const handleSaved = useCallback(() => {
    setEditing(null);
    reloadAll();
  }, [reloadAll]);

  const handleDelete = useCallback(
    async (id: string) => {
      const plan = planes.find((p) => p.id === id);
      const nombre = plan ? `"${plan.nombre}"` : "";
      if (
        window.confirm(
          `¿Seguro que deseas borrar el plan ${nombre}? Esta acción no se puede deshacer.`
        )
      ) {
        await deletePlan(id);
        reloadAll();
      }
    },
    [planes, reloadAll]
  );

  const handleAnalyze = useCallback(async (id: string) => {
    const fb = await analyzePlan(id); // ⬅️ devuelve feedback
    setPlanes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, feedback: fb } : p))
    );
    return fb; // devolvemos al List
  }, []);

  /* ---------- tarjetas resumen ------------ */
  const resumen = [
    { label: "Planes creados", value: planes.length },
    {
      label: "Análisis IA pendientes",
      value: planes.filter((p) => !p.feedback).length,
    },
    {
      label: "Objetivos impactados",
      value: new Set(
        planes.flatMap((p) =>
          p.feedback ? Object.keys(p.feedback.impacto_estimado) : []
        )
      ).size,
    },
  ];

  /* ------------------- UI ----------------- */
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            SmartPlans EAFIT
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* Resumen */}
        <Grid container spacing={2} wrap="nowrap" mb={4}>
          {resumen.map((c) => (
            <Grid
              key={c.label}
              item
              sx={{
                flex: "1 1 0%" /* 2️⃣ reparte el ancho disponible */,
                display: "flex",
              }}
            >
              <Card sx={{ width: "100%", height: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4, // más aire vertical
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {c.label}
                  </Typography>
                  <Typography variant="h4">{c.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Crear */}
        <PlanForm onCreated={handleCreated} />

        {/* Editar */}
        {editing && (
          <PlanForm
            initialData={editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        )}

        {/* Listado */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Mis Planes Estratégicos
          </Typography>
          <PlanList
            planes={planes}
            onAnalyze={handleAnalyze}
            onDelete={handleDelete}
            onEdit={(p) => setEditing(p)}
          />
        </Box>
      </Container>
    </>
  );
}
