import React from "react";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

export default function ProductList({ products, view }) {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {products.map((product) => (
        <Grid
          item
          xs={12} sm={6} md={4} lg={3}
          key={product.id}
        >
          <ProductCard product={product} view={view} />
        </Grid>
      ))}
    </Grid>
  );
}
