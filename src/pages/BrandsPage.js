import React, { useState } from "react";
import { Box, Modal } from "@mui/material";

import BrandsList from "../components/BrandsListComponent";
import BrandsForm from "../components/BrandsFormComponent";

const BrandsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleOpenModal = (id = null) => {
    setSelectedBrand(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBrand(null);
    setOpenModal(false);
  };

  return (
    <Box>
      <BrandsList onEdit={handleOpenModal} refresh={refresh} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ width: "50%", margin: "auto", mt: 5 }}>
          <BrandsForm
            id={selectedBrand}
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

export default BrandsPage;
