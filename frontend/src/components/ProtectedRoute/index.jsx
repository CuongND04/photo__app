import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return children;
  }
  return <Navigate to="/login-register" />;
}

export default ProtectedRoute;
