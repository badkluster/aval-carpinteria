import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Chip,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  incrementarInteraccion,
  obtenerProductoporID,
  obtenerProductosPorCategoria,
} from "../../api/products.service";
import { WHATSAPP_NUMBER } from "../../utils";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // Se obtiene el id desde la URL
  const similarContainerRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Función para obtener el producto desde el API
  const obtenerProductoPorId = async (id) => {
    try {
      const result = await obtenerProductoporID(id);
      if (result?.data) {
        setProduct(result.data);
        if (result?.data?.category?._id) {
          const productosByCategory = await obtenerProductosPorCategoria(
            result.data.category._id
          );

          if (productosByCategory.data.length > 0) {
            setSimilarProducts(productosByCategory.data);
          }
        }
      }
    } catch (error) {
      console.log("Error al obtener producto", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      obtenerProductoPorId(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  // Si está cargando...
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Cargando producto...</Typography>
      </Container>
    );
  }

  // Si no hay producto o no se proporcionó un id, mostramos "Producto no encontrado"
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Producto no encontrado
        </Typography>
        <Button variant="contained" onClick={() => navigate("/catalogo")}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  // Cálculo del descuento (si discount es mayor a 0)
  const discount = product.discount;
  const listPrice = product.price;
  const discountedPrice = listPrice - (listPrice * discount) / 100;

  // Información de las medidas (usando measurement)
  const sizeInfo = `${product.measurement?.ancho}x${product.measurement?.largo}x${product.measurement?.alto} cm`;

  // Productos similares (en un ejemplo real, se podrían obtener desde el API)
  //   const similarProducts = [
  //     {
  //       name: "Sommier King Plus",
  //       price: 1599000,
  //       image:
  //         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1Xd7PPf5VNYc1O9uN3897U4rvlPflehYBsmiCKvwD4N3vSaFdCHHGXSDmp5XuUx8MRs&usqp=CAU",
  //     },
  //     {
  //       name: "Colchón Sealy Confort",
  //       price: 1220000,
  //       image:
  //         "https://simmonsarg.vtexassets.com/arquivos/ids/162672-800-auto?v=638616603889970000&width=800&height=auto&aspect=true",
  //     },
  //     {
  //       name: "Sommier y Colchón Relax",
  //       price: 1999000,
  //       image:
  //         "https://laespumeria.vtexassets.com/arquivos/ids/165898-800-auto?v=638440382669430000&width=800&height=auto&aspect=true",
  //     },
  //     {
  //       name: "Colchón Spring Air Balance",
  //       price: 980000,
  //       image:
  //         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHspBAoqav1u6P19-_x_5JBQ8lLQnosnlpMw&s",
  //     },
  //     {
  //       name: "Colchón Sealy Confort",
  //       price: 1220000,
  //       image: "https://sommiercenter.com/media/catalog/product/example2.jpg",
  //     },
  //     {
  //       name: "Sommier y Colchón Relax",
  //       price: 1999000,
  //       image: "https://sommiercenter.com/media/catalog/product/example3.jpg",
  //     },
  //     {
  //       name: "Colchón Spring Air Balance",
  //       price: 980000,
  //       image: "https://sommiercenter.com/media/catalog/product/example4.jpg",
  //     },
  //   ];

  const scrollLeft = () => {
    if (similarContainerRef.current) {
      similarContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (similarContainerRef.current) {
      similarContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Funciones para navegar al catálogo filtrado por categoría o marca
  const handleCategoryClick = () => {
    navigate(`/catalogo?categoryId=${product.category._id}`, {
      state: { categoryId: product.category._id },
    });
  };

  const handleBrandClick = () => {
    navigate(`/catalogo?brandId=${product.brand?._id}`, {
      state: { brandId: product.brand?._id },
    });
  };

  //   const handleBuy = () => {
  //     const productDetails = `Producto: ${product.name}
  // SKU: ${product.sku}
  // Medidas: ${sizeInfo}
  // Precio: ${
  //       discount > 0
  //         ? discountedPrice.toLocaleString()
  //         : listPrice.toLocaleString()
  //     }
  // Precio en efectivo: $${product.cashPrice.toLocaleString()}
  // Cantidad: ${quantity}`;
  //     alert(`Información del producto:\n${productDetails}`);
  //   };

  const handleBuyClick = () => {
    incrementarInteraccion(product._id);

    const precioBase = product?.price || 0;
    const descuento = product?.discount || 0;
    const precioFinal = (precioBase - (precioBase * descuento) / 100).toFixed(
      2
    );
    const productUrl = `https://sommierhome.com.ar/producto/${product._id}`;
    const mensaje = `Hola! Quiero comprar\n\n*${product.name}*\n*Precio:* $${precioFinal}\n*URL:* ${productUrl}\n\nGracias!`;
    const encodedMessage = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Dispara la conversión en Google Ads antes de abrir WhatsApp

    // Esperar 500 ms para registrar la conversión antes de abrir WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }, 500);
  };

  const navigateProductDetail = (id) => {
    navigate(`/producto/${id}`);
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Breadcrumb superior: solo categoría y marca */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          backgroundColor: "grey.100",
          borderRadius: 1,
          textAlign: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ cursor: "pointer" }}
            onClick={handleCategoryClick}
          >
            Categoría: {product.category?.name}
          </Typography>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Sección de Imágenes del producto */}
        <Grid item xs={12} md={6}>
          <Carousel
            showArrows
            infiniteLoop
            selectedItem={selectedImage}
            showThumbs={false}
          >
            {product.images?.map((img, index) => (
              <Card key={index}>
                <CardMedia
                  component="img"
                  image={img}
                  alt={`Imagen ${index + 1}`}
                />
              </Card>
            ))}
          </Carousel>
          <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
            {product.images?.map((img, index) => (
              <Box
                key={index}
                onClick={() => setSelectedImage(index)}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  overflow: "hidden",
                  border:
                    selectedImage === index
                      ? "2px solid #1976d2"
                      : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Sección de Detalles del producto */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            {/* Labels */}
            <Stack direction="row" spacing={1}>
              {product.labels?.map((label, index) => (
                <Chip key={index} label={label} color="primary" />
              ))}
            </Stack>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>
            {/* Features en línea */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {product.features?.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
            {/* Medidas */}

            {/* Sección de precio */}
            <Stack direction="row" alignItems="center" spacing={2}>
              {discount > 0 ? (
                <>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    ${discountedPrice.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ${listPrice.toLocaleString()}
                  </Typography>
                  <Chip label={`-${discount}%`} color="success" />
                </>
              ) : (
                <Typography variant="h4" color="primary" fontWeight="bold">
                  ${listPrice.toLocaleString()}
                </Typography>
              )}
            </Stack>
            {/* Precio en efectivo */}
            <Typography variant="body1" color="text.secondary">
              Precio en efectivo: ${product.cashPrice.toLocaleString()}
            </Typography>
            {/* Cuotas sin interés */}
            {product.installments && product.installments?.length > 0 && (
              <Typography
                variant="body1"
                color="text.primary"
                fontWeight="bold"
              >
                {product.installments[product.installments?.length - 1].qty}{" "}
                cuotas sin interés de{" "}
                {product.installments[
                  product.installments.length - 1
                ].amount.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            )}
            {/* Chip de Envío Gratis */}
            {product.freeShipping && (
              <Chip
                label="Envío Gratis"
                color="success"
                size="small"
                sx={{ alignSelf: "flex-start" }}
              />
            )}

            {/* Stock (si existe en el producto, de lo contrario 0) */}
            <Typography variant="body2" color="text.secondary">
              Stock: {product?.stock || 0}
            </Typography>
            {/* Cantidad */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setQuantity(Math.max(quantity - 1, 1))}
              >
                -
              </Button>
              <Typography variant="body1">{quantity}</Typography>
              <Button
                variant="outlined"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              className="btn-contact"
              onClick={handleBuyClick}
              disabled={product?.stock === 0}
            >
              Comprar
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Sección de Descripción */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Descripción
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {product.description}
        </Typography>
      </Box>

      {/* Sección de Productos Similares con flechas de navegación */}
      <Box sx={{ mt: 6, position: "relative" }}>
        <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
          Productos Similares
        </Typography>
        {/* Botón Izquierdo */}
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255,255,255,0.7)",
            zIndex: 1,
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        {/* Contenedor de productos similares */}
        <Box
          ref={similarContainerRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            py: 1,
            scrollSnapType: "x mandatory",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {similarProducts.map((item, index) => (
            <Card
              key={index}
              sx={{
                cursor: "pointer !important",
                width: 250,
                flex: "0 0 auto",
                p: 2,
                textAlign: "center",
                scrollSnapAlign: "start",
              }}
              onClick={() => {
                navigateProductDetail(item._id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{
                  height: 200,
                  width: 200,
                  objectFit: "cover",
                  mb: 1,
                  cursor: "pointer",
                }}
              />
              <Typography variant="subtitle1" mt={1}>
                {item.name}
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ${item.price.toLocaleString()}
              </Typography>
            </Card>
          ))}
        </Box>
        {/* Botón Derecho */}
        <IconButton
          onClick={scrollRight}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255,255,255,0.7)",
            zIndex: 1,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Container>
  );
}
