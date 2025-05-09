import React from "react";
import { Grid } from "@mui/material";
import { motion } from "framer-motion";
import useInView from "../../hooks/useInView";

import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";
import { TikTokOutlined } from "@ant-design/icons";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import "./ContactForm.css";

const ConctactForm = ({ enterprise }) => {
  const [isInViewContacto, refContacto] = useInView();
  const [isInViewMapa, refMapa] = useInView();

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "90%",
    margin: "0 auto",
    textAlign: "center",
    overflow: "hidden",
  };

  const textStyle = {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  };

  function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, ""); // Elimina todos los caracteres que no sean números
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f5f5f5" }} id="contacto">
      <div
        style={{ padding: "2rem", backgroundColor: "#f5f5f5" }}
        id="contacto"
      >
        <h2 className="section-title" style={{ color: "rgb(53, 46, 133, 08)" }}>
          Contacto
        </h2>
        <Grid container spacing={4} justifyContent="center">
          {/* Información de Contacto */}
          <Grid item xs={12} md={6}>
            <motion.div
              ref={refContacto}
              initial={{ opacity: 0, y: 100 }}
              animate={
                isInViewContacto ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }
              }
              transition={{ duration: 0.8 }}
              style={cardStyle}
            >
              <p style={{ ...textStyle, marginBottom: "2rem" }}>
                Nos encantaría saber de vos. Contáctanos para más información
                sobre nuestros productos.
              </p>
              <Grid container spacing={2}>
                {/* Primera columna */}
                <Grid item xs={12} md={6}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4
                      style={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        color: "rgb(53, 46, 133, 08)",
                      }}
                    >
                      Llamanos o envianos un mensaje
                    </h4>

                    <p style={textStyle}>
                      <WhatsAppIcon style={{ marginRight: "5px" }} />
                      <a
                        href={`https://wa.me/${formatPhoneNumber(
                          enterprise?.celular || "+5492216274033"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#1e90ff",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        {enterprise?.celular || "+5492216274033"}
                      </a>
                    </p>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        color: "rgb(53, 46, 133, 08)",
                      }}
                    >
                      Escribinos
                    </h4>
                    <p style={textStyle}>
                      <EmailOutlinedIcon style={{ marginRight: "5px" }} />
                      <a
                        href={`mailto:${
                          enterprise?.email || "javialvez@gmail.com"
                        }`}
                        style={{
                          color: "#1e90ff",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        {enterprise?.email || "javialvez@gmail.com"}
                      </a>
                    </p>
                  </div>
                </Grid>
                {/* Segunda columna */}
                <Grid item xs={12} md={6}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4
                      style={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        color: "rgb(53, 46, 133, 08)",
                      }}
                    >
                      Nuestra dirección
                    </h4>
                    <div
                      style={{ alignItems: "flex-start", fontSize: "1.1rem" }}
                    >
                      <p>
                        <PlaceOutlinedIcon />
                        {enterprise?.direccion
                          ? enterprise.direccion
                          : "Calle 150 nro 1173, Los Hornos, La Plata, Provincia de Buenos Aires, Argentina"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        color: "rgb(53, 46, 133, 08)",
                      }}
                    >
                      Redes Sociales
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <a
                        href={
                          enterprise?.facebook
                            ? `https://www.facebook.com/${enterprise.facebook}/`
                            : "https://www.facebook.com/avalcarpinteria/"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                      >
                        <Facebook
                          style={{ fontSize: "2rem", color: "#4267B2" }}
                        />
                      </a>
                      <a
                        href={
                          enterprise?.instagram
                            ? `https://www.instagram.com/${enterprise.instagram}/`
                            : "https://www.instagram.com/avalcarpinteria/"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <Instagram
                          style={{ fontSize: "2rem", color: "#E1306C" }}
                        />
                      </a>
                      <a
                        href={`https://wa.me/${
                          enterprise?.celular
                            ? formatPhoneNumber(enterprise.celular)
                            : "2216274033"
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                      >
                        <WhatsApp
                          style={{ fontSize: "2rem", color: "#25D366" }}
                        />
                      </a>

                      <a
                        href={
                          enterprise?.tiktok
                            ? `https://www.tiktok.com/${enterprise.tiktok}`
                            : "https://www.tiktok.com/@aval.lp"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok"
                      >
                        <TikTokOutlined style={{ fontSize: "1.8rem" }} />
                      </a>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>
        </Grid>
      </div>

      {/* Acá podés mantener la sección de mapas o eliminarla si no se necesita */}
      <Grid container spacing={2}>
        <Grid item xs={0} md={4}></Grid>
        <Grid item xs={12} md={4} id="sucursales">
          <h2 className="sucursales-section-title">Nuestra ubicación</h2>
        </Grid>

        <Grid item xs={12}>
          <motion.div
            ref={refMapa}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInViewMapa
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.8 }}
            style={{ ...cardStyle, marginTop: "3rem" }}
          >
            <iframe
              title="Ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.5514987877737!2d-57.9904152!3d-34.9586972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e9005ba667ad%3A0x72377695b7187894!2sAval%20Carpinteria!5e0!3m2!1ses-419!2sar!4v1715184200000!5m2!1ses-419!2sar"
              style={{
                border: "0",
                width: "100%",
                height: "400px",
                borderRadius: "8px",
              }}
              allowFullScreen=""
              loading="lazy"
            />
          </motion.div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ConctactForm;
