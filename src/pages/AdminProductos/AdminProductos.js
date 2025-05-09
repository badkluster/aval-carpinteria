import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import ProductList from "../../components/AdminLayout/ProductosControl/ProductosList";
import ProductForm from "../../components/AdminLayout/ProductosControl/ProductosForm";

const AdminProductos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleOpenModal = (headerId = null) => {
    setSelectedHeader(headerId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedHeader(null);
    setOpenModal(false);
  };

  return (
    <Box>
      <ProductList onEdit={handleOpenModal} refresh={refresh} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            width: "80%",
            margin: "auto",
            mt: 5,
            maxHeight: "90vh",
            // overflowY: "auto",
          }}
        >
          <ProductForm
            productoId={selectedHeader}
            onClose={handleCloseModal}
            refreshProductos={
              () => {
                setRefresh(!refresh);
              } /* Añade lógica para refrescar */
            }
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminProductos;
