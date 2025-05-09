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
  actualizarServicio,
  eliminarServicio,
  obtenerListaServicios,
} from "../../../api/servicios.service";
import Servicios from "../../ComponentesHome/Servicios";

const ServiciosList = ({ onEdit, refresh }) => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPreview, setShowPreview] = useState(false); // State to toggle preview visibility
  const { confirm } = ModalAntd;
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetchServicios();
  }, [refresh, reload]);

  const fetchServicios = async () => {
    try {
      const response = await obtenerListaServicios();
      if (response.data.length > 0) {
        setServicios(response.data);
      }
    } catch (error) {
      console.error("Error fetching headers:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const result = await actualizarServicio(id, { active: !currentStatus });
      if (result) {
        fetchServicios();
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
          const result = await eliminarServicio(id);
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
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          Gestión de servicios
        </Typography>
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
                  <TableCell>Título</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Activo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servicios
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((header) => (
                    <TableRow key={header._id}>
                      <TableCell>
                        <img
                          src={header.image}
                          alt={header.title}
                          style={{ width: "70px", height: "auto" }}
                        />
                      </TableCell>
                      <TableCell>{header.title}</TableCell>
                      <TableCell>{header.description}</TableCell>
                      <TableCell>
                        <Switch
                          checked={header.active}
                          onChange={() =>
                            toggleActiveStatus(header._id, header.active)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(header._id)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => deleteHeader(header._id)}
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
              count={servicios.length}
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
              <Servicios
                servicios={servicios.filter((header) => header.active)}
              />
            </Box>
          )}
        </>
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

export default ServiciosList;
