/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import "./Navbar.css"; // Importar el CSS
import CartSidebar from "../CartSidebar";

const Navbar = ({ categories, enterprise }) => {
  const [menuActive, setMenuActive] = useState(false);
  const [alquilerMenuActive, setAlquilerMenuActive] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
    if (!menuActive) setAlquilerMenuActive(false);
  };

  const handleCategoryClick = (category) => {
    setMenuActive(false);

    if (location.pathname === "/catalogo") {
      navigate(`/catalogo?categoryId=${category.name}`);
    } else {
      navigate(`/catalogo?categoryId=${category.name}`);
    }
  };

  const handleNavLinkClick = (section) => {
    // Forzar navegación a home primero, luego scroll al ID
    navigate("/", { replace: false });

    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // Si no encuentra el elemento, intenta usar el hash directamente
        window.location.hash = section;
      }
    }, 100); // Delay para esperar el renderizado si hace falta
  };

  const handlePageNavLinkClick = (section) => {
    // Navegar a lasección
    navigate(`/${section}`);
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
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuActive(false);
        setAlquilerMenuActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              letterSpacing: "2px",
              color: "#8B5E3C",
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            AVAL CARPINTERÍA
          </span>
        </Link>
      </div>

      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        <li>
          <a onClick={() => handleNavLinkClick("destacados")}>Destacados</a>
        </li>

        {categories.length > 0 && (
          <li>
            <span>Productos</span>
            <ul className={`submenu ${alquilerMenuActive ? "active" : ""}`}>
              <li onClick={() => handlePageNavLinkClick("catalogo")}>
                <span>Todos</span>
              </li>
              {categories.map((c) => (
                <li key={c._id} onClick={() => handleCategoryClick(c)}>
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
          </li>
        )}

        <li>
          <a onClick={() => handleNavLinkClick("testimonios")}>Testimonios</a>
        </li>
        <li>
          <a onClick={() => handleNavLinkClick("contacto")}>Contacto</a>
        </li>

        <li className="social-icons-humburguer">
          <Link>
            {/* <ShoppingCartOutlinedIcon /> */}
            <CartSidebar />
          </Link>
          <Link to="/login">
            <LoginIcon fontSize="large" />
          </Link>
        </li>
      </ul>

      <div className="social-icons">
        <Link>
          <CartSidebar />
        </Link>
        <Link to="/login">
          <LoginIcon fontSize="large" />
        </Link>
      </div>

      <div className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;
