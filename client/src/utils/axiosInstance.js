// src/utils/axiosInstance.js
import axios from "axios";
import { store } from "../../redux/store.js";
import { logout } from "../../redux/userSlice.js";

let isRefreshing = false;
let failedQueue = [];

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Ignore refresh token requests themselves
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      isRefreshing = true;

      try {
        await axiosInstance.post("/api/auth/refresh-token");

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Just dispatch logout — don't redirect here!
        store.dispatch(logout());

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
