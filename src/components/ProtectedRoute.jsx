import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../redux/actions";
import { hasPermission } from "../utils";

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.authenticatedUser);

  useEffect(() => {
    // Verificar autenticación
    if (!authenticatedUser) {
      navigate("/");
      return;
    }

    // Verificar permisos
    if (!hasPermission(authenticatedUser.user_role, requiredRoles)) {
      alert("No tienes permisos para acceder a esta sección.");
      dispatch(LogoutUser());
      navigate("/");
      return;
    }

    // Verificar expiración de sesión
    const now = Math.floor(Date.now() / 1000);
    if (authenticatedUser.expires_at && now > authenticatedUser.expires_at) {
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      dispatch(LogoutUser());
      navigate("/");
    }
  }, [authenticatedUser, requiredRoles, navigate, dispatch]);

  if (!authenticatedUser || !hasPermission(authenticatedUser.user_role, requiredRoles)) {
    return null;
  }

  return children;
}
