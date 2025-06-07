// src/main.tsx (o index.tsx)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlansProvider } from "./context/PlansContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const theme = createTheme({
  palette: { primary: { main: "#003366" }, secondary: { main: "#e87722" } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <PlansProvider>
        <App />
      </PlansProvider>
    </LocalizationProvider>
  </ThemeProvider>
);
