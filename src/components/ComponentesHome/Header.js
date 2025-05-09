import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Header.css";
import { CircularProgress } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

export default function Header({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const loadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // igual resolvemos si falla, para no bloquear
        img.src = src;
      });

    const loadAllImages = async () => {
      const promises = [];

      slides.forEach((slide) => {
        promises.push(loadImage(slide.image));
        if (slide.image_mobile) {
          promises.push(loadImage(slide.image_mobile));
        }
      });

      await Promise.all(promises);
      setIsImagesLoaded(true);
    };

    loadAllImages();

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (slides.length === 0 || !isImagesLoaded) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#c3c3c3",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <header className="header">
      <img
        src={
          isMobile && currentSlide.image_mobile
            ? currentSlide.image_mobile
            : currentSlide.image
        }
        alt={currentSlide.title}
        className="header-image"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />

      {/* Botones de navegación */}
      <button className="nav-button left" onClick={prevSlide}>
        <ArrowBackIos />
      </button>
      <button className="nav-button right" onClick={nextSlide}>
        <ArrowForwardIos />
      </button>

      {/* Contenido */}
      <div className="header-content">
        <motion.div
          key={`detail-${currentIndex}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <span className="initial">{currentSlide.detail}</span>
        </motion.div>

        <motion.div
          key={`title-${currentIndex}`}
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>{currentSlide.title}</h1>
        </motion.div>

        <motion.p
          key={`description-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {currentSlide.description}
        </motion.p>

        {currentSlide.link && (
          <button
            className="cta-button"
            onClick={() => (window.location.href = currentSlide.link)}
          >
            {currentSlide.linkTitle || "Ver más"}
          </button>
        )}
      </div>
    </header>
  );
}
