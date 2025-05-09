import React, { useState, useEffect } from "react";
import "./FloatingButton.css";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

export default function FloatingButton({ enterprise }) {
  // Estado para manejar la visibilidad del botón de subir
  const [isAtTop, setIsAtTop] = useState(true);

  // Detectar el desplazamiento del scroll
  const handleScroll = () => {
    if (window.scrollY === 0) {
      setIsAtTop(true); // En el top de la página
    } else {
      setIsAtTop(false); // No está en el top de la página
    }
  };

  function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, ""); // Elimina todos los caracteres que no sean números
  }

  // Configurar el listener del scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Función para hacer scroll hacia el top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="floating-buttons">
      {/* Botón de subir */}
      {!isAtTop && (
        <button onClick={scrollToTop} className="to-top-button">
          <KeyboardArrowUpOutlinedIcon style={{ fontSize: 24 }} />
        </button>
      )}
      {/* Botón de WhatsApp */}
      <button
        onClick={() => {
          const phone = enterprise?.celular
            ? formatPhoneNumber(enterprise.celular)
            : "+5491160391628";

          const url = `https://wa.me/${phone}`;

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "conversion_contacto",
            phone,
          });

          setTimeout(() => {
            window.open(url, "_blank", "noopener,noreferrer");
          }, 1000);
        }}
        className="whatsapp-button"
      >
        <WhatsAppIcon style={{ fontSize: 28 }} />
      </button>
    </div>
  );
}
