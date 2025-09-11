// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const sessionToken = sessionStorage.getItem("user_id");
  
  if (!sessionToken) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;