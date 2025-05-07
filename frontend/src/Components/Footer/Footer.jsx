import React, { useEffect } from 'react';
import styles from './Footer.module.scss';
import logo from '../../assets/image/G-Critic.svg'; // Đảm bảo đường dẫn đúng
import waveImg from '../../assets/image/svg.png'; // Đảm bảo đường dẫn đúng

const Footer = () => {
  useEffect(() => {
    const navbar = document.querySelector('.navbar');

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.waves}>
        <div className={styles.wave} id={styles.wave1} style={{ backgroundImage: `url(${waveImg})` }}></div>
        <div className={styles.wave} id={styles.wave2} style={{ backgroundImage: `url(${waveImg})` }}></div>
        <div className={styles.wave} id={styles.wave3} style={{ backgroundImage: `url(${waveImg})` }}></div>
        <div className={styles.wave} id={styles.wave4} style={{ backgroundImage: `url(${waveImg})` }}></div>
      </div>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <img src={logo} alt="G-Critic Logo" />
        </div>

        <div className={styles.footerLatestGames}>
          <h2>CÔNG THỨC MỚI NHẤT</h2>
          <ul>
            <li>shsfhdhT</li>
           
          </ul>
        </div>

        <div className={styles.footerCategories}>
          <h2>DANH MỤC CÔNG THỨC</h2>
          <ul>
            <li>dfjhdxhdfh</li>
          
          </ul>
        </div>

        <div className={styles.footerTags}>
          <h2>TAG</h2>
          <ul>
            <li><a href="#">dfhdfhszfh</a> (1)</li>
            
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
