import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes("/refresh-token");

    if (status !== 401 || originalRequest?._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await api.post("/refresh-token");
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
