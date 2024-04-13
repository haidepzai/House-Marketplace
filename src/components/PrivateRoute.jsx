import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

// Wie AuthGuard
const PrivateRoute = () => {
  const { loggedIn, checkingStatus, userId } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? (
    <Outlet context={{ userId }} />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default PrivateRoute;
