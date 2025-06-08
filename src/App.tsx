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

  const handleAnalyze = useCallback(
    async (id: string) => {
      const fb: FeedbackIA = await analyzePlan(id);
      reloadAll();
      alert(
        "🛡️ Riesgos:\n" +
          fb.riesgos.join("\n") +
          "\n\n💡 Sugerencias:\n" +
          fb.sugerencias.join("\n")
      );
    },
    [reloadAll]
  );

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
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="/Logo_EAFIT.png"
            alt="EAFIT"
            sx={{ height: 40, ml: 2 }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            SmartPlans EAFIT
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* Resumen */}
        <Grid container spacing={2} justifyContent="center" mb={4}>
          {resumen.map((c) => (
            <Grid key={c.label} item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
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
