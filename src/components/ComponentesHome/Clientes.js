import React, { useState } from "react";
import { motion } from "framer-motion";

import "./Clientes.css";
import useInView from "../../hooks/useInView";

// const clientes = [
//   {
//     id: 1,
//     name: "Centro cultural Recoleta",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE1.png",
//   },
//   {
//     id: 2,
//     name: "Frávega",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE2.png",
//   },
//   {
//     id: 3,
//     name: "Rex",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE3.png",
//   },
//   {
//     id: 4,
//     name: "Quilmes-Pepsi",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE4.png",
//   },
//   {
//     id: 5,
//     name: "Movistar",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE5.png",
//   },
//   {
//     id: 6,
//     name: "Centro Banex",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE6.png",
//   },
//   {
//     id: 7,
//     name: "Obras particulares",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE7.png",
//   },
//   {
//     id: 8,
//     name: "Obras particulares",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE8.png",
//   },
//   {
//     id: 9,
//     name: "Obras particulares",
//     logo: "http://www.autoelevadoresecharri.com/assets/images/CLIENTES/CLIENTE9.png",
//   },
// ];

const Clientes = ({ clientes }) => {
  const [modalImage, setModalImage] = useState(null);
  const [isInView, ref] = useInView(0.1); // Usamos el hook personalizado

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  // Variantes para la animación de contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Espaciado entre animaciones de hijos
      },
    },
  };

  // Variantes para la animación de las tarjetas
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="clientes" id="clientes" ref={ref}>
      <div className="clientes-container">
        {/* Header */}
        <section className="clientes-header">
          <h1>Nuestros Clientes</h1>
          <p>
            Grandes empresas confían en nuestros servicios gracias a nuestra
            calidad e innovación constante.
          </p>
        </section>

        {/* Mosaico de imágenes con animación */}
        <motion.div
          className="clientes-mosaic"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {clientes.map((cliente) => (
            <motion.div
              key={cliente._id}
              className="cliente-card"
              variants={cardVariants}
              onClick={() => openModal(cliente.image)}
            >
              <img
                src={cliente.image}
                alt={cliente.name}
                className="cliente-image"
              />
              <div className="cliente-overlay">
                <p className="cliente-name">{cliente.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        {modalImage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content">
              <img src={modalImage} alt="Cliente" className="modal-image" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;
