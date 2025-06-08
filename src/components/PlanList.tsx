// src/components/PlanList.tsx
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import type { PlanDTO } from "../services/planService";

interface PlanListProps {
  planes: PlanDTO[];
  onAnalyze: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (plan: PlanDTO) => void;
}

export default function PlanList({
  planes,
  onAnalyze,
  onDelete,
  onEdit,
}: PlanListProps) {
  return (
    <Grid container spacing={2}>
      {planes.map((p) => (
        <Grid item xs={12} sm={6} md={4} key={p.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{p.nombre}</Typography>
              <Typography variant="body2">
                Responsable: {p.responsable}
              </Typography>
              <Typography variant="body2">Objetivo: {p.objetivo}</Typography>
            </CardContent>
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", p: 1, gap: 1 }}
            >
              <Button size="small" onClick={() => onAnalyze(p.id)}>
                Analizar
              </Button>
              <Button size="small" onClick={() => onEdit(p)}>
                Editar
              </Button>
              <Button size="small" color="error" onClick={() => onDelete(p.id)}>
                Borrar
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
