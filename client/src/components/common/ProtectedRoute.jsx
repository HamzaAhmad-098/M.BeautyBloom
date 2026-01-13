import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsVerified, selectIsAdmin } from '../../store/slices/authSlice';

const ProtectedRoute = ({ children, requireVerified = false, adminOnly = false }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isVerified = useSelector(selectIsVerified);
  const isAdmin = useSelector(selectIsAdmin);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // Redirect to verify email page if verification required but not verified
  if (requireVerified && !isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Redirect to home if admin access required but not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Guest route (redirect if already logged in)
export const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Verified route (requires email verification)
export const VerifiedRoute = ({ children }) => {
  return <ProtectedRoute requireVerified>{children}</ProtectedRoute>;
};

// Admin route (requires admin privileges)
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute adminOnly>{children}</ProtectedRoute>;
};

export default ProtectedRoute;