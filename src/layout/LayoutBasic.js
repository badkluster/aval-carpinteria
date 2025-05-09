import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import "./LayoutBasic.css";
import Footer from "../components/ComponentesHome/Footer";
import Navbar from "../components/ComponentesHome/Navbar";
import Loader from "../components/ComponentesHome/Loader";
import { obtenerRegistrosActivos } from "../api/headers.service";

export function LayoutBasic({ children }) {
  const { Content } = Layout;
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [enterprise, setEnterprise] = useState(null);

  const getHeaders = async () => {
    setLoading(true);
    try {
      const result = await obtenerRegistrosActivos();

      if (result.empresa) {
        setCategories(result.categories);
        setEnterprise(result.empresa);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.log("Error al obtener headers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { hash } = location;
    if (hash) {
      const sectionId = hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 200); // Puedes ajustar el tiempo según tus necesidades
    }
  }, [location]);

  useEffect(() => {
    getHeaders();
  }, []);

  if (loading) return <Loader />;

  return (
    <Layout className="layout-basic">
      {/* Navbar */}
      <header className="layout-basic__header">
        <Navbar categories={categories} enterprise={enterprise} />
      </header>

      {/* Contenido principal con marginTop dinámico */}
      <Content
        className="layout-basic__content"
        style={{ marginTop: location.pathname === "/" ? 0 : "5rem" }}
      >
        {children}
      </Content>

      {/* Footer */}
      <footer className="layout-basic__footer">
        <Footer enterprise={enterprise} />
      </footer>
    </Layout>
  );
}
