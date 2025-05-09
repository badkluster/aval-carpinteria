import React, { useState } from "react";

import { BasicModal } from "../../components/Shared";
import { UserForm, ListUsers } from "../../components/Admin/Users";
import "./Users.scss";
import { Tab } from "@mui/material";
import { Button } from "antd";

export function Users() {
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);

  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onReload = () => setReload((prevState) => !prevState);

  const panes = [
    {
      menuItem: "Usuarios activos",
      render: () => (
        <Tab.Pane attached={false}>
          <ListUsers usersActive={true} reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Usuarios inactivos",
      render: () => (
        <Tab.Pane attached={false}>
          <ListUsers usersActive={false} reload={reload} onReload={onReload} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <div className="users-page">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            className="users-page__add"
            primary
            onClick={onOpenCloseModal}
          >
            Nuevo usuario
          </Button>
        </div>
        <Tab menu={{ secondary: true }} panes={panes} />
      </div>

      <BasicModal
        show={showModal}
        close={onOpenCloseModal}
        title="Crear nuevo usuario"
      >
        <UserForm close={onOpenCloseModal} onReload={onReload} />
      </BasicModal>
    </>
  );
}
