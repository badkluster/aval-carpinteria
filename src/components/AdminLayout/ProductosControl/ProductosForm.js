/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  crearProducto,
  actualizarProducto,
  obtenerProductoporID,
  eliminarImagenProducto,
} from "../../../api/products.service";
import { obtenerListaCategorias } from "../../../api/category.services";
import UploadFilesComponent from "../../UploadFilesComponent";
import { createUploadFile } from "../../../api/uploadFiles.api";
import { Image, notification } from "antd";
import Tags from "../../Tags";

const ProductoForm = ({ productoId, onClose, refreshProductos }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    cashPrice: 0,
    labels: [],
    category: null,
    images: [],
    pdfUrl: "",
    active: true,
    freeShipping: false,
    isFeatured: false,
    orderFeatured: 999,
    stock: 0,

    features: [],
    installments: [],
    interactions: 0,
  });

  const [categorias, setCategorias] = useState([]);
  const [files, setFiles] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);
  const [reload, setReload] = useState(false);
  const [price, setPrice] = useState("");
  const [cashPrice, setCashPrice] = useState("");

  // HANDLERS PARA PRECIOS
  const handlePriceChange = (event) => {
    let value = event.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
    setPrice(value);
    setFormData((prev) => ({ ...prev, price: parseFloat(value) }));
  };

  const handleCashPriceChange = (event) => {
    let value = event.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
    setCashPrice(value);
    setFormData((prev) => ({ ...prev, cashPrice: parseFloat(value) }));
  };

  const formatPrice = (value) => {
    if (!value || isNaN(parseFloat(value))) return "";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  // HANDLERS PARA INSTALLMENTS
  const addInstallment = () => {
    setFormData((prev) => ({
      ...prev,
      installments: [...(prev.installments || []), { qty: "", amount: "" }],
    }));
  };

  const removeInstallment = (index) => {
    setFormData((prev) => {
      const newInstallments = prev.installments.filter((_, i) => i !== index);
      return { ...prev, installments: newInstallments };
    });
  };

  const handleInstallmentChange = (index, field, value) => {
    setFormData((prev) => {
      const newInstallments = prev.installments.map((inst, i) =>
        i === index ? { ...inst, [field]: value } : inst
      );
      return { ...prev, installments: newInstallments };
    });
  };

  // OBTENCIÓN DE DATOS (categorías, marcas, tamaños, etc.)
  useEffect(() => {
    fetchCategorias();

    if (productoId) {
      fetchProductoDetails();
    }
  }, [productoId, reload]);

  const fetchCategorias = async () => {
    try {
      const response = await obtenerListaCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProductoDetails = async () => {
    try {
      const response = await obtenerProductoporID(productoId);
      setFormData(response.data);

      if (response.data.price) setPrice(formatPrice(response.data.price));
      if (response.data.cashPrice)
        setCashPrice(formatPrice(response.data.cashPrice));
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // HANDLER GENERAL PARA TEXTFIELD
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // HANDLER PARA AUTOCOMPLETE (almacena el objeto completo)
  const handleAutocompleteChange = (event, newValue, field) => {
    setFormData((prev) => ({ ...prev, [field]: newValue }));
  };

  const deleteImagen = async (id, imagen) => {
    try {
      const result = await eliminarImagenProducto(id, imagen);
      if (result.producto) {
        notification.success({
          message: `Se ${
            productoId ? "actualizó" : "creó"
          } el producto exitosamente`,
        });
        setReload(!reload);
        refreshProductos();
      }
    } catch (error) {
      console.error("Error al eliminar la imagen", error);
    }
  };

  const handleDiscountChange = (event) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    const numericValue = rawValue ? Math.min(Number(rawValue), 100) : 0;
    setFormData((prev) => ({ ...prev, discount: numericValue }));
  };

  const updateProductLabels = (newLabels) => {
    setFormData((prev) => ({ ...prev, labels: newLabels }));
  };

  const updateProductFeatures = (newFeatures) => {
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setDisabledButton(true);
      if (files.length > 0) {
        const uploadedImages = await Promise.all(
          files.map((file) => createUploadFile(file))
        );
        formData.images = [
          ...(formData.images || []),
          ...uploadedImages.map((img) => img.url),
        ];
      }
      if (productoId) {
        await actualizarProducto(productoId, formData);
      } else {
        await crearProducto(formData);
      }
      notification.success({
        message: `Se ${
          productoId ? "actualizó" : "creó"
        } el producto exitosamente`,
      });
      refreshProductos();
      onClose();
    } catch (error) {
      notification.error({
        message: `No se pudo ${
          productoId ? "actualizar" : "crear"
        } el producto`,
      });
      console.error("Error saving product:", error);
    } finally {
      setDisabledButton(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, mt: 0, maxHeight: "80vh", overflow: "auto" }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {productoId ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Sección: Información del producto */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Información del producto
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Autocomplete
                  options={categorias}
                  getOptionLabel={(option) => option.name || ""}
                  value={formData.category || null}
                  onChange={(event, newValue) =>
                    handleAutocompleteChange(event, newValue, "category")
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Categoría" size="small" />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  name="description"
                  multiline
                  rows={4}
                  size="small"
                  value={formData.description}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Sección: Detalles y opciones */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Detalles y opciones
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.active}
                          onChange={handleChange}
                          name="active"
                        />
                      }
                      label="Activo"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isFeatured}
                          onChange={handleChange}
                          name="isFeatured"
                          color="primary"
                        />
                      }
                      label="Destacado"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label="Orden destacado"
                      name="orderFeatured"
                      size="small"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      value={formData.orderFeatured}
                      onChange={handleChange}
                    />
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.orderFeatured}
                          onChange={handleChange}
                          name="orderFeatured"
                          color="primary"
                        />
                      }
                      label="Orden destacado"
                    /> */}
                  </Grid>
                  <Grid item xs={1}>
                    {}
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.freeShipping}
                          onChange={handleChange}
                          name="freeShipping"
                          color="primary"
                        />
                      }
                      label="Envío gratis"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Sección: Precios */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Precios
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Precio"
                  name="price"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={price}
                  onChange={handlePriceChange}
                  onBlur={() => setPrice(formatPrice(price))}
                  onFocus={() =>
                    setPrice(
                      price
                        .replace("$", "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Precio efectivo"
                  name="cashPrice"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={cashPrice}
                  onChange={handleCashPriceChange}
                  onBlur={() => setCashPrice(formatPrice(cashPrice))}
                  onFocus={() =>
                    setCashPrice(
                      cashPrice
                        .replace("$", "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Descuento"
                  size="small"
                  name="discount"
                  InputLabelProps={{ shrink: true }}
                  value={formData.discount ? `${formData.discount}%` : ""}
                  onChange={handleDiscountChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  size="small"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  value={formData.stock}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Sección: Cuotas sin interés */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Cuotas sin interés
            </Typography>
            {formData.installments && formData.installments.length > 0 ? (
              formData.installments.map((inst, index) => (
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  key={index}
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={4} sm={3}>
                    <TextField
                      label="Cantidad de cuotas"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={inst.qty}
                      onChange={(e) =>
                        handleInstallmentChange(index, "qty", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <TextField
                      label="Monto por cuota"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={inst.amount}
                      onChange={(e) =>
                        handleInstallmentChange(index, "amount", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    <IconButton onClick={() => removeInstallment(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No se han agregado cuotas.
              </Typography>
            )}
            <Button variant="outlined" onClick={addInstallment} size="small">
              Agregar cuota
            </Button>
          </Grid>

          {/* Sección: Imágenes y Etiquetas */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Imágenes
                </Typography>
                <UploadFilesComponent
                  files={files}
                  setFiles={setFiles}
                  text="Cargar imágenes"
                  accept="image/*"
                  multiple
                />
                {formData.images?.length > 0 && (
                  <Grid container spacing={2} item xs={12}>
                    {formData.images.map((file, index) => (
                      <Grid item xs={12} sm={3} md={2} key={index}>
                        <Box
                          sx={{
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            overflow: "hidden",
                            position: "relative",
                            p: 1,
                            height: "90px",
                            width: "90px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#fafafa",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteImagen(formData._id, file);
                            }}
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              backgroundColor: "rgba(0,0,0,0.6)",
                              zIndex: 999,
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.8)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          {file ? (
                            <Image
                              src={file}
                              alt="Imagen subida"
                              width={80}
                              height={80}
                              style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: "100%",
                                height: "80px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#e0e0e0",
                                borderRadius: "8px",
                              }}
                            >
                              {/* <DescriptionIcon
                                sx={{ fontSize: 40, color: "#757575" }}
                              /> */}
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Etiquetas y Características
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Tags
                      labels={formData.labels || []}
                      setLabels={(newLabels) => updateProductLabels(newLabels)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tags
                      labels={formData.features || []}
                      title={"Agregar características"}
                      setLabels={(newLabels) =>
                        updateProductFeatures(newLabels)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Sección: Botones de acción */}
          <Grid item xs={12} container justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              disabled={disabledButton}
              startIcon={disabledButton && <CircularProgress size={20} />}
            >
              {productoId ? "Actualizar" : "Crear"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              disabled={disabledButton}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProductoForm;
