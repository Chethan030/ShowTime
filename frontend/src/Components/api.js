import axios from "axios";

const api = axios.create({
  baseURL: "http://82.29.164.219/api/",
});

// 👉 Access the token stored under 'accessToken'
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); // ✅ your variable name
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Auto-refresh logic (optional if using refresh tokens)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;

      try {
        // use axios (not api) to avoid interceptor recursion
        const refreshResponse = await axios.post(
          "http://82.29.164.219/api/token/refresh/",
          {
            refresh: localStorage.getItem("refresh_token"),
          }
        );

        const newAccessToken = refreshResponse.data.access;

        // Update tokens
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // retry
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
