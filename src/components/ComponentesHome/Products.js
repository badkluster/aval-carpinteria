import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Products.css";
import ProductCard from "../ProductCard";

export default function FeaturedProducts({ destacados }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="featured-products" id="destacados">
      <h2 className="section-title">Productos destacados</h2>
      <Slider {...settings}>
        {destacados?.map((product) => (
          <div key={product._id} className="slide-wrapper">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </section>
  );
}
