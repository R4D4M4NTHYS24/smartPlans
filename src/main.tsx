import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlansProvider } from "./context/PlansContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const theme = createTheme({
  palette: {
    // Cyan "HUD" from your web design system (accent: 34 211 238)
    primary: { main: "#22D3EE", contrastText: "#001418" },
    secondary: { main: "#e87722" },

    // Optional but useful: many MUI components use "info" by default
    info: { main: "#22D3EE", contrastText: "#001418" },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <PlansProvider>
        <App />
      </PlansProvider>
    </LocalizationProvider>
  </ThemeProvider>
);
