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

import Loader from "../../ComponentesHome/Loader";

import { notification, Modal as ModalAntd } from "antd";
import {
  actualizarReview,
  eliminarReview,
  obtenerListaTestimonios,
} from "../../../api/testimonios.service";
import Testimonios from "../../ComponentesHome/Testimonios";
import moment from "moment/moment";

const TestimoniosList = ({ onEdit, refresh }) => {
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // State to track current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State to define how many items per page
  const { confirm } = ModalAntd;
  const [reload, setReload] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // State to toggle preview visibility

  useEffect(() => {
    fetchTestimonios();
  }, [refresh, reload]);

  const fetchTestimonios = async () => {
    try {
      const response = await obtenerListaTestimonios(); // Fetch all categorias from the API

      if (response.data?.length > 0) {
        setTestimonios(response.data);
      }
    } catch (error) {
      console.error("Error fetching categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const result = await actualizarReview(id, { active: !currentStatus });
      if (result) {
        fetchTestimonios();
      }
    } catch (error) {
      console.error("Error updating header status:", error);
    }
  };

  const deleteTestimonio = async (id) => {
    confirm({
      title: "Eliminar registro seleccionado",
      content: `¿Está seguro de que desea eliminar el registro?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Salir",
      async onOk() {
        try {
          const result = await eliminarReview(id);
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
          Gestión de testimonios
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
                  <TableCell>Nombre</TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Fecha</TableCell>

                  <TableCell>Activo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testimonios
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginate data
                  .map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>{review?.reviewerName}</TableCell>
                      <TableCell>{review?.description}</TableCell>
                      <TableCell>
                        {moment.utc(review?.date).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={review.active}
                          onChange={() =>
                            toggleActiveStatus(review._id, review.active)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(review._id)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => deleteTestimonio(review._id)}
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
              count={testimonios.length}
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
              <Testimonios
                testimonios={testimonios.filter((header) => header.active)}
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

export default TestimoniosList;
