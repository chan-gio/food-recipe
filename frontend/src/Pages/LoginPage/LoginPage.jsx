import styles from "./LoginPage.module.scss";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  const handleLogin = () => {
    console.log("Logging in with", email, password);
  };

  const handleRegister = () => {
    console.log("Registering with", email, password, confirmPassword);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isRegistering ? "signup" : "login"}
          className={styles.rightPanel}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <h1 className={styles.logo}>allrecipes</h1>
          <h2 className={styles.title}>
            {isRegistering ? "Sign up" : "Log in"}
          </h2>

          <motion.input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            whileFocus={{ scale: 1.05 }}
          />

          {isRegistering && (
            <motion.input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              whileFocus={{ scale: 1.05 }}
            />
          )}

          <motion.button
            className={styles.loginBtn}
            onClick={isRegistering ? handleRegister : handleLogin}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRegistering ? "Sign up" : "Log in"}
          </motion.button>

          {!isRegistering && (
            <>
              <motion.button
                className={styles.facebookBtn}
                whileHover={{ scale: 1.1 }}
              >
                <FaFacebook /> Log in with Facebook
              </motion.button>
              <motion.button
                className={styles.googleBtn}
                whileHover={{ scale: 1.1 }}
              >
                <FaGoogle /> Log in with Google
              </motion.button>
            </>
          )}

          <motion.p className={styles.signup} whileHover={{ scale: 1.05 }}>
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}
            <motion.a
              href="#"
              onClick={handleToggleForm}
              whileHover={{ scale: 1.1, color: "#ff6600" }}
              transition={{ duration: 0.2 }}
            >
              {isRegistering ? "Log in" : "Join now"}
            </motion.a>
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
