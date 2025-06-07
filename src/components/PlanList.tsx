// src/components/PlanList.tsx
import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { usePlans } from "../context/PlansContext";

const PlanList: React.FC = () => {
  const { planes, loading, analyzePlan, updatePlan, deletePlan } = usePlans();

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      {planes.map((plan) => (
        <Grid item key={plan.id} xs={12} sm={6} md={4}>
          <motion.div whileHover={{ y: -4 }}>
            <Card elevation={1}>
              <CardHeader
                title={plan.nombre}
                action={
                  <Chip label={plan.objetivo} color="secondary" size="small" />
                }
              />
              <CardContent>
                <Typography variant="body2">
                  Acciones: {plan.accionesCount}
                </Typography>
                <Typography
                  variant="body2"
                  color={plan.iaDone ? "success.main" : "warning.main"}
                >
                  IA {plan.iaDone ? "Listo" : "Pendiente"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => updatePlan(plan)}>
                  Editar
                </Button>
                <Button size="small" onClick={() => analyzePlan(plan.id)}>
                  Analizar IA
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => deletePlan(plan.id)}
                >
                  Borrar
                </Button>
              </CardActions>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlanList;
