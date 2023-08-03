import { useEffect, useState } from "react";
import { User } from "../../models/login.model";
import Context, { TokenData } from "./index";
import { profileService } from "../../services/Auth/auth.service";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const setToken = (token: TokenData) => {
    localStorage.setItem("auth", JSON.stringify(token));
  };

  const checkToken = (): boolean => {
    return !!localStorage.getItem("auth");
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    navigate("/auth/sign-in");
  };

  const getProfileUser = async () => {
    const response = await profileService();
    if (response) {
      setUser(response);
    }
  };

  useEffect(() => {
    if (checkToken()) {
      getProfileUser();
    }
  }, []);

  return (
    <Context.Provider
      value={{ setToken, logout, checkToken, user, getProfileUser }}
    >
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;
