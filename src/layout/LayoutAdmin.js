import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { AdminMenu, HeaderContent, MenuTop } from "../components/AdminLayout";
import "./LayoutAdmin.css";
import { ENV } from "../utils";

export function LayoutAdmin({ children }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const { Content, Header } = Layout;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsSmallScreen(mediaQuery.matches);

    if (mediaQuery.matches === true) {
      setMenuCollapsed(true);
    } else {
      setMenuCollapsed(false);
    }
  }, [isSmallScreen]);

  return (
    <>
      <Layout className="layoutContainer">
        <div
          style={{
            height: "100%",
            background: ENV.THEME_COLORS.GRIS,
            position: "fixed",
            top: 40,
          }}
        >
          <AdminMenu menuCollapsed={menuCollapsed} className="siderMenu" />
        </div>

        <Layout
          className="layout-admin"
          style={{ marginLeft: !menuCollapsed ? "200px" : "80px" }}
        >
          <Header className="layout-admin__header">
            <MenuTop
              menuCollapsed={menuCollapsed}
              setMenuCollapsed={setMenuCollapsed}
            />
          </Header>
          <Content className="layout-admin__content">
            <div
              style={{
                width: "100%",
                backgroundColor: ENV.THEME_COLORS.GRIS,
                height: "3rem",
                display: "flex",
                position: "fixed",
                zIndex: 1000,
              }}
            >
              <HeaderContent />
            </div>
            <div style={{ marginTop: 40, padding: "2rem" }}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
