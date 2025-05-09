import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { Auth } from "../../../api";
import { useAuth } from "../../../hooks";
import Modal from "../../Modal";
import { ENV } from "../../../utils";

const authController = new Auth();

export function LoginForm() {
  const { login } = useAuth();

  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isVisibleModalPassword, setIsVisibleModalPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeForm = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (event) => {
    setLoading(true);
    try {
      const data = {
        userName: inputs.userName,
        password: inputs.password,
      };
      const response = await authController.login(data);

      if (response?.msg || response?.message) {
        notification["error"]({
          message: response?.msg || response?.message || "Error del servidor",
        });
        return;
      }

      if (response?.access) {
        localStorage.setItem(ENV.JWT.ACCESS, response?.access);
        localStorage.setItem(ENV.JWT.REFRESH, response?.refresh);
        login(response?.access);
        navigate("/");
      }
    } catch (error) {
      console.log("error login user", error);
      notification["error"]({
        message: error?.response?.message || "Error del servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-Page">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form className="containerControls" onFinish={handleLogin}>
          <div style={{ paddingBottom: "3vh", width: "100%" }}>
            <label
              className="loginInputLabel"
              style={{ color: "#fff", fontWeight: "bold" }}
            >
              Usuario
            </label>
            <Input
              name="userName"
              placeholder="Ingrese su usuario"
              className="login-form__input"
              onChange={changeForm}
            />
          </div>
          <label
            className="loginInputLabel"
            style={{ color: "#fff", fontWeight: "bold" }}
          >
            Contraseña
          </label>
          <Input.Password
            name="password"
            placeholder="Ingrese su contraseña"
            className="login-form__input"
            onChange={changeForm}
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
          />
          <div className="containerLoginButton" style={{ paddingTop: "1rem" }}>
            <Button
              className="login-form__button"
              loading={loading}
              htmlType="submit"
            >
              Entrar
            </Button>
          </div>
          <div className="containerLoginButton" style={{ paddingTop: "10px" }}>
            <Button
              style={{ marginTop: "10px", color: "#fff" }}
              onClick={() => navigate("/")}
              type="link"
            >
              Volver a la página principal
            </Button>
          </div>
        </Form>
      </div>
      <Modal
        title="Recuperación de contraseña"
        open={isVisibleModalPassword}
        setIsVisible={setIsVisibleModalPassword}
      >
        {/* Modal content goes here */}
      </Modal>
    </div>
  );
}
