import React from "react";
import { TailSpin } from "react-loader-spinner";

import "./Loader.css";

export default function Loader() {
  return (
    <div className="loaderContainer">
      <TailSpin
        className="loader"
        height="80"
        width="80"
        color="#2c659b"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
      <span>Aguarde un momento...</span>
    </div>
  );
}
