import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../providers/Auth";

export const PrivateRoute = () => {
  const { checkToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkToken()) {
      navigate("/auth/sign-in", { state: { from: location } });
    }
  }, [checkToken, navigate, location]);

  return <Outlet />;
};
