import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");

    logout();

    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
