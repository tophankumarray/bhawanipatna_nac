import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminLogout } from "../api/admin/auth.api";
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call API logout if user is admin
      if (user?.role === "admin") {
        await adminLogout();
      }
      
      toast.success("Logged out successfully");
      logout();

      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      toast.success("Logged out successfully");
      logout();
      setTimeout(() => {
        navigate("/");
      }, 300);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
