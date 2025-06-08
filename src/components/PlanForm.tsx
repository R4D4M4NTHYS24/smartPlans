// src/components/PlanForm.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createPlan, updatePlan } from "../services/planService";
import type { Plan } from "../services/planService";

interface PlanFormProps {
  initialData?: Plan;
  onCreated?: () => void;
  onSaved?: () => void;
  onCancel?: () => void;
}

export default function PlanForm({
  initialData,
  onCreated,
  onSaved,
  onCancel,
}: PlanFormProps) {
  const isEdit = Boolean(initialData);
  const [open, setOpen] = useState(isEdit);
  const [loading, setLoading] = useState(false);

  // Campos
  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [responsable, setResponsable] = useState(
    initialData?.responsable || ""
  );
  const [objetivo, setObjetivo] = useState(
    initialData?.objetivo || "Objetivo A"
  );
  const [fecha, setFecha] = useState<Date | null>(
    initialData ? new Date(initialData.fecha) : new Date()
  );
  const [prioridad, setPrioridad] = useState(initialData?.prioridad || "Media");
  const [descripcion, setDescripcion] = useState(
    initialData?.descripcion || ""
  );

  // Al abrir en modo edición recargamos
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setResponsable(initialData.responsable);
      setObjetivo(initialData.objetivo);
      setFecha(new Date(initialData.fecha));
      setPrioridad(initialData.prioridad);
      setDescripcion(initialData.descripcion);
      setOpen(true);
    }
  }, [initialData]);

  // Validación básica
  const isValid =
    !!nombre.trim() && !!responsable.trim() && !!descripcion.trim() && !!fecha;

  const handleClose = () => {
    setOpen(false);
    onCancel?.();
  };

  const handleSubmit = async () => {
    if (!isValid || !fecha) return;
    setLoading(true);

    const payload = {
      nombre: nombre.trim(),
      responsable: responsable.trim(),
      objetivo,
      fecha: fecha.toISOString().split("T")[0], // "YYYY-MM-DD"
      prioridad,
      descripcion: descripcion.trim(),
    };

    try {
      if (isEdit && initialData) {
        await updatePlan(initialData.id, payload);
        onSaved?.();
      } else {
        await createPlan(payload);
        onCreated?.(); // ⚠️ SOLO tras 201
      }
      setOpen(false);
    } catch (err: any) {
      if (err.response?.status === 422) {
        // FastAPI nos regresa detail: Array<{loc,msg, …}>
        const detail = err.response.data.detail as any[];
        const msg = detail
          .map(
            (d) =>
              `– ${d.loc.slice(1).join(".")}: ${
                d.msg
              }` /* loc: ['body','fecha'] */
          )
          .join("\n");
        alert(`Error de validación:\n${msg}`);
      } else {
        console.error(err);
        alert("Error inesperado al guardar. Ver consola.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!initialData && (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          + Nuevo Plan
        </Button>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{isEdit ? "Editar Plan" : "Crear Plan"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Responsable"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                fullWidth
                required
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <FormControl fullWidth required>
                <InputLabel>Objetivo</InputLabel>
                <Select
                  value={objetivo}
                  label="Objetivo"
                  onChange={(e) => setObjetivo(e.target.value as string)}
                >
                  {["Objetivo A", "Objetivo B", "Objetivo C"].map((o) => (
                    <MenuItem key={o} value={o}>
                      {o}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ flex: 1 }}>
                <DatePicker
                  label="Fecha límite"
                  value={fecha}
                  onChange={(v) => setFecha(v)}
                  slotProps={{
                    textField: { fullWidth: true, required: true },
                  }}
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={prioridad}
                  label="Prioridad"
                  onChange={(e) => setPrioridad(e.target.value as string)}
                >
                  {["Alta", "Media", "Baja"].map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading
              ? isEdit
                ? "Guardando…"
                : "Creando…"
              : isEdit
              ? "Guardar"
              : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
