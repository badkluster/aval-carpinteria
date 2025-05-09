import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Switch,
  CircularProgress,
} from "@mui/material";
import { notification } from "antd";
import {
  actualizarCliente,
  crearCliente,
  obtenerClienteporID,
} from "../../../api/clientes.service";

const ClientForm = ({ id, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    docNumber: "",
    notes: "",
    active: true,
  });

  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClientDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchClientDetails = async () => {
    try {
      const response = await obtenerClienteporID(id);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActiveChange = (e) => {
    setFormData((prev) => ({ ...prev, active: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setDisabledButton(true);
      if (id) {
        await actualizarCliente(id, formData);
      } else {
        await crearCliente(formData);
      }
      notification.success({
        message: `Se ${id ? "actualizó" : "creó"} el cliente exitosamente`,
      });
      refresh();
      onClose();
    } catch (error) {
      notification.error({
        message: `No se pudo ${id ? "actualizar" : "crear"} el cliente`,
      });
      console.error("Error saving client:", error);
    } finally {
      setDisabledButton(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 3, maxWidth: "600px", margin: "0 auto" }}
    >
      <Typography variant="h5" gutterBottom>
        {id ? "Editar Cliente" : "Nuevo Cliente"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Nombre */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          {/* Teléfono */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          {/* Dirección */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          {/* Código Postal */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Código Postal"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </Grid>
          {/* Documento */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número de Documento"
              name="docNumber"
              value={formData.docNumber}
              onChange={handleChange}
            />
          </Grid>
          {/* Notas */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notas"
              name="notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange}
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

export default ClientForm;
