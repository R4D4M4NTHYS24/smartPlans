// src/components/PlanList.tsx
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
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import type { PlanDTO, FeedbackIA } from "../services/planService";

interface Props {
  planes: PlanDTO[];
  onAnalyze: (id: string) => Promise<FeedbackIA>;
  onDelete: (id: string) => void;
  onEdit: (p: PlanDTO) => void;
}

export default function PlanList({
  planes,
  onAnalyze,
  onDelete,
  onEdit,
}: Props) {
  /* ---------- feedback / modales ---------- */
  const [dlgFeedback, setDlgFeedback] = useState<{
    open: boolean;
    data?: FeedbackIA;
  }>({ open: false });

  const [dlgConfirm, setDlgConfirm] = useState<{ open: boolean; id?: string }>({
    open: false,
  });

  const [loadingId, setLoadingId] = useState<string | null>(null);

  /* ------------ snackbar éxito ------------ */
  const [toast, setToast] = useState(false);

  const lanzarAnalisis = async (id: string) => {
    setLoadingId(id);
    const fb = await onAnalyze(id);
    setLoadingId(null);
    setDlgFeedback({ open: true, data: fb });
    setToast(true); // ← disparar snackbar
  };

  return (
    <>
      {/* === LISTA ======================================================= */}
      <Grid container direction="column" spacing={2}>
        {planes.map((p) => {
          const score =
            p.feedback && Object.values(p.feedback.impacto_estimado)[0];

          const procesando = loadingId === p.id;

          return (
            <Grid item xs={12} key={p.id}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h6">{p.nombre}</Typography>
                  <Typography variant="body2">
                    Responsable: {p.responsable}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Objetivo: {p.objetivo}
                  </Typography>

                  {score !== undefined && (
                    <Chip
                      label={`Impacto ${score}%`}
                      color={
                        score >= 80
                          ? "success"
                          : score >= 60
                          ? "warning"
                          : "default"
                      }
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
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
                    disabled={procesando || !!p.feedback}
                    onClick={
                      () =>
                        setDlgConfirm({ open: true, id: p.id }) /* ⚠️ nuevo */
                    }
                  >
                    {procesando ? (
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
          );
        })}
      </Grid>

      {/* === MODAL CONFIRMACIÓN IA ====================================== */}
      <Dialog
        open={dlgConfirm.open}
        onClose={() => setDlgConfirm({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>¿Deseas ejecutar la IA?</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            Vamos a analizar tu plan con nuestro modelo de Inteligencia
            Artificial para detectar riesgos, sugerencias e impacto estimado.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El proceso tarda unos segundos. ¡Prepárate para ver insights
            valiosos en tiempo real!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgConfirm({ open: false })}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (dlgConfirm.id) lanzarAnalisis(dlgConfirm.id);
              setDlgConfirm({ open: false });
            }}
          >
            Analizar ahora
          </Button>
        </DialogActions>
      </Dialog>

      {/* === MODAL FEEDBACK IA ========================================= */}
      <Dialog
        open={dlgFeedback.open}
        onClose={() => setDlgFeedback({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Análisis IA</DialogTitle>
        <DialogContent dividers>
          {dlgFeedback.data && (
            <>
              <Typography variant="subtitle1">Riesgos</Typography>
              <List dense>
                {dlgFeedback.data.riesgos.map((r) => (
                  <ListItem key={r}>
                    <ListItemText primary={r} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle1">Sugerencias</Typography>
              <List dense>
                {dlgFeedback.data.sugerencias.map((s) => (
                  <ListItem key={s}>
                    <ListItemText primary={s} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle1">Impacto estimado</Typography>
              <List dense>
                {Object.entries(dlgFeedback.data.impacto_estimado).map(
                  ([obj, v]) => (
                    <ListItem key={obj}>
                      <ListItemText primary={`${obj}: ${v}%`} />
                    </ListItem>
                  )
                )}
              </List>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* === SNACKBAR =================================================== */}
      <Snackbar
        open={toast}
        autoHideDuration={4000}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Análisis IA completado!
        </Alert>
      </Snackbar>
    </>
  );
}
