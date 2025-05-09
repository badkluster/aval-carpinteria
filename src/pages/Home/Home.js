/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/ComponentesHome/Header";
import ContactForm from "../../components/ComponentesHome/ContactForm";
import FloatingButton from "../../components/ComponentesHome/FloatingButton";
import Loader from "../../components/ComponentesHome/Loader";
import FeaturedProducts from "../../components/ComponentesHome/Products";
import Testimonios from "../../components/ComponentesHome/Testimonios";
import CategoriaSection from "../../components/ComponentesHome/CategoriasSection";
import { obtenerRegistrosActivos } from "../../api/headers.service";
import "./Home.css";

export function Home() {
  const location = useLocation(); // Obtiene la ruta actual
  const [loading, setLoading] = useState(true);
  const [headers, setHeaders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enterprise, setEnterprise] = useState(null);
  const [destacados, setDestacados] = useState([]);

  const [testimoniosList, setTestimoniosList] = useState([]);

  const getHeaders = async () => {
    setLoading(true);
    try {
      const result = await obtenerRegistrosActivos();
      if (result.headers.length > 0) {
        console.log("resultado headers", result);
        setHeaders([
          {
            _id: "674a300eb2a472d5ddc4ede2",
            image: "https://www.cema.com.ar/wp-content/uploads/header41.jpg",
            title: "DISEÑO",
            created: "2024-11-29T21:20:14.638Z",
            createdBy: "66951637af273c7ee46d636d",
            __v: 0,
            modified: "2025-01-27T23:21:05.018Z",
            modifiedBy: "66951637af273c7ee46d636d",
            active: true,
            detail: "Diseñamos a tu medida",
          },
          {
            _id: "674a3033b2a472d5ddc4ede8",
            image:
              "https://laurbedigital.com.ar/noticias/wp-content/uploads/2025/03/20250319-Carpintero.jpg",
            title: "CALIDAD",
            created: "2024-11-29T21:20:51.459Z",
            createdBy: "66951637af273c7ee46d636d",
            __v: 0,
            active: true,
            modified: "2025-02-14T16:50:37.093Z",
            modifiedBy: "66951637af273c7ee46d636d",
            link: "/catalogo",
            linkTitle: "Catálogo",
            detail: "Utilizamos la mejor materia prima",
          },
        ]);
        setCategories(result?.categories || []);
        setEnterprise(result.empresa || null);
        setDestacados(result?.productos || []);

        setTestimoniosList(result?.testimonios || []);
        // verificarSectionActiva();
      } else {
        setHeaders([
          {
            _id: "674a300eb2a472d5ddc4ede2",
            image: "https://www.cema.com.ar/wp-content/uploads/header41.jpg",
            title: "DISEÑO",
            created: "2024-11-29T21:20:14.638Z",
            createdBy: "66951637af273c7ee46d636d",
            __v: 0,
            modified: "2025-01-27T23:21:05.018Z",
            modifiedBy: "66951637af273c7ee46d636d",
            active: true,
            detail: "Diseñamos a tu medida",
          },
          {
            _id: "674a3033b2a472d5ddc4ede8",
            image:
              "https://www.eammosca.com/wp-content/uploads/2022/06/Wood-products-header.jpg",
            title: "CALIDAD",
            created: "2024-11-29T21:20:51.459Z",
            createdBy: "66951637af273c7ee46d636d",
            __v: 0,
            active: true,
            modified: "2025-02-14T16:50:37.093Z",
            modifiedBy: "66951637af273c7ee46d636d",
            link: "/catalogo",
            linkTitle: "Catálogo",
            detail: "Utilizamos la mejor materia prima",
          },
          {
            _id: "67a3b1b3d7e26016726466ef",
            image:
              "https://s3.us-east-1.amazonaws.com/sommier.home/uploads/utlm64ow-Dise%C3%B1o%20sin%20t%C3%ADtulosdd.png",
            title: "ERGONOMÍA",
            active: true,
            created: "2025-02-05T18:45:07.823Z",
            createdBy: "66951637af273c7ee46d636d",
            __v: 0,
            modified: "2025-02-18T12:54:19.763Z",
            modifiedBy: "66951637af273c7ee46d636d",
            description: "",
            detail: "Soporte perfecto para tu cuerpo en cada posición",
          },
        ]);

        setCategories([]);
        setTestimoniosList([]);
      }
    } catch (error) {
      console.log("Error al obtener headers");
    } finally {
      setLoading(false);
    }
  };

  // const verificarSectionActiva = () => {
  //   const { hash } = location;
  //   if (hash) {
  //     const sectionId = hash.replace("#", "");
  //     setTimeout(() => {
  //       const element = document.getElementById(sectionId);
  //       if (element) {
  //         element.scrollIntoView({ behavior: "smooth" });
  //       }
  //     }, 200); // Puedes ajustar el tiempo según tus necesidades
  //   }
  // };

  // useEffect(() => {
  //   verificarSectionActiva();
  // }, [location]);

  useEffect(() => {
    getHeaders();
  }, []);

  useEffect(() => {
    const { hash } = location;
    if (!loading && hash) {
      const sectionId = hash.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location, loading]);

  if (loading) return <Loader />;

  return (
    <div>
      <>
        <Header slides={headers} />
        {/* <SponsorsSection sponsorsList={sponsorsList} /> */}
        <FeaturedProducts destacados={destacados} />
        {categories.length > 0 && (
          <CategoriaSection
            categories={categories}
            enterprise={enterprise}
            // setSectionAlquilerView={setSectionAlquilerView}
            // setSelectOptionAlquiler={setSelectOptionAlquiler}
          />
        )}
        <Testimonios testimonios={testimoniosList} />
        <ContactForm enterprise={enterprise} categories={categories} />
      </>

      <FloatingButton enterprise={enterprise} />
    </div>
  );
}
