import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  CircularProgress,
} from "@mui/material";

import UploadFilesComponent from "../../UploadFilesComponent";
import { createUploadFile } from "../../../api/uploadFiles.api";
import InfoIcon from "@mui/icons-material/Info";
import { notification } from "antd";
import {
  actualizarServicio,
  crearServicio,
  obtenerServicioporID,
} from "../../../api/servicios.service";

const ServiciosForm = ({ servicioId, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    active: true,
  });

  const [files, setFiles] = useState([]);
  const [imageOption, setImageOption] = useState("url");
  const [imageError, setImageError] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    if (servicioId) {
      fetchServicioDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicioId]);

  const fetchServicioDetails = async () => {
    try {
      const response = await obtenerServicioporID(servicioId);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching  details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageOptionChange = (e) => {
    setFormData({ ...formData, image: "" });
    setImageOption(e.target.value);
  };

  const handleImageUploadValidation = (file) => {
    const minWidth = 1200;
    const minHeight = 800;
    const image = new Image();
    image.onload = () => {
      if (image.width < minWidth || image.height < minHeight) {
        setImageError(
          `La imagen debe tener al menos ${minWidth}x${minHeight} px.`
        );
      } else {
        setImageError("");
      }
    };
    image.src = URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageOption === "upload" && files.length > 0) {
      if (imageError) return; // Don't submit if there's an image error
      const resultImage = await createUploadFile(files[0]);
      if (resultImage.url) {
        formData.image = resultImage.url;
      }
    }
    try {
      setDisabledButton(true);
      if (servicioId) {
        await actualizarServicio(servicioId, formData);
      } else {
        await crearServicio(formData);
      }
      notification["success"]({
        message: `Se ${
          servicioId ? "actualizó" : "creo"
        } el servicio exitosamente`,
      });
      refresh();
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      notification["error"]({
        message: `No se pudo ${
          servicioId ? "actualizar" : "crear"
        } el Servicio`,
      });
    } finally {
      setDisabledButton(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        {servicioId ? "Editar servicio" : "Nuevo servicio"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline // This makes it a TextArea
              rows={4} // Adjust this value as needed for the height of the TextArea
            />
          </Grid>

          {/* Image URL or Image Upload Selection */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="imageOption"
                value={imageOption}
                onChange={handleImageOptionChange}
              >
                <FormControlLabel
                  value="url"
                  control={<Radio />}
                  label="URL de la Imagen"
                />
                <FormControlLabel
                  value="upload"
                  control={<Radio />}
                  label="Subir Imagen"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Conditionally render based on the selected image option */}
          {imageOption === "url" ? (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la Imagen"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
              {/* <FormHelperText sx={{ color: "text.secondary" }}>
                Tamaño ideal: 1920px x 1080px o superior, tamaño mínimo
                recomendado: 1200px x 800px. Formatos aceptados: WEBP, JPG, PNG.
              </FormHelperText> */}
            </Grid>
          ) : (
            <Grid item xs={12}>
              <UploadFilesComponent
                files={files}
                setFiles={setFiles}
                multiple={false}
                accept="*/image"
                maxFiles={1}
                text="Arrastre y suelte la imagen, o haga click para seleccionarla"
                onFileChange={(file) => handleImageUploadValidation(file)}
              />
              {imageError && (
                <Box display="flex" alignItems="center" color="error.main">
                  <IconButton size="small" sx={{ marginRight: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{imageError}</Typography>
                </Box>
              )}
              {/* <FormHelperText sx={{ color: "text.secondary" }}>
                Tamaño ideal: 1920px x 1080px o superior, tamaño mínimo
                recomendado: 1200px x 800px. Formatos aceptados: WEBP, JPG, PNG.
              </FormHelperText> */}
            </Grid>
          )}
        </Grid>

        {/* Center the save and cancel buttons */}
        <Box mt={2} display="flex" justifyContent="center" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            sx={{ marginRight: 2 }}
            disabled={disabledButton}
          >
            {disabledButton ? <CircularProgress /> : "Guardar"}
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

export default ServiciosForm;
