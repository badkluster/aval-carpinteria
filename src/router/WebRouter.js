import React from "react";
import { Routes, Route } from "react-router-dom";
import { Error404, Auth, Home } from "../pages";
import { LayoutAdmin } from "../layout";
import { useAuth } from "../hooks";
import AdminHeaders from "../pages/AdminHeader";
import CategoryAdmin from "../pages/AdminCategories/CategoryAdmin";
import AdminProductos from "../pages/AdminProductos/AdminProductos";
import Configuracion from "../pages/Configuracion/Configuracion";
import Catalogo from "../pages/Catalogo";
import { LayoutBasic } from "../layout/LayoutBasic";
import ProductDetail from "../pages/ProductDetail";
import AdminTestimonios from "../pages/AdminTestimonios/AdminTestimonios";
import AdminClients from "../pages/AdminClients";
import Checkout from "../pages/Checkout/Checkout";

export function WebRouter() {
  const { user } = useAuth();

  const loadLayout = (Layout, Page) => {
    return (
      <Layout>
        <Page />
      </Layout>
    );
  };

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/*" element={loadLayout(LayoutBasic, Home)} />
          <Route path="/login" element={<Auth />} />
          <Route path="/catalogo" element={loadLayout(LayoutBasic, Catalogo)} />
          <Route
            path="/producto/:id"
            element={loadLayout(LayoutBasic, ProductDetail)}
          />
          <Route path="/checkout" element={loadLayout(LayoutBasic, Checkout)} />
        </>
      ) : (
        <>
          {["/", "/headers"].map((path) => (
            <Route
              key={path}
              path={path}
              element={loadLayout(LayoutAdmin, AdminHeaders)}
            />
          ))}
          <Route
            path="/categorias"
            element={loadLayout(LayoutAdmin, CategoryAdmin)}
          />
          <Route
            path="/productos"
            element={loadLayout(LayoutAdmin, AdminProductos)}
          />
          <Route
            path="/clients"
            element={loadLayout(LayoutAdmin, AdminClients)}
          />
          <Route
            path="/testimonios"
            element={loadLayout(LayoutAdmin, AdminTestimonios)}
          />
          <Route
            path="/config"
            element={loadLayout(LayoutAdmin, Configuracion)}
          />
          <Route path="*" element={loadLayout(LayoutAdmin, Error404)} />
        </>
      )}
    </Routes>
  );
}
