import React from "react";
import { TailSpin } from  'react-loader-spinner'

import "./Loader2.scss"

export default function Loader2() {
    return (
        <div className="loaderContainer2">
            <TailSpin
                className="loader"
                height="80"
                width="80"
                color="#1976d2"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
  }