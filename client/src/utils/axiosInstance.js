// src/utils/axiosInstance.js
import axios from "axios";
import {store} from "../../redux/store.js";
import { logout } from "../../redux/userSlice.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // your backend base URL
  withCredentials: true, // crucial: allows cookies (access & refresh tokens)
});

// Token refresh logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await axiosInstance.post("/api/auth/refresh-token");

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // 🔴 If refresh fails, force logout
        store.dispatch(logout());

        // Optional: Clear cookies manually (since you're using httpOnly, this is just visual cleanup)
        document.cookie = "access_token=; Max-Age=0";
        document.cookie = "refresh_token=; Max-Age=0";

        // Redirect to login
        window.location.href = "/signin";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
