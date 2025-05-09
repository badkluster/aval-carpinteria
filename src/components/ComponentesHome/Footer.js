import React from "react";
import { Grid, IconButton } from "@mui/material";
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";
import "./Footer.css";

import { Link } from "react-router-dom";
import { TikTokOutlined } from "@ant-design/icons";

const Footer = ({ enterprise }) => {
  function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, "");
  }

  function renderHorarios(horarios) {
    return horarios.map((dia, index) => {
      if (dia.apertura === "" && dia.cierre === "") {
        return (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <strong>{dia.nombre}:</strong> Cerrado
          </div>
        );
      }

      return (
        <div key={index} style={{ marginBottom: "0.5rem" }}>
          <strong>{dia.nombre}:</strong> {dia.apertura} - {dia.cierre}
        </div>
      );
    });
  }

  return (
    <footer
      style={{
        backgroundColor: "#8b5e3c",
        color: "#fff",
        padding: "3rem 1rem",
        textAlign: "center",
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
      >
        {/* Horarios */}
        <Grid item xs={12} md={3}>
          <h5 style={{ marginBottom: "1rem", textTransform: "uppercase" }}>
            Horarios de atención
          </h5>
          <div style={{ fontSize: "0.875rem", lineHeight: "1.5" }}>
            {enterprise?.horarios
              ? renderHorarios(enterprise.horarios)
              : "No disponible"}
          </div>
        </Grid>

        {/* Logo y descripción */}
        <Grid item xs={12} md={6}>
          <div
            className="logo"
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            <Link to="/">
              {/* <img
                src={LogoBlanco}
                alt="Logo"
                style={{ width: isMobile ? 180 : 250, display: "inline-block" }}
              /> */}
              <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                Aval Carpinteria
              </span>
            </Link>
          </div>
          <p style={{ margin: "0 auto", maxWidth: "600px", marginTop: "10px" }}>
            {enterprise?.description
              ? enterprise.description
              : "Carpintería artesanal dedicada a la creación de muebles a medida de alta calidad. Diseños personalizados, materiales nobles y acabados profesionales para transformar tus espacios con estilo y funcionalidad."}
          </p>
        </Grid>

        {/* Redes Sociales */}
        <Grid item xs={12} md={3}>
          <div style={{ margin: "1rem 0" }}>
            <IconButton
              href={
                enterprise?.facebook
                  ? `https://www.facebook.com/${enterprise.facebook}/`
                  : "https://www.facebook.com/carpinteriaaval/"
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{ color: "#fff" }}
            >
              <Facebook fontSize="large" />
            </IconButton>
            <IconButton
              href={
                enterprise?.instagram
                  ? `https://www.instagram.com/${enterprise.instagram}/`
                  : "https://www.instagram.com/carpinteriaaval/"
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{ color: "#fff" }}
            >
              <Instagram fontSize="large" />
            </IconButton>
            <IconButton
              href={`https://wa.me/${
                enterprise?.celular
                  ? formatPhoneNumber(enterprise.celular)
                  : "+5492216274033"
              }`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              style={{ color: "#fff" }}
            >
              <WhatsApp fontSize="large" />
            </IconButton>

            <IconButton
              href={
                enterprise?.tiktok
                  ? `https://www.tiktok.com/@${enterprise.tiktok}`
                  : "https://www.tiktok.com/@aval.lp"
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              style={{ color: "#fff" }}
            >
              <TikTokOutlined style={{ fontSize: "1.8rem" }} fontSize="large" />
            </IconButton>
          </div>
        </Grid>

        {/* Derechos Reservados */}
        <Grid item xs={12}>
          <p style={{ fontSize: "0.875rem", margin: 0 }}>
            © {new Date().getFullYear()}{" "}
            {enterprise?.name ? enterprise.name : "Aval Carpintería"}. Todos los
            derechos reservados.
          </p>
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
