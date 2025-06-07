import React from "react";
import { Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC = () => {
  const data = {
    labels: ["Objetivo A", "Objetivo B", "Objetivo C"],
    datasets: [
      {
        label: "Acciones por Objetivo",
        data: [12, 19, 7],
        backgroundColor: [
          "rgba(0,51,102,0.7)",
          "rgba(232,119,34,0.7)",
          "rgba(23,162,184,0.7)",
        ],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false as const,
    plugins: {
      legend: { display: false },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 12 } },
      },
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 200,
        mx: "auto",
      }}
    >
      <Bar data={data} options={options} />
    </Box>
  );
};

export default BarChart;
