import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../../contexts/CartContext";
import visaIcon from "../../assets/icons/visa.svg";
import mastercardIcon from "../../assets/icons/mastercard.png";
import maestroIcon from "../../assets/icons/maestro.png";
import amexIcon from "../../assets/icons/amex.svg";
import naranjaIcon from "../../assets/icons/naranja.png";
import mercadoPagoIcon from "../../assets/icons/mercadopago.png";
import cabalIcon from "../../assets/icons/cabal.png";
import nativaIcon from "../../assets/icons/nativa.png";
import argencardIcon from "../../assets/icons/argencard.png";
import linkIcon from "../../assets/icons/link.svg";
import banelcoIcon from "../../assets/icons/banelco.png";
import { WHATSAPP_NUMBER } from "../../utils";
import { useNavigate } from "react-router-dom";
import { incrementarInteraccion } from "../../api/products.service";
import { useEffect } from "react";

const Checkout = () => {
  const { cart, getTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const paymentMethods = [
    { name: "Visa", icon: visaIcon },
    { name: "MasterCard", icon: mastercardIcon },
    { name: "Maestro", icon: maestroIcon },
    { name: "American Express", icon: amexIcon },
    { name: "Naranja", icon: naranjaIcon },
    { name: "MercadoPago", icon: mercadoPagoIcon },
    { name: "Cabal", icon: cabalIcon },
    { name: "Nativa", icon: nativaIcon },
    { name: "Argencard", icon: argencardIcon },
    { name: "Link", icon: linkIcon },
    { name: "Banelco", icon: banelcoIcon },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cart]);

  const handleBuyClick = async () => {
    cart.forEach(async (product) => {
      await incrementarInteraccion(product._id);
    });

    const productDetails = cart
      .map(
        (item) =>
          `*${item.name}* x ${item.quantity} — $${item.price * item.quantity}`
      )
      .join("\n");
    const mensaje = `Hola! Quiero comprar:\n\n${productDetails}\n\nTotal: $${getTotal()}\n\nGracias!`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "conversion_compra",
      value: getTotal(), // valor numérico
      currency: "ARS",
    });

    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      clearCart();
      navigate("/");
    }, 1000); // importante: tiempo de espera mayor
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
        🛒 Resumen de Compra
      </Typography>

      <Grid container spacing={4}>
        {cart.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRadius: 3,
                boxShadow: 4,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.015)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={item.images[0]}
                alt={item.name}
                sx={{ height: 200, objectFit: "cover", borderRadius: "12px 12px 0 0" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={500}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: ${item.price} c/u
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Subtotal: <strong>${item.price * item.quantity}</strong>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body1" sx={{ mx: 1 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <IconButton
                    onClick={() => removeFromCart(item._id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Métodos de pago */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          color="primary"
          gutterBottom
        >
          💳 Medios de pago
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {paymentMethods.map((method) => (
            <Box
              key={method.name}
              sx={{
                width: 50,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={method.icon}
                alt={method.name}
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Total y botón */}
      <Box
        sx={{
          mt: 5,
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          p: 4,
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Total: ${getTotal()}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleBuyClick}
          sx={{
            mt: 2,
            px: 5,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          Finalizar Compra
        </Button>
      </Box>
    </Container>
  );
};

export default Checkout;
