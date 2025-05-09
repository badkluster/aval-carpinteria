/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  TablePagination,
  Switch,
  Grid,
  Fab,
} from "@mui/material";
import { Edit, Delete, Search, Add } from "@mui/icons-material";
import { TableSortLabel } from "@mui/material";
import { Autocomplete } from "@mui/material";
import noImage from "../../../assets/no-avatar.png";
import {
  obtenerListaProductos,
  actualizarProducto,
  eliminarProducto,
  obtenerFiltrosDisponiblesParaProductos,
} from "../../../api/products.service";
import { notification, Modal as ModalAntd } from "antd";
import Loader from "../../ComponentesHome/Loader";

const ProductList = ({ onEdit, refresh }) => {
  // Estados para productos y paginación
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Estados para filtros seleccionados (almacenamos el objeto completo)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [orderBy, setOrderBy] = useState(null);
  const [orderDirection, setOrderDirection] = useState("asc");

  // Función para manejar el cambio de orden
  const handleSort = (column) => {
    const isAsc = orderBy === column && orderDirection === "asc";
    setOrderBy(column);
    setOrderDirection(isAsc ? "desc" : "asc");
  };

  // Función para ordenar los productos antes de renderizarlos
  const sortedProducts = [...products].sort((a, b) => {
    if (!orderBy) return 0; // Si no hay orden, se muestra sin cambios
    let valueA = a[orderBy] || "";
    let valueB = b[orderBy] || "";

    if (orderBy === "category") {
      valueA = a.category?.name || "";
      valueB = b.category?.name || "";
    }

    if (orderBy === "brand") {
      valueA = a.brand?.name || "";
      valueB = b.brand?.name || "";
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return orderDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    return orderDirection === "asc" ? valueA - valueB : valueB - valueA;
  });

  // Estados para filtros disponibles (vienen del backend)
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
  });

  // Estado para el search debounced
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(40);
  const [loading, setLoading] = useState(true);
  const { confirm } = ModalAntd;
  const [reload, setReload] = useState(false);

  // Debounce: actualiza 'debouncedSearch' después de 500ms sin cambios
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Obtiene los filtros disponibles desde el backend
  const fetchAvailableFilters = async () => {
    try {
      const result = await obtenerFiltrosDisponiblesParaProductos();
      if (result.data && result.data.filtros) {
        // Combina los objetos de filtros
        const filtersObj = result.data.filtros.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setAvailableFilters({
          categories: filtersObj.categories || [],
        });
      }
    } catch (error) {
      console.error("Error fetching available filters", error);
    }
  };

  // Construye el objeto de filtros a enviar a la API usando los _id_ de cada referencia
  const buildFilters = () => {
    const filters = {};
    // Usamos trim para limpiar espacios en blanco
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      filters.name = { $regex: trimmedSearch, $options: "i" };
    }
    if (selectedCategory) {
      filters.category = selectedCategory._id;
    }

    return filters;
  };

  const fetchProducts = async () => {
    try {
      const filters = buildFilters();
      // Se envía page+1 porque la API espera páginas 1-indexadas
      const response = await obtenerListaProductos(
        page + 1,
        rowsPerPage,
        filters
      );
      if (response.data && response.data.items) {
        setProducts(response.data.items);
        setTotalCount(response.data.totalItems);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Se obtiene una sola vez los filtros disponibles
  useEffect(() => {
    fetchAvailableFilters();
  }, []);

  // Se vuelve a llamar a la API cada vez que cambian paginación o filtros (incluyendo el debounced search)
  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, debouncedSearch, selectedCategory, refresh, reload]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      await actualizarProducto(id, { active: !currentStatus });
      setReload(!reload);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const toggleFeaturedStatus = async (id, currentStatus) => {
    try {
      await actualizarProducto(id, { isFeatured: !currentStatus });
      setReload(!reload);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const deleteProduct = async (id) => {
    confirm({
      title: "Eliminar producto seleccionado",
      content: "¿Está seguro de que desea eliminar el producto?",
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      async onOk() {
        try {
          await eliminarProducto(id);
          setReload(!reload);
          notification.success({
            message: "Producto eliminado",
            description: "El producto fue eliminado exitosamente.",
          });
        } catch (error) {
          console.error("Error al eliminar producto", error);
          notification.error({
            message: "Error",
            description:
              "No se pudo eliminar el producto, inténtelo nuevamente.",
          });
        }
      },
    });
  };

  const handleEdit = (id) => {
    onEdit(id);
  };

  const handleCreate = () => {
    onEdit();
  };

  return (
    <Box p={3}>
      {/* Header y búsqueda */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Typography variant="h4">Gestión de Productos</Typography>
        <TextField
          size="small"
          placeholder="Buscar productos..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", sm: "250px" } }}
        />
      </Box>

      {/* Filtros disponibles */}
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={2}>
          <Autocomplete
            options={availableFilters.categories}
            getOptionLabel={(option) => option.name || ""}
            value={selectedCategory}
            onChange={(event, value) => setSelectedCategory(value)}
            renderInput={(params) => (
              <TextField {...params} label="Categoría" size="small" fullWidth />
            )}
          />
        </Grid>
        {/* <Grid item xs={12} sm={2}>
          <Autocomplete
            options={availableFilters.brands}
            getOptionLabel={(option) => option.name || ""}
            value={selectedBrand}
            onChange={(event, value) => setSelectedBrand(value)}
            renderInput={(params) => (
              <TextField {...params} label="Marca" size="small" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Autocomplete
            options={availableFilters.sizes}
            getOptionLabel={(option) => option.name || ""}
            value={selectedSize}
            onChange={(event, value) => setSelectedSize(value)}
            renderInput={(params) => (
              <TextField {...params} label="Tamaño" size="small" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Autocomplete
            options={availableFilters.measurements}
            getOptionLabel={(option) =>
              `${option.ancho} x ${option.largo} x ${option.alto} cm` || ""
            }
            value={selectedMedidas}
            onChange={(event, value) => setSelectedMedidas(value)}
            renderInput={(params) => (
              <TextField {...params} label="Medidas" size="small" fullWidth />
            )}
          />
        </Grid> */}
      </Grid>

      {loading ? (
        <Loader />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? orderDirection : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? orderDirection : "asc"}
                    onClick={() => handleSort("category")}
                  >
                    Categoría
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? orderDirection : "asc"}
                    onClick={() => handleSort("price")}
                  >
                    Precio
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "discount"}
                    direction={orderBy === "discount" ? orderDirection : "asc"}
                    onClick={() => handleSort("discount")}
                  >
                    Descuento
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "isFeatured"}
                    direction={
                      orderBy === "isFeatured" ? orderDirection : "asc"
                    }
                    onClick={() => handleSort("isFeatured")}
                  >
                    Destacado
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "orderFeatured"}
                    direction={
                      orderBy === "orderFeatured" ? orderDirection : "asc"
                    }
                    onClick={() => handleSort("orderFeatured")}
                  >
                    Orden Destacado
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "active"}
                    direction={orderBy === "active" ? orderDirection : "asc"}
                    onClick={() => handleSort("active")}
                  >
                    Activo
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "interactions"}
                    direction={
                      orderBy === "interactions" ? orderDirection : "asc"
                    }
                    onClick={() => handleSort("interactions")}
                  >
                    Interacciones
                  </TableSortLabel>
                </TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={
                        product.images?.length > 0 ? product.images[0] : noImage
                      }
                      alt={product.name}
                      style={{ width: "70px", height: "auto" }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name}</TableCell>

                  <TableCell>
                    {Number(product.price).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{product.discount}%</TableCell>
                  <TableCell>
                    <Switch
                      size="small"
                      checked={product.isFeatured}
                      onChange={() =>
                        toggleFeaturedStatus(product._id, product.isFeatured)
                      }
                    />
                  </TableCell>
                  <TableCell>{product.orderFeatured}</TableCell>
                  <TableCell>
                    <Switch
                      size="small"
                      checked={product.active}
                      onChange={() =>
                        toggleActiveStatus(product._id, product.active)
                      }
                    />
                  </TableCell>
                  <TableCell>{product.interactions}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(product._id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteProduct(product._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleCreate}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default ProductList;
