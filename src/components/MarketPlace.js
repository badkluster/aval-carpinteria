/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  Autocomplete,
  TextField,
  Pagination,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import FiltersSidebar from "./FiltersSidebar";
import ProductList from "./ProductList";
import { obtenerListaCatalogoProductos } from "../api/products.service";
import Loader2 from "./Loader2";

const sortOptions = [
  { label: "Más vendidos", value: "ventas" },
  { label: "Precio más bajo", value: "precio_bajo" },
  { label: "Precio más alto", value: "precio_alto" },
  { label: "Mayor descuento", value: "descuento" },
  { label: "Envío gratis", value: "envio_gratis" },
];

const parseFiltersFromURL = (search) => {
  const searchParams = new URLSearchParams(search);
  const newFilters = {};
  if (searchParams.get("categoryId")) {
    newFilters.category = [searchParams.get("categoryId")];
  }

  return newFilters;
};

export default function Marketplace() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const initialFilters = useMemo(
    () => parseFiltersFromURL(location.search),
    [location.search]
  );
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const [products, setProducts] = useState([]);
  const [apiFilters, setApiFilters] = useState({});
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("ventas");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 40;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, filters, searchQuery, sortBy]);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const queryFilters = {
        ...filters,
        search: searchQuery,
        sortBy,
      };

      const response = await obtenerListaCatalogoProductos(
        page,
        productsPerPage,
        queryFilters
      );
      if (response?.data) {
        setProducts(response.data.items || []);
        setTotalProducts(response.data.totalItems || 0);

        if (response.data.filtros) {
          const apiFiltersObj = {};
          response.data.filtros.forEach((f) => {
            if (f.categories) apiFiltersObj.categories = f.categories;
          });
          setApiFilters(apiFiltersObj);
        }
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
      setIsLoading(false);
    }

    fetchProducts();
  }, [page, filters, searchQuery, sortBy]);

  const handleFilterChange = useCallback((selectedFilters) => {
    console.log("aplicando fliltros", selectedFilters);
    setFilters(selectedFilters);
    setPage(1);
  }, []);

  return (
    <Box sx={{ width: "100%", margin: "0 auto", padding: "16px" }}>
      <Box
        sx={{
          mb: 1,
          background: "#f5f5f5",
          padding: 2,
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={600}></Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <Typography variant="h5" fontWeight={600}>
            {totalProducts || 0} resultados
          </Typography>
          <FiltersSidebar
            selectedFilters={filters} // <--- Prop nueva
            onFilterChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} md={10}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar productos..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: "#fff" }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                options={sortOptions}
                getOptionLabel={(option) => option.label}
                value={
                  sortOptions.find((option) => option.value === sortBy) || null
                }
                onChange={(event, newValue) =>
                  setSortBy(newValue ? newValue.value : "ventas")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ordenar por"
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: "#fff" }}
                  />
                )}
              />
            </Grid>
          </Grid>
          {isLoading ? (
            <Loader2 />
          ) : (
            <>
              {products?.length > 0 ? (
                <ProductList products={products} view={view} />
              ) : (
                <Typography
                  variant="h6"
                  sx={{ textAlign: "center", mt: 4, color: "gray" }}
                >
                  No hay productos disponibles
                </Typography>
              )}
            </>
          )}
          <Pagination
            count={Math.ceil(totalProducts / productsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
