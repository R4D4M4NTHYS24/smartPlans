// src/components/__tests__/PlanList.test.tsx
import { render, screen } from "@testing-library/react";
import PlanList from "../PlanList";
import type { PlanDTO, FeedbackIA } from "../../services/planService";

// un plan dummy sin feedback
const dummyPlanes: PlanDTO[] = [
  {
    id: "1",
    nombre: "Proyecto X",
    responsable: "Ana",
    cargo: "PM",
    objetivo: "Mejorar UI",
    fecha: "2025-12-31",
    prioridad: "Alta",
    descripcion: "Descripción",
    acciones: [],
    feedback: null,
  },
];

test("muestra el nombre de cada plan", () => {
  render(
    <PlanList
      planes={dummyPlanes}
      onAnalyze={async () => ({} as FeedbackIA)}
      onDelete={() => {}}
      onEdit={() => {}}
    />
  );

  // debe renderizar "Proyecto X" en el documento
  expect(screen.getByText("Proyecto X")).toBeInTheDocument();
});
