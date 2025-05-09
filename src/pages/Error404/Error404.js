import { Button } from "antd";
import React from "react";
import error404 from "../../assets/error404.png";

export function Error404() {
  const backToHome = () => {
    window.location.href = "/";
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <img src={error404} alt="imagen error 404" style={{ maxWidth: "100%" }} />
      <br />
      <br />
      <br />
      <Button
        onClick={backToHome}
        style={{
          height: 30,
          paddingLeft: 30,
          paddingRight: 30,
          backgroundColor: "#c3c3c3",
          color: "white",
        }}
      >
        Volver
      </Button>
    </div>
  );
}
