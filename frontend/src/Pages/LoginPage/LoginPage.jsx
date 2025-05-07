import styles from "./LoginPage.module.scss";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loginService } from "../../services/loginService";
import { userService } from "../../services/userService";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [signinAccount, setSigninAccount] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering);
    setSigninAccount("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginService.login({ signin_account: signinAccount, password });
      window.location.href = "/"; // Redirect to protected page
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await userService.register({
        signin_account: signinAccount,
        password,
        email,
        full_name: "", // Optional field, can add input if needed
        role: "user",
      });
      // Auto-login after registration
      await loginService.login({ signin_account: signinAccount, password });
      window.location.href = "/"; // Redirect to protected page
    } catch (err) {
      setError(err.message);
    }
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
            placeholder="Signin Account"
            value={signinAccount}
            onChange={(e) => setSigninAccount(e.target.value)}
            className={styles.input}
            whileFocus={{ scale: 1.05 }}
          />
          {isRegistering && (
            <motion.input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              whileFocus={{ scale: 1.05 }}
            />
          )}
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

          {error && <p style={{ color: 'red' }}>{error}</p>}

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