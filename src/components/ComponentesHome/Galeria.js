import React from "react";
import Gallery from "react-photo-gallery";
import "./Galeria.css";

// Datos de la galería
const galleryData = [
  {
    src: "https://curly.qodeinteractive.com/wp-content/uploads/2018/04/port-img-1.jpg",
    width: 4,
    height: 3,
    title: "Capas",
    category: "Colorante",
    link: "https://curly.qodeinteractive.com/portfolio-item/layers/",
  },
  {
    src: "https://curly.qodeinteractive.com/wp-content/uploads/2018/04/port-img-2-1100x550.jpg",
    width: 4927,
    height: 2500,
    title: "Volumen",
    category: "Colorante",
    link: "https://curly.qodeinteractive.com/portfolio-item/volume/",
  },
  {
    src: "https://curly.qodeinteractive.com/wp-content/uploads/2018/04/port-img-4-550x1100.jpg",
    width: 2,
    height: 3,
    title: "Golpes",
    category: "Colorante",
    link: "https://curly.qodeinteractive.com/portfolio-item/bangs/",
  },
  {
    src: "https://curly.qodeinteractive.com/wp-content/uploads/2018/04/port-img-5-550x1100.jpg",
    width: 2,
    height: 3,
    title: "Tresillo",
    category: "Colorante",
    link: "https://curly.qodeinteractive.com/portfolio-item/ombre/",
  },
  {
    src: "https://curly.qodeinteractive.com/wp-content/uploads/2018/04/port-img-3-1100x550.jpg",
    width: 3,
    height: 2,
    title: "Peinado",
    category: "Colorante",
    link: "https://curly.qodeinteractive.com/portfolio-item/hairdo/",
  },
];

const calculateColumns = (containerWidth) => {
  if (containerWidth >= 1200) return 3; // 4 columnas en pantallas grandes
  if (containerWidth >= 768) return 3; // 3 columnas en tablets
  return 2; // 2 columnas en móviles
};

const Galeria = () => {
  return (
    <div className="gallery-container">
      <Gallery
        photos={galleryData}
        columns={calculateColumns}
        margin={8} // Margen entre imágenes
        direction="column" // Mantiene la disposición de filas
      />
    </div>
  );
};

export default Galeria;
