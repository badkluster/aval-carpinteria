import React from "react";
import { LoginForm } from "../../components/Auth/LoginForm";

import "./Auth.scss";

export function Auth() {
  return (
    <div className="auth">
      <div className="containerLogoLogin" style={{ marginBottom: "2rem" }}>
        {/* <img src={Logo} alt="Logo" className="logo" /> */}
        <span
          style={{
            padding: "2rem",
            fontWeight: "bold",
            color: "#ffff",
            fontSize: "2rem",
            marginBottom: "2rem",
          }}
        >
          Aval Carpintería
        </span>
      </div>

      <div className="containerLoginForm">
        <LoginForm />
      </div>
    </div>
  );
}
