import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../providers/Auth";

export const PublicRoute = () => {
  const { checkToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (checkToken()) {
      navigate("/admin", { state: { from: location } });
    }
  }, [checkToken, navigate, location]);

  return <Outlet />;
};
