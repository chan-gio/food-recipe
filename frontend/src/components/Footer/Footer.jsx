import React, { useEffect } from "react";
import styles from "./Footer.module.scss";
import logo from "../../assets/image/logo.svg"; // Ensure the path is correct
import waveImg from "../../assets/image/svg.png"; // Ensure the path is correct
import {
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa"; // For social media icons

const Footer = () => {
  useEffect(() => {
    const navbar = document.querySelector(".navbar");

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.waves}>
        <div
          className={styles.wave}
          id={styles.wave1}
          style={{ backgroundImage: `url(${waveImg})` }}
        ></div>
        <div
          className={styles.wave}
          id={styles.wave2}
          style={{ backgroundImage: `url(${waveImg})` }}
        ></div>
        <div
          className={styles.wave}
          id={styles.wave3}
          style={{ backgroundImage: `url(${waveImg})` }}
        ></div>
        <div
          className={styles.wave}
          id={styles.wave4}
          style={{ backgroundImage: `url(${waveImg})` }}
        ></div>
      </div>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <img src={logo} alt="Logo" />
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Search Recipes..." />
          </div>
          <div className={styles.socialIcons}>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaPinterest />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
          </div>
        </div>
        <div className={styles.divider}></div>

        <div className={styles.subscribeSection}>
          <div className={styles.subscribeText}>
            <h2>Never miss a recipe!</h2>
            <p>Subscribe to my newsletter and receive 3 FREE ebooks!</p>
          </div>
          <button className={styles.subscribeButton}>
            SUBSCRIBE <span>➔</span>
          </button>
        </div>
        <div className={styles.divider}></div>

        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h4>RECIPES</h4>
            <ul>
              <li>
                <a href="#">All Recipes</a>
              </li>
              <li>
                <a href="#">By Category</a>
              </li>
              <li>
                <a href="#">Collections</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>ABOUT</h4>
            <ul>
              <li>
                <a href="#">About Nagi</a>
              </li>
              <li>
                <a href="#">About Dozer</a>
              </li>
              <li>
                <a href="#">RecipeTin Meals</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>RELATED</h4>
            <ul>
              <li>
                <a href="#">RecipeTin Japan</a>
              </li>
            </ul>
          </div>
          <div className={styles.linkColumn}>
            <h4>HELP</h4>
            <ul>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Image Use Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
