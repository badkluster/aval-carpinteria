import React from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import DescriptionIcon from "@mui/icons-material/Description";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

// Definimos el tamaño deseado para cada tarjeta
const CARD_SIZE = 60;

// Elemento individual ordenable (tarjeta)
const SortableItem = sortableElement(({ file, onDelete }) => (
  <Box
    sx={{
      position: "relative",
      width: CARD_SIZE,
      height: CARD_SIZE,
      border: "1px solid #ddd",
      borderRadius: 1,
      overflow: "hidden",
      backgroundColor: "#f9f9f9",
      flexShrink: 0, // para que no se reduzca en un contenedor flex
    }}
  >
    {/* Botón de borrar en la esquina superior derecha */}
    <Box
      sx={{
        position: "absolute",
        top: 2,
        right: 2,
        zIndex: 1500,
      }}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete(file.id);
        }}
        sx={{
          backgroundColor: "rgba(255,255,255,0.8)",
          "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
    {/* Contenido de la tarjeta: imagen o ícono */}
    {file.preview ? (
      <Box
        component="img"
        src={file.preview}
        alt={file.name}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    ) : (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DescriptionIcon sx={{ fontSize: 40, color: "#aaa" }} />
      </Box>
    )}
    {/* Tooltip con el nombre del archivo */}
    <Tooltip title={file.name}>
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "#fff",
          textAlign: "center",
          fontSize: "0.7rem",
          py: 0.25,
        }}
      >
        {file.name}
      </Typography>
    </Tooltip>
  </Box>
));

// Contenedor ordenable usando flex en lugar de Grid
const SortableList = sortableContainer(({ items, onDelete }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1, // espacio entre tarjetas (puedes ajustar este valor)
      }}
    >
      {items.map((file, index) => (
        <SortableItem
          key={`item-${file.id}`}
          index={index}
          file={file}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
});

export default function UploadFilesComponent({
  files,
  setFiles,
  multiple = true,
  accept = "image/*,application/pdf",
  maxFiles = 5,
  text,
}) {
  const displayText =
    text ||
    "Arrastra y suelta archivos aquí, o haz clic en un área vacía para seleccionar archivos";

  const { getRootProps, getInputProps, open } = useDropzone({
    accept,
    multiple,
    maxFiles,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => {
        // Se asigna un id único basado en name y lastModified
        const id = `${file.name}-${file.lastModified}`;
        return Object.assign(file, {
          id,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        });
      });
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    noClick: true, // evita que se abra el diálogo al hacer clic en cualquier parte
  });

  const handleDelete = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setFiles((oldFiles) => arrayMoveImmutable(oldFiles, oldIndex, newIndex));
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #aaa",
        p: 2,
        borderRadius: 2,
        textAlign: "center",
        cursor: "pointer",
        width: "100%",
        boxSizing: "border-box",
        minHeight: 120,
      }}
      onClick={(e) => {
        // Solo abre el diálogo si se hace clic en el contenedor vacío
        if (e.target === e.currentTarget) {
          open();
        }
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="body1" color="textSecondary" gutterBottom>
        {displayText}
      </Typography>
      <SortableList
        items={files}
        onSortEnd={onSortEnd}
        axis="xy"
        onDelete={handleDelete}
      />
    </Box>
  );
}
