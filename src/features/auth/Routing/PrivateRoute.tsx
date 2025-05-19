import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AuthStates } from "@/utils/enums";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { authState } = useSelector((state: RootState) => state.auth);

  return authState !== AuthStates.AUTHENTICATED ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
