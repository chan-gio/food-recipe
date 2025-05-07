// HomePage.jsx
import React, { useRef } from "react";
import styles from "./HomePage.module.scss";
import { Card } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const recipes = [
  {
    title: "Medium Rare Steak",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxqfyojxMBijikrAeZvgsCyIDMD-rCktUBPw&s",
  },
  {
    title: "Barbecued Baby Back Ribs",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxqfyojxMBijikrAeZvgsCyIDMD-rCktUBPw&s",
    description:
      "No one will be able to resist these sticky BBQ ribs. Glazed with easy, homemade barbecue sauce, they are a guaranteed crowd pleaser!",
  },
  {
    title: "Grilled Beef & Sausages",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxqfyojxMBijikrAeZvgsCyIDMD-rCktUBPw&s",
  },
];

export default function HomePage() {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // ✅ Auto scroll
    autoplaySpeed: 5000, // ✅ Mỗi 5 giây
    arrows: false, // ❌ Tắt mũi tên mặc định
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.navbar}>
        <div className={styles.logo}>my.recipes</div>
      </div>

      <div className={styles.categoryMenu}>
        <span>FISH & SEA FOOD</span>
        <span className={styles.active}>BARBECUE</span>
        <span>PASTA</span>
        <span>SUSHI & MORE</span>
      </div>

      <div className={styles.carouselWrapper}>
        <LeftOutlined
          className={styles.arrow}
          onClick={() => sliderRef.current?.slickPrev()}
        />
        <Slider {...settings} ref={sliderRef} className={styles.carousel}>
          {recipes.map((item, idx) => (
            <div key={idx}>
              <Card
                hoverable
                cover={<img alt={item.title} src={item.img} />}
                className={styles.recipeCard}
              >
                <Card.Meta
                  title={item.title}
                  description={item.description || ""}
                />
              </Card>
            </div>
          ))}
        </Slider>
        <RightOutlined
          className={styles.arrow}
          onClick={() => sliderRef.current?.slickNext()}
        />
      </div>

      <div className={styles.footer}>
        <span>Chili Peppers</span>
        <span>save up</span>
        <span>Info</span>
      </div>
    </div>
  );
}
