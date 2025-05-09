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
  Switch,
  Paper,
  IconButton,
  TablePagination,
  Fab,
  Button,
} from "@mui/material";
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
import {
  actualizarBrand,
  eliminarBrand,
  obtenerListaBrands,
} from "../../../api/category.services";
import Loader from "../../ComponentesHome/Loader";

import { notification, Modal as ModalAntd } from "antd";
import BrandsSection from "../../ComponentesHome/BrandsSection";

const MarcasList = ({ onEdit, refresh }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // State to track current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State to define how many items per page
  const { confirm } = ModalAntd;
  const [reload, setReload] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // State to toggle preview visibility

  useEffect(() => {
    fetchBrands();
  }, [refresh, reload]);

  const fetchBrands = async () => {
    try {
      const response = await obtenerListaBrands(); // Fetch all brands from the API

      if (response.data?.length > 0) {
        setBrands(response.data); // Set brands if data exists
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const result = await actualizarBrand(id, { active: !currentStatus });
      if (result) {
        fetchBrands();
      }
    } catch (error) {
      console.error("Error updating header status:", error);
    }
  };

  const deleteHeader = async (id) => {
    confirm({
      title: "Eliminar registro seleccionado",
      content: `¿Está seguro de que desea eliminar el registro?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Salir",
      async onOk() {
        try {
          const result = await eliminarBrand(id);
          if (result.data) {
            setReload(!reload);
            notification.success({
              message: "Registro eliminado",
              description: `El registro fue eliminado exitosamente.`,
            });
          }
        } catch (error) {
          console.error("Error al eliminar registro", error);
          notification.error({
            message: "Registro no eliminado",
            description: `El registro no fue eliminado, inténtelo nuevamente.`,
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Set new page when user navigates
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update rows per page
    setPage(0); // Reset to the first page
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h4" gutterBottom>
          Gestión de Marcas
        </Typography>
        {/* <IconButton color="primary" onClick={handleCreate}>
          <AddIcon />
        </IconButton> */}
      </Box>

      {loading ? (
        <Loader />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brands
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginate data
                  .map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>
                        <img
                          src={category.imagen}
                          alt={category.name}
                          style={{ width: "70px", height: "auto" }}
                        />
                      </TableCell>
                      <TableCell>{category?.name}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(category._id)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => deleteHeader(category._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {/* Add pagination controls */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={brands.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          {/* Button to toggle preview visibility */}
          <Box mt={2} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Visibility />}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Ocultar Vista Previa" : "Mostrar Vista Previa"}
            </Button>
          </Box>

          {showPreview && (
            <Box mt={2}>
              <Typography variant="h5" gutterBottom>
                Vista Previa
              </Typography>
              <BrandsSection
                categories={brands.filter((header) => header.active)}
              />
            </Box>
          )}
        </>
      )}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => handleCreate()}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default MarcasList;
