import React from "react";

import "./CategoriasSection.css";
import useInView from "../../hooks/useInView";

import { useNavigate } from "react-router-dom";

const CategoriaSection = ({
  categories,
  enterprise,
  setSectionAlquilerView,
  setSelectOptionAlquiler,
}) => {
  const navigate = useNavigate();
  const handleCardClick = (category) => {
    navigate(`/catalogo?categoryId=${category.name}`);
  };

  if (categories?.length === 0) {
    return null;
  }

  return (
    <section className="categorias-section" id="categorias-section">
      <h2 className="categorias-section-title">Categorías</h2>
      <div className="categorias-section-cards-container">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onClick={handleCardClick} // Pass the click handler
          />
        ))}
      </div>
    </section>
  );
};

const CategoryCard = ({ category, onClick }) => {
  const [isInView, ref] = useInView(0.2);

  return (
    <div
      ref={ref}
      className="categorias-section-card"
      initial={{ opacity: 0, y: 0 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.4 }}
      // whileHover={{ scale: 1.05 }}
      onClick={() => onClick(category)} // Trigger the onClick handler when the card is clicked
    >
      <img
        src={category.imagen}
        alt={category.name}
        className="categorias-section-card-image"
      />
      <span className="categorias-section-card-title">{category.name}</span>
    </div>
  );
};

export default CategoriaSection;
