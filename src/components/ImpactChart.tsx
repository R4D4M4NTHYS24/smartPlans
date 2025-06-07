// src/components/ImpactChart.tsx
import React from "react";
import { Box } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ImpactChart: React.FC = () => {
  const data = {
    labels: ["Objetivo A", "Objetivo B", "Objetivo C"],
    datasets: [
      {
        data: [3, 5, 2],
        backgroundColor: [
          "rgba(0,51,102,0.7)",
          "rgba(232,119,34,0.7)",
          "rgba(23,162,184,0.7)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 8,
        },
      },
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600, // controlas el ancho máximo si quieres
        height: 200, // ¡ALTURA FIJA!
        mx: "auto", // centra horizontalmente
      }}
    >
      <Doughnut data={data} options={options} />
    </Box>
  );
};

export default ImpactChart;
