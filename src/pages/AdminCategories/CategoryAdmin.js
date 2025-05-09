import React, { useState } from "react";
import { Box, Modal } from "@mui/material";

import CategoryList from "../../components/AdminLayout/CategoryControl/CategoryList";
import CategoryForm from "../../components/AdminLayout/CategoryControl/CategoryForm";

const AdminCategory = () => {
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
      <CategoryList onEdit={handleOpenModal} refresh={refresh} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: "50%", margin: "auto", mt: 5 }}>
          <CategoryForm
            headerId={selectedHeader}
            onClose={handleCloseModal}
            refreshHeaders={
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

export default AdminCategory;
