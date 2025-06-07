import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import ImpactChart from "./components/ImpactChart";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import PlanForm from "./components/PlanForm";
import PlanList from "./components/PlanList";

const App: React.FC = () => {
  const cards = [
    { label: "Planes creados", value: 0 },
    { label: "Análisis IA pendientes", value: 0 },
    { label: "Objetivos impactados", value: 0 },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="/Logo_EAFIT.png"
            alt="EAFIT"
            sx={{ height: 40, ml: 2 }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            SmartPlans EAFIT
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* Gráficos Generales: mismo layout que las cards de resumen */}
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={2}
          mb={4}
        >
          {[ImpactChart, BarChart, LineChart].map((Chart, i) => (
            <Card key={i} sx={{ flex: "1 1 200px", maxWidth: 400 }}>
              <CardContent>
                {/* Opcional: un título pequeño aquí */}
                {/* <Typography variant="subtitle2" gutterBottom>
            {i === 0 ? "Distribución" : i === 1 ? "Barras" : "Tendencia"}
          </Typography> */}
                <Chart />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Tarjetas de resumen */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
          {cards.map((c) => (
            <Card key={c.label} sx={{ flex: "1 1 200px" }}>
              <CardContent>
                <Typography variant="subtitle2">{c.label}</Typography>
                <Typography variant="h4">{c.value}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Formulario de creación */}
        <PlanForm />

        {/* Lista de planes */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Mis Planes Estratégicos
          </Typography>
          <PlanList />
        </Box>
      </Container>
    </>
  );
};

export default App;
