import { AxiosResponse, default as http } from "axios";
import axios from "../../config/api.config";
import { LoginPayload } from "./auth.interface";
import mem from "mem";
import { ResponseAPI } from "../../models/response-api.model";
import { LoginModel, User } from "../../models/login.model";

export const loginService = async (
  payload: LoginPayload
): Promise<AxiosResponse<ResponseAPI<LoginModel>, any>> => {
  return await axios.post("/api/v1/authentication/login", payload);
};

export const refreshTokenService = async () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  try {
    const response = await http.get(
      "http://103.175.221.10:3000/api/v1/authentication/refresh-token",
      {
        headers: {
          Authorization: `Bearer ${auth.refresh_token}`,
        },
      }
    );

    const { access_token, refresh_token } = response.data.data;

    if (!access_token || !refresh_token) {
      localStorage.removeItem("auth");
    }

    localStorage.setItem(
      "auth",
      JSON.stringify({
        access_token,
        refresh_token,
      })
    );

    return access_token;
  } catch (error) {
    window.location.href = "/auth/sign-in";
    localStorage.removeItem("auth");
  }
};

export const memoizedRefreshToken = mem(refreshTokenService, {
  maxAge: 10000,
});

export const logoutService = async () => {
  const response = await axios.get("/api/v1/authentication/logout");

  localStorage.removeItem("auth");

  return response.data;
};

export const profileService = async () => {
  const response: AxiosResponse<ResponseAPI<User>, any> = await axios.get(
    "/api/v1/profile"
  );

  return response.data.data;
};
