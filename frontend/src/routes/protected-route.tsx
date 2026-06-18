import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectAccessToken } from "@/features/auth/authSlice";

export function ProtectedRoute() {
  const accessToken = useAppSelector(selectAccessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

