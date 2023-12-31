import { default as http } from "axios";
import { memoizedRefreshToken } from "../services/Auth/auth.service";

const axios = http.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(
  async (config) => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (auth?.access_token) {
      config.headers.Authorization = `Bearer ${auth.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error.response.data.message);
  }
);

axios.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const config = error?.config;
    if (error.response.status === 401 && !config._retry) {
      config._retry = true;

      const access_token = await memoizedRefreshToken();
      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
      return axios(config);
    }

    return Promise.reject(error.response.data.message);
  }
);

export default axios;
