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
import {
  actualizarCategoria,
  crearCategoria,
  obtenerCategoriaporID,
} from "../../../api/category.services";
import { notification } from "antd";

const CategoryForm = ({ headerId, onClose, refreshHeaders }) => {
  const [formData, setFormData] = useState({
    titulo: "",

    imagen: "",
    active: true,
  });

  const [files, setFiles] = useState([]);
  const [imagenOption, setImageOption] = useState("url");
  const [imagenError, setImageError] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    if (headerId) {
      fetchHeaderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerId]);

  const fetchHeaderDetails = async () => {
    try {
      const response = await obtenerCategoriaporID(headerId);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching header details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageOptionChange = (e) => {
    setFormData({ ...formData, imagen: "" });
    setImageOption(e.target.value);
  };

  const handleImageUploadValidation = (file) => {
    const minWidth = 1200;
    const minHeight = 800;
    const imagen = new Image();
    imagen.onload = () => {
      if (imagen.width < minWidth || imagen.height < minHeight) {
        setImageError(
          `La imagenn debe tener al menos ${minWidth}x${minHeight} px.`
        );
      } else {
        setImageError("");
      }
    };
    imagen.src = URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagenOption === "upload" && files.length > 0) {
      if (imagenError) return; // Don't submit if there's an imagen error
      const resultImage = await createUploadFile(files[0]);
      if (resultImage.url) {
        formData.imagen = resultImage.url;
      }
    }
    try {
      setDisabledButton(true);
      if (headerId) {
        await actualizarCategoria(headerId, formData);
      } else {
        await crearCategoria(formData);
      }
      notification["success"]({
        message: `Se ${
          headerId ? "actualizó" : "creo"
        } la categoría exitosamente`,
      });
      refreshHeaders();
      onClose();
    } catch (error) {
      notification["error"]({
        message: `No se pudo ${headerId ? "actualizar" : "crear"} la categoría`,
      });
      console.error("Error saving header:", error);
    } finally {
      setDisabledButton(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        {headerId ? "Editar categoría" : "Nueva categoría"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título"
              name="titulo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Image URL or Image Upload Selection */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="imagenOption"
                value={imagenOption}
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

          {/* Conditionally render based on the selected imagen option */}
          {imagenOption === "url" ? (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la Imagen"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                required
              />
              {/* <FormHelperText sx={{ color: "text.secondary" }}>
                Tamaño ideal: 1920px x 1080px o superior, tamaño mínimo
                recomendado: 1200px x 800px. Formatos aceptados: JPG, PNG.
              </FormHelperText> */}
            </Grid>
          ) : (
            <Grid item xs={12}>
              <UploadFilesComponent
                files={files}
                setFiles={setFiles}
                multiple={false}
                accept="*/imagen"
                maxFiles={1}
                text="Arrastre y suelte la imagen, o haga click para seleccionarla"
                onFileChange={(file) => handleImageUploadValidation(file)}
              />
              {imagenError && (
                <Box display="flex" alignItems="center" color="error.main">
                  <IconButton size="small" sx={{ marginRight: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">{imagenError}</Typography>
                </Box>
              )}
              {/* <FormHelperText sx={{ color: "text.secondary" }}>
                Tamaño ideal: 1920px x 1080px o superior, tamaño mínimo
                recomendado: 1200px x 800px. Formatos aceptados: JPG, PNG.
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

export default CategoryForm;
