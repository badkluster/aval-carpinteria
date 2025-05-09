import {
  Drawer,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  Divider,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";

const CartSidebar = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotal,
    openSidebar,
    setOpenSidebar,
  } = useCart();

  const navigate = useNavigate();
  // Usamos useTheme y useMediaQuery para detectar el tamaño de pantalla
  const theme = useTheme();
  // Consideramos "pantalla grande" si el ancho es al menos "sm" (puedes ajustar el breakpoint si lo deseas)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const footerHeight = isLargeScreen ? 120 : 200;

  return (
    <>
      <Badge
        badgeContent={cart.reduce((acc, item) => acc + item.quantity, 0)}
        color="secondary"
        overlap="circular"
      >
        <ShoppingCartOutlinedIcon
          onClick={() => setOpenSidebar(true)}
          sx={{ cursor: "pointer", fontSize: "2rem" }}
        />
      </Badge>

      <Drawer
        anchor="right"
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        ModalProps={{ keepMounted: true }}
        disableScrollLock
      >
        {/* Contenedor principal con posición relativa para poder posicionar el footer de forma fija */}
        <Box
          sx={{
            width: { xs: 300, sm: 350 },
            height: "100vh",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cabecera */}
          <Box sx={{ p: 2, backgroundColor: "background.paper" }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">CARRITO DE COMPRAS</Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => setOpenSidebar(false)}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Área central: lista de productos con margen inferior para dejar espacio al footer */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              mb: `${footerHeight}px`,
            }}
          >
            {cart.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Tu carrito está vacío
              </Typography>
            ) : (
              <List>
                {cart.map((item) => (
                  <ListItem
                    key={item._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Imagen del producto */}
                    <Box
                      component="img"
                      src={item.images[0]}
                      alt={item.name}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 1,
                        mr: 2,
                      }}
                    />
                    {/* Información del producto */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.price} x {item.quantity}
                      </Typography>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity === 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1">
                            {item.quantity}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                    {/* Botón de eliminar */}
                    <IconButton
                      onClick={() => removeFromCart(item._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Footer fijo: siempre visible */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: `${footerHeight}px`,
              p: 2,
              backgroundColor: "background.paper",
              boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" align="right">
              Total: ${getTotal()}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={cart.length === 0}
              onClick={() => {
                setOpenSidebar(false); // Cierra el drawer antes de navegar
                setTimeout(() => navigate("/checkout"), 300); // Da un pequeño delay antes de navegar
              }}
            >
              Finalizar Compra
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default CartSidebar;
