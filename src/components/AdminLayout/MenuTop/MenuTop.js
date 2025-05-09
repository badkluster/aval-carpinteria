import React, { useEffect, useState } from "react";
import { Avatar, Button, Popover } from "antd";
import {
  MenuUnfoldOutlined,
  PoweroffOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../hooks";
import "./MenuTop.css";
import NoAvatar from "../../../assets/no-avatar.png";

import EditPerfil from "../../EditPerfil";
import Modal from "../../Modal";
import { User, Auth } from "../../../api";

const userController = new User();
const authController = new Auth();

export function MenuTop(props) {
  const { menuCollapsed, setMenuCollapsed } = props;
  const { logout, user } = useAuth();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [reload, setReload] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [width, setWidth] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const accessToken = authController.getAccessToken();
  const logoutUser = async () => {
    // eslint-disable-next-line no-unused-vars
    const result = await logout();

    if (result === true) {
      window.location.href = "/";
    } else {
      window.location.href = "/";
    }
  };

  const text = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    ></div>
  );

  const editUser = async () => {
    setIsPopoverVisible(false);
    setIsVisibleModal(true);
    // setWidth("40%");
    setModalTitle(
      `Editar perfil de ${
        usuario?.displayName ? usuario.displayName : "Usuario"
      }`
    );
    setModalContent(
      <EditPerfil
        user={usuario}
        setIsVisibleModal={setIsVisibleModal}
        onReload={setReload}
        reload={reload}
      />
    );
  };

  const content = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: "15px" }}>
          <Avatar
            size={58}
            style={{ border: "3px solid #595451" }}
            src={
              usuario?.avatar !== null &&
              usuario?.avatar !== undefined &&
              usuario?.avatar !== "null" &&
              usuario?.avatar !== "undefined" &&
              usuario?.avatar !== ""
                ? usuario.avatar
                : NoAvatar
            }
          ></Avatar>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            {usuario?.displayName || "Usuario"}
          </span>

          <span style={{ fontSize: "15px", paddingTop: "10px" }}>
            <Button onClick={editUser}>Editar Perfil</Button>
            <Button onClick={logoutUser} style={{ marginLeft: "5px" }}>
              <PoweroffOutlined />
              Cerrar Sesión
            </Button>
          </span>
        </div>
      </div>
    </>
  );

  const getUserActive = async (user) => {
    if (accessToken) {
      const usuarioActive = await userController.getMe(accessToken);

      setUsuario(usuarioActive);
    }
  };

  useEffect(() => {
    getUserActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reload, accessToken]);

  return (
    <>
      <div className="menu-top">
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            paddingTop: "0.5rem",
          }}
        >
          {/* <img
            className="menu-top__left-logo"
            src={Logo}
            alt="Logo"
            onClick={() => (window.location.href = `/`)}
            style={{
              maxWidth: !menuCollapsed ? "200px" : "100%",
              height: !menuCollapsed ? "60px" : "40px",
            }}
          ></img> */}
          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            Aval Carpintería
          </span>

          <Button
            type="Link"
            onClick={() => setMenuCollapsed(!menuCollapsed)}
            // style={{ marginLeft: "1rem" }}
          >
            {menuCollapsed ? <MenuOutlined /> : <MenuUnfoldOutlined />}
          </Button>
        </div>

        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            paddingRight: "2rem",
          }}
        >
          <Popover
            placement="bottomRight"
            title={text}
            content={content}
            trigger="click"
            open={isPopoverVisible}
            onOpenChange={(visible) => {
              setIsPopoverVisible(visible);
              getUserActive();
            }}
          >
            <Avatar
              size={50}
              style={{ border: "3px solid #595451", cursor: "pointer" }}
              src={
                usuario?.avatar !== null &&
                usuario?.avatar !== undefined &&
                usuario?.avatar !== "null" &&
                usuario?.avatar !== "undefined" &&
                usuario?.avatar !== ""
                  ? usuario.avatar
                  : NoAvatar
              }
            />
          </Popover>
        </div>
      </div>
      <Modal
        title={modalTitle}
        open={isVisibleModal}
        setIsVisible={setIsVisibleModal}
        width={width}
      >
        {modalContent}
      </Modal>
    </>
  );
}
