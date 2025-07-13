import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

//Attach access token to request header before request is made
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//This is triggered if request fails
//If access token has expired, refresh and get a new one and try again
//If refresh token is expired, redirect to login
api.interceptors.response.use(
  response => response,
  async error => {
    const VITE_API_URL = import.meta.env.VITE_API_URL
    //Needed so refresh code doesn't trigger infinitely, since later api.post to token/refresh/ will trigger interceptors
    if(error.request.responseURL==VITE_API_URL + "token/refresh/"){
      return
    }
    const originalRequest = error.config;
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
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
  }
)

export default api;