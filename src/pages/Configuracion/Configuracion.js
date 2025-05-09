import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  CircularProgress,
} from "@mui/material";

import UploadFilesComponent from "../../components/UploadFilesComponent";
import InfoIcon from "@mui/icons-material/Info";
import {
  actualizarEmpresa,
  crearEmpresa,
  obtenerEmpresa,
} from "../../api/empresa.service";
import { createUploadFile } from "../../api/uploadFiles.api";
import { notification } from "antd";

import Loader from "../../components/ComponentesHome/Loader";

export default function Configuracion() {
  const [empresa, setEmpresa] = useState({
    name: "",
    telefono: "",
    celular: "",
    email: "",
    web: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    tiktok: "",
    direccion: "",
    description: "",
    logoUrl: "",
    horarios: [
      { nombre: "Lunes a Viernes", apertura: "", cierre: "" },
      { nombre: "Sábados", apertura: "", cierre: "" },
    ],
  });
  const [disabledButton, setDisabledButton] = useState(false);
  const [imageOption, setImageOption] = useState("url"); // Estado para elegir entre 'url' o 'file'
  const [files, setFiles] = useState([]);
  const [imageError, setImageError] = useState("");
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleImageUploadValidation = (file) => {
    // Validar el archivo cargado (tipo, tamaño, etc.)
    if (
      file &&
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setImageError("Formato de imagen no soportado. Use JPG, PNG o WEBP.");
    } else if (file && file.size > 5000000) {
      // 5MB máximo
      setImageError("El archivo es demasiado grande. Tamaño máximo: 5MB.");
    } else {
      setImageError("");
    }
  };
  const fetchEmpresaData = async () => {
    setLoading(true);
    try {
      const result = await obtenerEmpresa();

      if (result.data) {
        setEmpresa(result.data);
      }
    } catch (error) {
      console.log("error al obtener informacion de empresa", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresaData();
  }, [reload]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageOption === "upload" && files.length > 0) {
      if (imageError) return; // Don't submit if there's an image error
      const resultImage = await createUploadFile(files[0]);
      if (resultImage.url) {
        empresa.logoUrl = resultImage.url;
      }
    }
    try {
      setDisabledButton(true);
      if (empresa?._id) {
        await actualizarEmpresa(empresa._id, empresa);
      } else {
        await crearEmpresa(empresa);
      }
      notification["success"]({
        message: `Se ${
          empresa?._id ? "actualizó" : "creo"
        } la configuración de la empresa exitosamente`,
      });
      setReload(!reload);
    } catch (error) {
      console.error("Error saving header:", error);
      notification["error"]({
        message: `No se pudo ${
          empresa?._id ? "actualizar" : "crear"
        } la empresa`,
      });
    } finally {
      setDisabledButton(false);
    }
  };

  const handleImageOptionChange = (e) => {
    setEmpresa({ ...empresa, logoUrl: "" });
    setImageOption(e.target.value);
  };
  // ✅ Método para actualizar apertura/cierre
  const handleHorarioChange = (e, horario) => {
    const { name, value } = e.target;

    setEmpresa((prev) => ({
      ...prev,
      horarios: prev.horarios.map((h) =>
        h.codigo === horario.codigo ? { ...h, [name]: value } : h
      ),
    }));
  };

  // ✅ Método para eliminar un horario
  const handleEliminarHorario = (horario) => {
    setEmpresa((prev) => ({
      ...prev,
      horarios: prev.horarios.filter((h) => h.codigo !== horario.codigo),
    }));
  };

  // ✅ Método para agregar un nuevo horario
  const handleAddHorario = () => {
    const nuevoHorario = {
      codigo: Date.now().toString(), // Genera un ID temporal
      nombre: "",
      apertura: "09:00",
      cierre: "18:00",
    };

    setEmpresa((prev) => ({
      ...prev,
      horarios: [...prev.horarios, nuevoHorario],
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configuración de la Empresa
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Datos de la Empresa */}
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Nombre de la Empresa"
              name="name"
              value={empresa.name}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={empresa.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              size="small"
            />
          </Grid> */}
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={empresa.telefono}
              onChange={handleChange}
              required
              size="small"
              type="tel"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Celular"
              name="celular"
              value={empresa?.celular}
              onChange={handleChange}
              required
              size="small"
              type="tel"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={empresa?.email}
              onChange={handleChange}
              required
              size="small"
              type="email"
            />
          </Grid>
          {/* <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Página Web"
              name="web"
              value={empresa.web}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid> */}

          {/* Redes Sociales */}
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Instagram"
              name="instagram"
              value={empresa?.instagram}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Facebook"
              name="facebook"
              value={empresa?.facebook}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Tiktok"
              name="tiktok"
              value={empresa.tiktok}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={empresa?.direccion}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={7}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={empresa.description}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          {/* Horarios de la Empresa */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Horarios de Atención
            </Typography>

            {empresa.horarios.map((dia) => (
              <Grid container spacing={2} key={dia.codigo}>
                <Grid item xs={4} sm={3}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={dia.nombre}
                    onChange={(e) => handleHorarioChange(e, dia)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={4} sm={2} marginBottom={1}>
                  <TextField
                    fullWidth
                    label="Apertura"
                    name="apertura"
                    value={dia.apertura}
                    onChange={(e) => handleHorarioChange(e, dia)}
                    size="small"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={4} sm={2} marginBottom={1}>
                  <TextField
                    fullWidth
                    label="Cierre"
                    name="cierre"
                    value={dia.cierre}
                    onChange={(e) => handleHorarioChange(e, dia)}
                    size="small"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={1} sm={1} marginBottom={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleEliminarHorario(dia)}
                    sx={{ height: "100%" }}
                  >
                    Eliminar
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12} marginTop={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddHorario}
              >
                Agregar Horario
              </Button>
            </Grid>
          </Grid>
          {/* Logo URL o Upload */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Logo de la Empresa
            </Typography>

            {/* Selector de opción de logo */}
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

            {/* Condicional para mostrar URL o subir archivo */}
            {imageOption === "url" ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL de la Imagen"
                  name="logoUrl"
                  value={empresa.logoUrl}
                  onChange={handleChange}
                  size="small"
                  helperText="Ingrese la URL del logo o suba un archivo"
                />
                {/* <FormHelperText sx={{ color: "text.secondary" }}>
                  Tamaño ideal: 1920px x 1080px o superior, tamaño mínimo
                  recomendado: 1200px x 800px. Formatos aceptados: WEBP, JPG,
                  PNG.
                </FormHelperText> */}
              </Grid>
            ) : (
              <Grid item xs={12}>
                <UploadFilesComponent
                  files={files}
                  setFiles={setFiles}
                  multiple={false}
                  accept="image/*"
                  maxFiles={1}
                  text="Arrastre y suelte la imagen, o haga click para seleccionarla"
                  onFileChange={handleImageUploadValidation}
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
                  recomendado: 1200px x 800px. Formatos aceptados: WEBP, JPG,
                  PNG.
                </FormHelperText> */}
              </Grid>
            )}
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "right", marginTop: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={disabledButton}
          >
            {disabledButton ? <CircularProgress /> : "Guardar"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
