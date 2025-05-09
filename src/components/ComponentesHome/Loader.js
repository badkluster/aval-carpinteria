import React from "react";
import loaderspin from "../../assets/carpintero.gif";

import "./Loader.css";

export default function Loader() {
  return (
    <div className="loaderContainer">
      <img src={loaderspin} alt="loader"></img>
      {/* <span>Aguarde un momento...</span> */}
    </div>
  );
}
