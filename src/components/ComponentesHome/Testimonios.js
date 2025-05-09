import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const Testimonios = ({ testimonios }) => {
  const [currentTestimonio, setCurrentTestimonio] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonio((prev) => (prev + 1) % testimonios?.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonios?.length]);

  const handleNext = () => {
    setCurrentTestimonio((prev) => (prev + 1) % testimonios?.length);
  };

  const handlePrev = () => {
    setCurrentTestimonio(
      currentTestimonio === 0 ? testimonios?.length - 1 : currentTestimonio - 1
    );
  };

  return (
    <Box
      sx={{
        padding: isMobile ? "3rem 1rem" : "6rem 1rem",
        backgroundColor: "#8b5e3c",
      }}
      id="testimonios"
    >
      <h2 className="section-title" style={{ marginBottom: "3rem" }}>
        Testimonios
      </h2>

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              padding: isMobile ? "2rem 1.5rem" : "3rem",
              backgroundColor: "#fff",
              borderRadius: "15px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              textAlign: "center",
              minHeight: isMobile ? "auto" : "340px",
            }}
          >
            <Typography
              variant={isMobile ? "body1" : "h4"}
              style={{
                fontStyle: "italic",
                color: "#111",
                fontWeight: "300",
                marginBottom: "1.5rem",
              }}
            >
              "{testimonios[currentTestimonio]?.description}"
            </Typography>

            <Typography
              variant={isMobile ? "subtitle1" : "h5"}
              style={{
                fontWeight: "bold",
                color: "#333",
                fontFamily: "'Poppins', sans-serif",
                marginTop: "1rem",
              }}
            >
              {testimonios[currentTestimonio]?.reviewerName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                marginTop: "2rem",
                alignItems: "center",
              }}
            >
              <ArrowBackIosNewIcon
                onClick={handlePrev}
                style={{ cursor: "pointer", color: "rgb(53, 46, 133, 0.8)" }}
              />
              <ArrowForwardIosIcon
                onClick={handleNext}
                style={{ cursor: "pointer", color: "rgb(53, 46, 133, 0.8)" }}
              />
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Testimonios;
