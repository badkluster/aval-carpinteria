import { notification } from "antd";
import { TextField, IconButton } from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./ChangePassword.css";
import ButtonComponent from "./ButtonComponent";
import { User } from "../api";

import { ENV } from "../utils";

const userController = new User();
export default function ChangePassword({ setVisibleModal, user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordRepet, setShowPasswordRepet] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPasswordNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  const handleClickShowPasswordRepeat = () => {
    setShowPasswordRepet(!showPasswordRepet);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const cancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setRepeatNewPassword("");
    setVisibleModal(false);
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !repeatNewPassword) {
      notification["error"]({
        message: "Debe completar todos los campos requeridos ",
      });
      return;
    }
    if (newPassword !== repeatNewPassword) {
      notification["error"]({
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    const userUpdate = {
      currentPassword: currentPassword,
      password: newPassword,
    };

    try {
      const resultado = await userController.updatePassword(
        user._id,
        userUpdate
      );
      if (resultado) {
        notification["success"]({
          message: resultado.message,
        });
        setCurrentPassword(null);
        setNewPassword(null);
        setRepeatNewPassword(null);
        setVisibleModal(false);
      }
    } catch (error) {
      console.log(error);

      notification["error"]({
        message: error.message || "Error al cambiar la contraseña",
      });
    }
  };

  return (
    <div>
      <div className="input-container">
        <span className="input-label">Contraseña Actual</span>
        <TextField
          variant="outlined"
          type={showPassword ? "text" : "password"}
          placeholder="Ingrese su contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      </div>

      <div className="input-container">
        <span className="input-label">Nueva contraseña</span>
        <TextField
          variant="outlined"
          placeholder="Ingrese su nueva contraseña"
          type={showPasswordNew ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleClickShowPasswordNew}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPasswordNew ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <div className="input-container" style={{ marginBottom: "1rem" }}>
          <span className="input-label">Repetir nueva contraseña</span>
          <TextField
            variant="outlined"
            type={showPasswordRepet ? "text" : "password"}
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            fullWidth
            placeholder="Repita su nueva contraseña"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleClickShowPasswordRepeat}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPasswordRepet ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </div>
      </div>

      <div className="button-container">
        <ButtonComponent
          name={"Cancelar"}
          toAction={cancel}
          color={ENV.THEME_COLORS.DANGER}
        />
        <ButtonComponent name={"Cambiar"} toAction={changePassword} />
      </div>
    </div>
  );
}
