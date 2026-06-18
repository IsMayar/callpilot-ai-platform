import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectAccessToken } from "@/features/auth/authSlice";

export function PublicOnlyRoute() {
  const accessToken = useAppSelector(selectAccessToken);

  if (accessToken) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}
