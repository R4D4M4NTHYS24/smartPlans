// src/components/PlanForm.tsx
import React, { useState, useEffect, useRef } from "react";
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
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

  /* ------------------------ campos ------------------------ */
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [responsable, setResponsable] = useState(
    initialData?.responsable ?? ""
  );
  const [cargo, setCargo] = useState(initialData?.cargo ?? "");
  const [objetivo, setObjetivo] = useState(initialData?.objetivo ?? "");
  const [fecha, setFecha] = useState<Date | null>(
    initialData ? new Date(initialData.fecha) : new Date()
  );
  const [prioridad, setPrioridad] = useState(initialData?.prioridad ?? "Media");
  const [descripcion, setDescripcion] = useState(
    initialData?.descripcion ?? ""
  );

  /* ---------- helper para limpiar todos los campos ---------- */
  const resetFields = () => {
    setNombre("");
    setResponsable("");
    setCargo("");
    setObjetivo("");
    setFecha(new Date());
    setPrioridad("Media");
    setDescripcion("");
  };

  /* ------------------- descarga PDF ----------------------- */
  const printRef = useRef<HTMLDivElement>(null);

  const buildPlainNode = () => {
    const wrap = document.createElement("div");
    wrap.style.padding = "24px";
    wrap.style.fontFamily = "Inter, Roboto, sans-serif";
    wrap.style.width = "800px";
    wrap.innerHTML = `
      <h2 style="margin:0 0 16px">${nombre}</h2>
      <p><strong>Responsable:</strong> ${responsable}</p>
      <p><strong>Cargo:</strong> ${cargo}</p>
      <p><strong>Objetivo estratégico:</strong> ${objetivo}</p>
      <p><strong>Fecha límite:</strong> ${fecha?.toLocaleDateString() ?? ""}</p>
      <p><strong>Prioridad:</strong> ${prioridad}</p>
      <p><strong>Descripción:</strong><br/>${descripcion}</p>
      ${
        initialData?.feedback
          ? `
      <h3 style="margin:24px 0 8px 0">Análisis IA 🤖</h3>
      <h4 style="margin:8px 0">Riesgos</h4>
      <ul style="margin-top:4px">
        ${initialData.feedback.riesgos.map((r) => `<li>${r}</li>`).join("")}
      </ul>
      <h4 style="margin:8px 0">Sugerencias</h4>
      <ul style="margin-top:4px">
        ${initialData.feedback.sugerencias.map((s) => `<li>${s}</li>`).join("")}
      </ul>
      <h4 style="margin:8px 0">Impacto estimado</h4>
      <ul style="margin-top:4px">
        ${Object.entries(initialData.feedback.impacto_estimado)
          .map(([k, v]) => `<li>${k}: ${v}%</li>`)
          .join("")}
      </ul>
      `
          : ""
      }
    `;
    return wrap;
  };

  const handleDownload = async () => {
    const node = buildPlainNode();
    document.body.appendChild(node);
    const canvas = await html2canvas(node, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "px", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`${nombre || "plan"}.pdf`);
    document.body.removeChild(node);
  };

  /* ------------- on mount (modo edición) ------------------ */
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setResponsable(initialData.responsable);
      setCargo(initialData.cargo);
      setObjetivo(initialData.objetivo);
      setFecha(new Date(initialData.fecha));
      setPrioridad(initialData.prioridad);
      setDescripcion(initialData.descripcion);
      setOpen(true);
    }
  }, [initialData]);

  /* -------------------- validación ------------------------ */
  const isValid =
    !!nombre.trim() &&
    !!responsable.trim() &&
    !!cargo.trim() &&
    !!descripcion.trim() &&
    !!fecha;

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
      cargo: cargo.trim(),
      objetivo: objetivo.trim(),
      fecha: fecha.toISOString().split("T")[0],
      prioridad,
      descripcion: descripcion.trim(),
    };

    try {
      if (isEdit && initialData) {
        await updatePlan(initialData.id, payload);
        onSaved?.();
      } else {
        await createPlan(payload);
        onCreated?.();
        resetFields(); // ← limpia tras crear
      }
      setOpen(false);
    } catch (err: any) {
      if (err.response?.status === 422) {
        const detail = err.response.data.detail as any[];
        const msg = detail
          .map((d) => `– ${d.loc.slice(1).join(".")}: ${d.msg}`)
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

  /* -------------- data para gráfico ----------------------- */
  let chartData: { name: string; value: number }[] = [];
  let mainImpact = 0;
  if (initialData?.feedback) {
    const entries = Object.entries(initialData.feedback.impacto_estimado);
    const total = entries.reduce((acc, [, v]) => acc + v, 0);
    chartData = entries.map(([name, value]) => ({ name, value }));
    if (total < 100) chartData.push({ name: "Resto", value: 100 - total });
    mainImpact = entries[0][1];
  }

  /* -------------------- UI ------------------------------ */
  return (
    <>
      {!initialData && (
        <Button
          variant="contained"
          onClick={() => {
            resetFields(); // ← limpia antes de abrir creación
            setOpen(true);
          }}
          sx={{ mb: 2 }}
        >
          + Nuevo Plan
        </Button>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          {isEdit ? "Editar Plan" : "Crear Plan"}
          {initialData?.feedback && (
            <Button
              size="small"
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={handleDownload}
            >
              Descargar PDF
            </Button>
          )}
        </DialogTitle>

        <DialogContent ref={printRef} dividers>
          {/* formulario */}
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
              <TextField
                label="Cargo"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                fullWidth
                required
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Objetivo estratégico"
                placeholder="Ej.: Aumentar cuota B2B en 15 %"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                fullWidth
                required
              />

              <Box sx={{ flex: 1 }}>
                <DatePicker
                  label="Fecha límite"
                  value={fecha}
                  onChange={(v) => setFecha(v)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
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

          {/* feedback IA */}
          {initialData?.feedback && (
            <Box mt={4} p={2} bgcolor="#F9FAFC" borderRadius={2}>
              <Typography variant="subtitle1" gutterBottom>
                Análisis IA 🤖
              </Typography>

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={
                          idx === 0
                            ? mainImpact >= 80
                              ? "#4caf50"
                              : mainImpact >= 60
                              ? "#ff9800"
                              : "#1976d2"
                            : "#e0e0e0"
                        }
                      />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="20"
                    fill="#424242"
                  >
                    {`${mainImpact}%`}
                  </text>
                </PieChart>
              </ResponsiveContainer>

              <Typography variant="subtitle2">Riesgos</Typography>
              <List dense>
                {initialData.feedback.riesgos.map((r) => (
                  <ListItem key={r}>
                    <ListItemText primary={r} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle2">Sugerencias</Typography>
              <List dense>
                {initialData.feedback.sugerencias.map((s) => (
                  <ListItem key={s}>
                    <ListItemText primary={s} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle2">Impacto estimado</Typography>
              <List dense>
                {Object.entries(initialData.feedback.impacto_estimado).map(
                  ([obj, v]) => (
                    <ListItem key={obj}>
                      <ListItemText
                        primary={`Probabilidad modelada por IA de cumplir el objetivo: ${v}%`}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </Box>
          )}
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
