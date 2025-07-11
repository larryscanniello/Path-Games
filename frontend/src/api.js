import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";

/*const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});*/

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    const VITE_API_URL = import.meta.env.VITE_API_URL
    if(error.request.responseURL==VITE_API_URL + "token/refresh/"){
      return
    }
    const originalRequest = error.config;
    console.log('errURL',error.request.responseURL)
    if (error.response && error.response.status === 401 && !originalRequest._retry && error.request.responseURL!==VITE_API_URL+"token/") {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      try {
        const res = await api.post("token/refresh/", { refresh: refreshToken });
        const newAccessToken = res.data.access;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // retry the original request
      } catch (refreshError) {
        // Refresh failed, force logout or redirect
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login"; // or however you redirect to login
        return Promise.reject(refreshError);
      }
    }
  }
)

export default api;