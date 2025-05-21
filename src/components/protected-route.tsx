import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    // Optionally, you can show a loading spinner or some placeholder content while loading
    return <div>Loading...</div>;
  }

  const token = localStorage.getItem("accessToken");

  console.log("ProtectedRoute user", user);
  

  if (!user || !token) {
    // If the user is not logged in or the token is not present, redirect to the login page
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet/>;
};

export default ProtectedRoute;