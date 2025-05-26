import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Thêm useLocation để lấy đường dẫn hiện tại

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const storedUserId = localStorage.getItem("user_id");
        const storedRole = localStorage.getItem("role");
        if (token && storedUserId) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
          setRole(storedRole);

          // Kiểm tra nếu người dùng không có role admin và đang ở route /admin
          if (
            storedRole !== "admin" &&
            location.pathname.startsWith("/admin")
          ) {
            navigate("/", { replace: true });
          }
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setRole(null);
          // Nếu không đăng nhập và cố vào /admin, chuyển về trang chính
          if (location.pathname.startsWith("/admin")) {
            navigate("/", { replace: true });
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserId(null);
        setRole(null);
        if (location.pathname.startsWith("/admin")) {
          navigate("/", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]); // Thêm location.pathname vào dependency để kiểm tra mỗi khi route thay đổi

  const login = (token, userId, userRole) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_id", userId);
    localStorage.setItem("role", userRole);
    setIsAuthenticated(true);
    setUserId(userId);
    setRole(userRole);
    setIsLoading(false);
    // Kiểm tra sau khi đăng nhập, nếu không phải admin mà vào /admin thì chuyển hướng
    if (userRole !== "admin" && location.pathname.startsWith("/admin")) {
      navigate("/", { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserId(null);
    setRole(null);
    setIsLoading(false);
    navigate("/login", { replace: true });
  };

  return { isAuthenticated, userId, role, isLoading, login, logout };
};

export default useAuth;
