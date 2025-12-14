import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getMe } from '../../store/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if we have a token but no user data
    if (token && !user) {
      dispatch(getMe());
    }
  }, [token, user, dispatch]);

  // Check if user is admin
  if (isAuthenticated && user && user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

