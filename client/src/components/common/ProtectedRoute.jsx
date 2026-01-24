import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';

// Regular protected route (any authenticated user)
const ProtectedRoute = ({ children }) => {
  const userInfo = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Guest route (only for non-authenticated users)
const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

// Admin-only route
const AdminRoute = ({ children }) => {
  const userInfo = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userInfo?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Verified email route
const VerifiedRoute = ({ children }) => {
  const userInfo = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userInfo?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;
export { GuestRoute, AdminRoute, VerifiedRoute };