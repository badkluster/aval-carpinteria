import React, { useEffect } from "react";

const DisableDevTools = () => {
  useEffect(() => {
    // Deshabilitar F12
    const handleKeyDown = (event) => {
      if (event.key === "F12" || event.key === "f12") {
        event.preventDefault(); // Evitar que F12 abra las herramientas de desarrollo
      }
    };

    // Deshabilitar clic derecho
    const handleContextMenu = (event) => {
      event.preventDefault(); // Evitar que se abra el menú contextual
    };

    // Agregar los eventos al montar el componente
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    // Limpiar eventos al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return null; // Este componente no necesita renderizar nada
};

export default DisableDevTools;
