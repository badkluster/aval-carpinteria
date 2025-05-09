import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { notification } from "antd";
import {
  actualizarReview,
  crearReview,
  obtenerReviewID,
} from "../../../api/testimonios.service";

const TestimoniosForm = ({ id, onClose, refresh }) => {
  console.log("id testimonio", id);
  const [formData, setFormData] = useState({
    reviewerName: "",
    description: "",
    date: new Date().toISOString(), // Almacena la fecha en formato ISO
    active: true,
  });
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReviewDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchReviewDetails = async () => {
    try {
      const response = await obtenerReviewID(id);

      console.log("response testimoinios", response);
      // Aseguramos que la fecha venga en formato ISO para el input type="date"
      setFormData({
        ...response.data,
        date: response.data?.date
          ? new Date(response.data?.date).toISOString()
          : new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching review details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Para el RadioGroup, se convierte el valor string a booleano

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setDisabledButton(true);
      if (id) {
        await actualizarReview(id, formData);
      } else {
        await crearReview(formData);
      }
      notification.success({
        message: `Se ${id ? "actualizó" : "creó"} el testimonio exitosamente`,
      });
      refresh();
      onClose();
    } catch (error) {
      notification.error({
        message: `No se pudo ${id ? "actualizar" : "crear"} el testimonio`,
      });
      console.error("Error saving review:", error);
    } finally {
      setDisabledButton(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        {id ? "Editar testimonio" : "Nuevo testimonio"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Nombre del revisor */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de la persona"
              name="reviewerName"
              value={formData.reviewerName}
              onChange={handleChange}
              required
            />
          </Grid>
          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          {/* Fecha de la reseña */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de la reseña"
              name="date"
              value={formData.date ? formData.date.split("T")[0] : ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={disabledButton}
            sx={{ mr: 2 }}
          >
            {disabledButton ? <CircularProgress size={20} /> : "Guardar"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            disabled={disabledButton}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TestimoniosForm;
