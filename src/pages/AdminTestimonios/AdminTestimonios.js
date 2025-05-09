import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import TestimoniosList from "../../components/AdminLayout/TestimoniosControl/TestimoniosList";
import TestimoniosForm from "../../components/AdminLayout/TestimoniosControl/TestimoniosForm";

const AdminTestimonios = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTestimonio, setSelectedTestimonio] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleOpenModal = (id = null) => {
    setSelectedTestimonio(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTestimonio(null);
    setOpenModal(false);
  };

  return (
    <Box>
      <TestimoniosList onEdit={handleOpenModal} refresh={refresh} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: "50%", margin: "auto", mt: 5 }}>
          <TestimoniosForm
            id={selectedTestimonio}
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

export default AdminTestimonios;
