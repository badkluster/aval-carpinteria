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
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import Loader from "../../ComponentesHome/Loader";
import { notification, Modal as ModalAntd } from "antd";
import {
  actualizarCliente,
  eliminarCliente,
  obtenerListaClientes,
} from "../../../api/clientes.service";

const ClientList = ({ onEdit, refresh }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Página actual (0-indexada)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { confirm } = ModalAntd;
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [refresh, reload]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await obtenerListaClientes();
      if (response.data && response.data.length > 0) {
        setClients(response.data);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      await actualizarCliente(id, { active: !currentStatus });
      setReload(!reload);
    } catch (error) {
      console.error("Error updating client status:", error);
    }
  };

  const deleteClient = async (id) => {
    confirm({
      title: "Eliminar cliente seleccionado",
      content: "¿Está seguro de que desea eliminar el cliente?",
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      async onOk() {
        try {
          await eliminarCliente(id);
          setReload(!reload);
          notification.success({
            message: "Cliente eliminado",
            description: "El cliente fue eliminado exitosamente.",
          });
        } catch (error) {
          console.error("Error deleting client:", error);
          notification.error({
            message: "Error",
            description:
              "No se pudo eliminar el cliente, inténtelo nuevamente.",
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
        mb={2}
      >
        <Typography variant="h4" gutterBottom>
          Gestión de Clientes
        </Typography>
      </Box>

      {loading ? (
        <Loader />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Código Postal</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow key={client._id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.address}</TableCell>
                    <TableCell>{client.postalCode}</TableCell>
                    <TableCell>{client.docNumber}</TableCell>
                    <TableCell>
                      <Switch
                        checked={client.active}
                        onChange={() =>
                          toggleActiveStatus(client._id, client.active)
                        }
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(client._id)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteClient(client._id)}
                        size="small"
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
            count={clients.length}
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

export default ClientList;
