import { Box, Typography } from "@mui/material";

const DiscountBadge = ({ discount }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        left: 10,
        width: 60,
        height: 60,
        backgroundColor: "#e4807f",
        color: "white",
        fontWeight: 700,
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textTransform: "uppercase",
        fontSize: 14,
      }}
    >
      <Typography component="span" sx={{ fontSize: 16, fontWeight: "bold", lineHeight: 1 }}>
        -{discount}%
      </Typography>
      <Typography component="span" sx={{ fontSize: 14, fontWeight: "bold", lineHeight: 1 }}>
        OFF
      </Typography>
    </Box>
  );
};


export default DiscountBadge;