import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./CategoriaProductos.css"; // Archivo de estilos para personalizar
import { obtenerProductosPorCategoria } from "../../api/products.service";
import Loader from "./Loader";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
const CategoriaProductos = ({ selectOptionCategoria, enterprise }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de llamada al backend
    const fetchProductos = async () => {
      try {
        setLoading(true);

        const result = await obtenerProductosPorCategoria(selectOptionCategoria?._id);

        // const result = await obtenerCategoriaporID(selectOptionCategoria?._id);

        if (result?.data?.productos?.length > 0) {
          setProductos(result?.data?.productos);
        } else {
          setProductos([]);
        }

        // Set productos fake en el estado
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [selectOptionCategoria]);

  // Variantes de animación para framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };
  function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, ""); // Elimina todos los caracteres que no sean números
  }
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div
        className="categoria-productos"
        style={{
          height: productos.length === 0 ? "100vh" : "100%",
          zIndex: 3000,
        }}
      >
        <h1 className="categoria-titulo">
          Productos en la Categoría: {selectOptionCategoria?.name}
        </h1>
        <motion.div
          className="productos-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {productos.map((producto) => (
            <motion.div
              key={producto.id}
              className="producto-card"
              variants={itemVariants}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="producto-imagen"
              />
              <div className="producto-info">
                <h2 className="producto-nombre">
                  {producto.marca + " " + producto.modelo}
                </h2>
                <p>Marca: {producto.marca}</p>
                <p>Modelo: {producto.modelo}</p>
                <p>Capacidad de Carga: {producto.capacidadCarga}</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>
                    Peso: {producto.peso}
                  </span>
                  <span>Altura: {producto.altura}</span>
                </div>
                <p>Alimentación: {producto.alimentacion}</p>

                <div className="producto-acciones">
                  <a
                    href={producto.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    // className="btn-descargar"
                  >
                    <PictureAsPdfIcon
                      color="error"
                      style={{ marginRight: 10, fontSize: "40px" }}
                    />
                  </a>
                  <a
                    href={`https://wa.me/${
                      enterprise?.celular
                        ? formatPhoneNumber(enterprise.celular)
                        : "5491126485397"
                    }?text=${encodeURIComponent(
                      `Hola, estoy interesado en el producto ${producto?.marca} ${producto?.modelo}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon
                      className="btn-whatsapp"
                      style={{ fontSize: "40px", color: "#25D366" }}
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
          {productos.length === 0 && (
            <span
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginTop: "2rem",
              }}
            >
              Sin productos asociados a la categoría seleccionada
            </span>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default CategoriaProductos;
