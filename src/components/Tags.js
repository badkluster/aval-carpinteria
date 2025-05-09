import React, { useState } from "react";
import { TextField, Chip, Grid } from "@mui/material";

export default function Tags({ title="Agregar etiquetas", labels, setLabels }) {
  const [etiqueta, setEtiqueta] = useState("");

  // Manejar cambio en input
  const handleChange = (event) => {
    setEtiqueta(event.target.value);
  };

  // Agregar etiqueta al presionar "Enter"
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && etiqueta.trim() !== "") {
      event.preventDefault();
      setLabels([...labels, etiqueta.trim()]); // Pasar el nuevo array a Products
      setEtiqueta(""); // Limpiar input
    }
  };

  // Eliminar etiqueta
  const handleDelete = (index) => {
    const newLabels = labels.filter((_, i) => i !== index);
    setLabels(newLabels);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <TextField
          fullWidth
          label={title}
          size="small"
          value={etiqueta}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </Grid>
      <Grid item xs={12}>
        {labels.map((label, index) => (
          <Chip
            key={index}
            label={label}
            onDelete={() => handleDelete(index)}
            color="primary"
            variant="outlined"
            style={{ margin: "4px" }}
          />
        ))}
      </Grid>
    </Grid>
  );
}
