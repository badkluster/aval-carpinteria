import React from "react";
// import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { WebRouter } from "./router";
import { AuthProvider } from "./contexts";
import { MyReloadContextProvider } from "./contexts/reloadRequest";
import { CartProvider } from "./contexts/CartContext";

// import DisableDevTools from "./utils/DisableDevTools";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MyReloadContextProvider>
          <HashRouter>
            <WebRouter />
          </HashRouter>
        </MyReloadContextProvider>
      </CartProvider>
    </AuthProvider>
  );
}
