import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { hasAccess } from "@/lib/roleAccess";

interface RoleRouteProps {
  element: JSX.Element;
  path: string;
}

const RoleRoute = ({ element, path }: RoleRouteProps) => {
  const { authState } = useAuth();

  if (!authState || !hasAccess(authState.roles, path)) {
    // Redirect to dashboard if user doesn't have access to this route
    return <Navigate to="/" replace />;
  }

  return element;
};

export default RoleRoute;
