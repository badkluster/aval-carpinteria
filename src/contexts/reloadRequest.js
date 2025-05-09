import React, { createContext, useContext, useState } from "react";

const MyReloadContext = createContext();

export const useMyReloadContext = () => {
  const context = useContext(MyReloadContext);
  if (!context) {
    throw new Error(
      "useMyReloadContext debe ser usado dentro de un MyReloadContextProvider"
    );
  }
  return context;
};

export const MyReloadContextProvider = ({ children }) => {
  const [myReload, setMyReload] = useState(true);

  const toggleReload = () => {
    setMyReload(!myReload);
  };

  return (
    <MyReloadContext.Provider value={{ myReload, toggleReload }}>
      {children}
    </MyReloadContext.Provider>
  );
};
