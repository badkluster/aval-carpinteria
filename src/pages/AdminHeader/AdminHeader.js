import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import HeaderForm from "../../components/AdminLayout/HeaderControl/HeaderForm";
import HeaderList from "../../components/AdminLayout/HeaderControl/HeaderList";

const AdminHeaders = () => {
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
      <HeaderList onEdit={handleOpenModal} refresh={refresh} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: "50%", margin: "auto", mt: 5 }}>
          <HeaderForm
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

export default AdminHeaders;
