import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import ClientList from "../../components/AdminLayout/ClientControl/ClientList";
import ClientForm from "../../components/AdminLayout/ClientControl/ClientForm";

const AdminClients = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleOpenModal = (id = null) => {
    setSelectedData(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedData(null);
    setOpenModal(false);
  };

  return (
    <Box>
      <ClientList onEdit={handleOpenModal} refresh={refresh} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: "50%", margin: "auto", mt: 5 }}>
          <ClientForm
            id={selectedData}
            onClose={handleCloseModal}
            refresh={
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

export default AdminClients;
