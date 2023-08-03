import React, { createContext } from "react";
import { User } from "../../models/login.model";

export interface TokenData {
  access_token?: string;
  refresh_token?: string;
}

interface IAuthContext {
  user: User;
  setToken: (token: TokenData) => void;
  getProfileUser: () => Promise<void>;
  checkToken: () => boolean;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export default AuthContext;
