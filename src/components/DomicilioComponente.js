import React, { useRef, useState, useEffect } from "react";
import { TextField } from "@mui/material";

const Domicilio = ({ value, onPostalCodeChange }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || "");

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    // onChange(newValue); // Pass the updated value back to the parent component
  };

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps JavaScript API script not loaded");
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        const formattedAddress = place.formatted_address;
        setInputValue(formattedAddress);
        // onChange(formattedAddress); // Update the parent with the new address

        const codePostalComponent = place.address_components.find((component) =>
          component.types.includes("postal_code")
        );

        const codigoPostal = codePostalComponent?.long_name || "";
        onPostalCodeChange(codigoPostal, formattedAddress); // Update the parent with the postal code
      }
    });

    autocompleteRef.current = autocomplete;
  }, [onPostalCodeChange]);

  return (
    <TextField
      label="Domicilio"
      size="small"
      value={inputValue}
      onChange={handleInputChange}
      inputRef={inputRef}
      fullWidth
    />
  );
};
export default Domicilio;
