import React, { useEffect, useRef } from "react"; // Add useRef
import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.scss";
import logo from "../../assets/image/logo.svg";
import waveImg from "../../assets/image/svg.png";
import {
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import { recipeService } from "../../services/recipeService";

const Footer = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null); // Create a ref for the search input

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

  // Handle search input
  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      const value = event.target.value.trim();
      if (value) {
        try {
          // Call the searchRecipesByName service
          await recipeService.searchRecipesByName(value);
          // Navigate to allrecipes with search query
          navigate(`/allrecipes?search=${encodeURIComponent(value)}`);
        } catch (error) {
          console.error("Search error:", error.message);
          // Navigate even if search fails
          navigate(`/allrecipes?search=${encodeURIComponent(value)}`);
        }
      } else {
        // Navigate to allrecipes without query if search is empty
        navigate("/allrecipes");
      }
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Clear the search input
      if (searchInputRef.current) {
        searchInputRef.current.value = "";
      }
    }
  };

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
            <input
              type="text"
              placeholder="Search Recipes..."
              onKeyDown={handleSearch}
              ref={searchInputRef} // Attach the ref to the input
            />
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
