import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";

import AutoAwesomeMosaicOutlinedIcon from "@mui/icons-material/AutoAwesomeMosaicOutlined";

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";

import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import "./AdminMenu.scss";

export function AdminMenu(props) {
  const { menuCollapsed } = props;
  const navigate = useNavigate();
  let location = useLocation();
  const { Sider } = Layout;
  const [current, setCurrent] = useState(location.pathname);

  const onClick = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  useEffect(() => {}, [menuCollapsed]);

  const items = [
    {
      label: "Carrousel",
      key: "/headers",
      icon: (
        <ViewCarouselIcon sx={{ color: "white" }} style={{ fontSize: 25 }} />
      ),
    },
    {
      label: "ABM",
      key: "abm",
      icon: (
        <EditOutlinedIcon sx={{ color: "white" }} style={{ fontSize: 25 }} />
      ), // 👈 Ahora en color blanco
      children: [
        {
          label: "Productos",
          key: "/productos",
          icon: (
            <ConstructionOutlinedIcon
              sx={{ color: "white" }}
              style={{ fontSize: 25 }}
            />
          ),
        },
        {
          label: "Categorías",
          key: "/categorias",
          icon: (
            <AutoAwesomeMosaicOutlinedIcon
              sx={{ color: "white" }}
              style={{ fontSize: 25 }}
            />
          ),
        },
        // {
        //   label: "Marcas",
        //   key: "/marcas",
        //   icon: (
        //     <VerifiedOutlinedIcon
        //       sx={{ color: "white" }}
        //       style={{ fontSize: 25 }}
        //     />
        //   ),
        // },
        // {
        //   label: "Plazas",
        //   key: "/plazas",
        //   icon: (
        //     <KingBedOutlinedIcon
        //       sx={{ color: "white" }}
        //       style={{ fontSize: 25 }}
        //     />
        //   ),
        // },
        // {
        //   label: "Medidas",
        //   key: "/medidas",
        //   icon: (
        //     <StraightenOutlinedIcon
        //       sx={{ color: "white" }}
        //       style={{ fontSize: 25 }}
        //     />
        //   ),
        // },
        {
          label: "Testimonios",
          key: "/testimonios",
          icon: (
            <ChatOutlinedIcon
              sx={{ color: "white" }}
              style={{ fontSize: 25 }}
            />
          ),
        },
        {
          label: "Clientes",
          key: "/clients",
          icon: (
            <Groups2OutlinedIcon
              sx={{ color: "white" }}
              style={{ fontSize: 25 }}
            />
          ),
        },
        // {
        //   label: "Modelos",
        //   key: "/modelos",
        //   icon: <LayersOutlinedIcon sx={{ color: "white" }} style={{ fontSize: 25 }} />,
        // },
      ],
    },
    {
      label: "Configuración",
      key: "/config",
      icon: (
        <SettingsOutlinedIcon
          sx={{ color: "white" }}
          style={{ fontSize: 25 }}
        />
      ),
    },
  ];

  return (
    <Sider className="admin-sider" collapsed={menuCollapsed}>
      <Menu
        className="menu"
        mode="inline"
        onClick={onClick}
        selectedKeys={[current]}
        items={items}
      />
    </Sider>
  );
}
