import React from "react";
import { Card, CardContent, Typography, Button, Chip } from "@mui/material";
import DiscountBadge from "../DiscountBadge";

const ProductCard = ({ product, view }) => {
  const precioBase = product?.precio || 0;
  const descuento = product?.descuento || 0;
  const precioFinal = (precioBase - (precioBase * descuento) / 100).toFixed(2);
  return (
    <Card
      sx={{
        display: view === "list" ? "flex" : "block",
        maxWidth: 300,
        p: 2,
        textAlign: "center",
        boxShadow: 3,
      }}
    >
      <div style={{ position: "relative" }}>
        {product.discount && <DiscountBadge discount={product.discount} />}
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", borderRadius: 8 }}
        />
      </div>
      <CardContent>
        {product?.colors && (
          <Chip
            label={`${product.colors} COLORES`}
            size="small"
            sx={{ mb: 1 }}
          />
        )}
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {product?.name}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
          ${product?.price?.toLocaleString()}
        </Typography>
        {product?.originalPrice && (
          <Typography variant="body2">
            <span style={{ textDecoration: "line-through", marginRight: 4 }}>
              ${product.originalPrice.toLocaleString()}
            </span>
            <span>{product.discount}% OFF</span>
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          12 cuotas sin interés de ${product.installment.toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
          ${product.transferPrice.toLocaleString()} con transferencia
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, width: "100%" }}
          className="btn-contact"
        >
          Comprar
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
