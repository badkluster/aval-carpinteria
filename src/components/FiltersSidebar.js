import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { obtenerFiltrosDisponiblesParaProductos } from "../api/products.service";

export default function FiltersSidebar({
  selectedFilters = {},
  onFilterChange,
}) {
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
  });

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [priceRange, setPriceRange] = useState([0, 3000000]);

  const [expandedAccordions, setExpandedAccordions] = useState({ price: true });

  const initializedRef = useRef(false);

  const fetchAvailableFilters = async () => {
    try {
      const result = await obtenerFiltrosDisponiblesParaProductos();
      if (result.data && result.data.filtros) {
        const filtersObj = result.data.filtros.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setAvailableFilters({
          categories: filtersObj.categories || [],
        });
      }
    } catch (error) {
      console.error("Error fetching available filters", error);
    }
  };

  const handleAccordionToggle = (panel) => (event, isExpanded) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  const getIdsFromNames = (names, list) => {
    if (!names || !Array.isArray(names)) return [];
    return names
      .map((name) => {
        const found = list.find((item) => item.name === name);
        return found ? found._id : null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    fetchAvailableFilters();
  }, []);

  useEffect(() => {
    if (!availableFilters.categories.length || initializedRef.current) return;

    const categoryIds = getIdsFromNames(
      selectedFilters.category,
      availableFilters.categories
    );

    const priceRangeVal = selectedFilters.priceRange || [0, 3000000];

    setSelectedCategories(categoryIds);

    setPriceRange(priceRangeVal);

    setExpandedAccordions({
      categories: categoryIds.length > 0,

      price: true,
    });

    initializedRef.current = true;
  }, [availableFilters, selectedFilters]);

  const handleToggle = useCallback((value, setFn) => {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  useEffect(() => {
    if (!initializedRef.current) return;

    onFilterChange({
      category: selectedCategories,

      priceRange,
    });
  }, [selectedCategories, priceRange, onFilterChange]);

  const handleClearFilters = () => {
    setSelectedCategories([]);

    setPriceRange([0, 3000000]);
    setExpandedAccordions({});
    onFilterChange({
      category: [],

      priceRange: [0, 3000000],
      maxWeightSupported: [80, 120],
    });
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <Typography variant="h6" gutterBottom>
        Filtros
      </Typography>

      {/* Categorías */}
      <Accordion
        expanded={expandedAccordions.categories || false}
        onChange={handleAccordionToggle("categories")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Categorías</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {availableFilters.categories.map((cat) => (
              <FormControlLabel
                key={cat._id}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(cat._id)}
                    onChange={() =>
                      handleToggle(cat._id, setSelectedCategories)
                    }
                  />
                }
                label={cat.name}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Precio */}
      <Accordion
        expanded={expandedAccordions.price || false}
        onChange={handleAccordionToggle("price")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Precio</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" gutterBottom>
            Rango: ${priceRange[0].toLocaleString()} - $
            {priceRange[1].toLocaleString()}
          </Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={3000000}
            step={10000}
          />
        </AccordionDetails>
      </Accordion>
      {/* Peso máximo soportado */}

      <Button
        variant="contained"
        style={{ backgroundColor: "#097197", marginTop: 8 }}
        fullWidth
        onClick={handleClearFilters}
      >
        Limpiar filtros
      </Button>
    </Box>
  );
}
