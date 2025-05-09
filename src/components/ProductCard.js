import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(product?.images[0]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  const navigateProductDetail = (id) => navigate(`/producto/${id}`);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product?.images[1]) {
      const img = new Image();
      img.src = product.images[1];
      img.onload = () => setIsImageLoaded(true);
    }
  }, [product]);

  const precioBase = product?.price || 0;
  const descuento = product?.discount || 0;
  const precioFinal = precioBase - (precioBase * descuento) / 100;

  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 3,
        textAlign: "center",
        maxWidth: 380,
        mx: "auto",
        height: "100%", // 🔥 Esto es clave
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Imagen */}
      <Box
        sx={{
          position: "relative",
          height: 250,
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
        onClick={() => navigateProductDetail(product._id)}
      >
        {/* 👇 CINTA DESTACADO */}
        {product.isFeatured && (
          <Box
            sx={{
              position: "absolute",
              top: 36,
              left: -45,
              backgroundColor: "#28c34f",
              color: "white",
              transform: "rotate(-45deg)",
              width: 197,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.25rem",
              py: "2px",
              zIndex: 10,
              boxShadow: 2,
            }}
          >
            DESTACADO
          </Box>
        )}
        {descuento > 0 && (
          <Chip
            label={`-${descuento}%`}
            color="primary"
            size="medium"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          />
        )}
        <img
          src={imageSrc}
          alt={product?.name}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
          onMouseEnter={() =>
            isImageLoaded &&
            product?.images[1] &&
            setImageSrc(product.images[1])
          }
          onMouseLeave={() => setImageSrc(product?.images[0])}
        />
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography sx={{ fontSize: "1rem", mb: 1, minHeight: "3rem" }}>
          {product?.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            flexWrap: "wrap",
            mb: 1,
          }}
        >
          <Typography sx={{ fontSize: "1.4rem", fontWeight: "bold" }}>
            {precioFinal.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}
          </Typography>
          {descuento > 0 && (
            <Typography
              sx={{
                color: "gray",
                textDecoration: "line-through",
                fontSize: "1.2rem",
              }}
            >
              {precioBase.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
              })}
            </Typography>
          )}
        </Box>

        {product.installments?.length > 0 && (
          <Typography sx={{ mt: 1, fontWeight: "bold", fontSize: "0.95rem" }}>
            {product.installments.at(-1).qty} cuotas sin interés de{" "}
            {product.installments.at(-1).amount.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}
          </Typography>
        )}

        {product.installments?.length === 0 && (
          <Typography sx={{ mt: 1, fontWeight: "bold", fontSize: "0.95rem" }}>
            Sin cuotas disponibles
          </Typography>
        )}

        {product.cashPrice && (
          <Box
            sx={{
              mt: 2,
              mb: 1,
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
              fontWeight: "bold",
              borderRadius: 2,
              py: 1,
            }}
          >
            {product.cashPrice.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}{" "}
            EN EFECTIVO
          </Box>
        )}

        {/* Botón al fondo */}
        <Box sx={{ mt: "auto" }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ borderRadius: 3, fontWeight: "bold", fontSize: "1rem" }}
            onClick={() => {
              addToCart(product); // sigue funcionando igual

              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: "conversion_carrito",
                productId: product._id,
                productName: product.name,
                value: product.price.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 2,
                }),
                currency: "ARS",
              });
            }}
          >
            Agregar al carrito
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
