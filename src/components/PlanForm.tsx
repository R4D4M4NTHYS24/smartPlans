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

interface PlanFormProps {
  initialData?: {
    nombre: string;
    responsable: string;
    objetivo: string;
    fecha: Date | null;
    prioridad: string;
    descripcion: string;
  };
  onSave: (data: {
    nombre: string;
    responsable: string;
    objetivo: string;
    fecha: Date | null;
    prioridad: string;
    descripcion: string;
  }) => void;
  onCancel?: () => void;
}

const PlanForm: React.FC<PlanFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(initialData?.nombre || "");
  const [responsable, setResponsable] = useState(
    initialData?.responsable || ""
  );
  const [objetivo, setObjetivo] = useState(
    initialData?.objetivo || "Objetivo A"
  );
  const [fecha, setFecha] = useState<Date | null>(
    initialData?.fecha || new Date()
  );
  const [prioridad, setPrioridad] = useState(initialData?.prioridad || "Media");
  const [descripcion, setDescripcion] = useState(
    initialData?.descripcion || ""
  );

  useEffect(() => {
    if (initialData) setOpen(true);
  }, [initialData]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onCancel && onCancel();
  };
  const handleSubmit = () => {
    if (isValid)
      onSave({ nombre, responsable, objetivo, fecha, prioridad, descripcion });
    setOpen(false);
  };

  const isValid =
    nombre.trim() !== "" &&
    responsable.trim() !== "" &&
    descripcion.trim() !== "" &&
    fecha !== null;

  return (
    <>
      {!initialData && (
        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
          + Nuevo Plan
        </Button>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {initialData ? "Editar Plan Estratégico" : "Crear Plan Estratégico"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* Fila 1 */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Nombre del plan"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                label="Responsable"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                required
                sx={{ flex: 1 }}
              />
            </Stack>
            {/* Fila 2 */}
            <Stack direction="row" spacing={2}>
              <FormControl required sx={{ flex: 1 }}>
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
              <DatePicker
                label="Fecha límite"
                value={fecha}
                onChange={(val) => setFecha(val)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                sx={{ flex: 1 }}
              />
              <FormControl required sx={{ flex: 1 }}>
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
            {/* Fila 3 */}
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              multiline
              rows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {initialData ? "Guardar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlanForm;
