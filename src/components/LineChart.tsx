// src/components/LineChart.tsx
import React from "react";
import { Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart: React.FC = () => {
  const data = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: "Planes Creados",
        data: [2, 5, 3, 8],
        borderColor: "rgba(0,51,102,0.7)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false as const,
    plugins: {
      legend: { display: false },
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
      <Line data={data} options={options} />
    </Box>
  );
};

export default LineChart;
