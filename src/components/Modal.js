// src/components/Modal.js
import React from "react";
import { Modal as ModalAntd } from "antd";

export default function Modal(props) {
  const {
    children,
    title,
    isVisible,
    setIsVisible,
    width = "500px",
    setForm,
    onClose,
    ...other
  } = props;

  const handleCancel = () => {
    setIsVisible(false); // Cierra el modal
    if (onClose) {
      setIsVisible(false);
      onClose(); // Ejecuta la función onClose si está definida
    }
  };

  const modalWidth = width !== null ? width : undefined; // Si width es null, no se pasa la prop width
  return (
    <ModalAntd
      title={title}
      style={{
        textAlign: "center",
        zIndex: 5000,
        marginTop: 10,
        marginBottom: 10,
      }} // Centra horizontalmente el contenido del modal
      centered
      open={isVisible}
      onCancel={handleCancel}
      footer={false}
      width={modalWidth}
      {...other}
    >
      {children}
    </ModalAntd>
  );
}
