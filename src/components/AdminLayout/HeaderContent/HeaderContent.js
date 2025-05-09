import React from "react";
// import { useLocation } from "react-router-dom";
import CachedIcon from "@mui/icons-material/Cached";

export function HeaderContent() {
  // const location = useLocation();

  // const locationName = location.pathname?.slice(1);

  const reload = () => {
    window.location.reload();
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          <CachedIcon onClick={reload} style={{ cursor: "pointer" }} />
          {/* <span
            style={{
              fontWeight: 600,
              marginLeft: "1rem",
              color: "#fff",
              textTransform: "capitalize",
            }}
          > */}
          {/* {location.pathname === "/" ? "Dashboard" : locationName} */}
          {/* </span> */}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <MiscellaneousServicesIcon style={{ fontSize: 25 }} /> */}
        </div>
      </div>
    </>
  );
}
