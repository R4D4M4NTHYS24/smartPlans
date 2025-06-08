// src/components/PlanList.tsx  (sólo cambia el render del botón Analizar)
import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import type { PlanDTO, FeedbackIA } from "../services/planService";

export default function PlanList({ planes, onAnalyze, onDelete, onEdit }) {
  /* state local para feedback */
  const [dlg, setDlg] = useState<{ open: boolean; data?: FeedbackIA }>({
    open: false,
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const lanzarAnalisis = async (id: string) => {
    setLoadingId(id);
    const fb = await onAnalyze(id); // devolvemos feedback desde App
    setLoadingId(null);
    setDlg({ open: true, data: fb });
  };

  return (
    <>
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
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 1,
                  gap: 1,
                }}
              >
                <Button
                  size="small"
                  disabled={!!loadingId || !!p.feedback}
                  onClick={() => lanzarAnalisis(p.id)}
                >
                  {loadingId === p.id ? (
                    <CircularProgress size={16} />
                  ) : p.feedback ? (
                    "Analizado"
                  ) : (
                    "Analizar"
                  )}
                </Button>
                <Button size="small" onClick={() => onEdit(p)}>
                  Editar
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => onDelete(p.id)}
                >
                  Borrar
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog resultado IA */}
      <Dialog
        open={dlg.open}
        onClose={() => setDlg({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Feedback IA</DialogTitle>
        <DialogContent dividers>
          {dlg.data && (
            <>
              <Typography variant="subtitle1">Riesgos</Typography>
              <List dense>
                {dlg.data.riesgos.map((r) => (
                  <ListItem key={r}>
                    <ListItemText primary={r} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle1">Sugerencias</Typography>
              <List dense>
                {dlg.data.sugerencias.map((s) => (
                  <ListItem key={s}>
                    <ListItemText primary={s} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle1">Impacto estimado</Typography>
              <List dense>
                {Object.entries(dlg.data.impacto_estimado).map(([obj, v]) => (
                  <ListItem key={obj}>
                    <ListItemText primary={`${obj}: ${v}%`} />{" "}
                    {/* % en vez de /10 */}
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
