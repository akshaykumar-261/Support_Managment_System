import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8088/api", // Base URL ko simple rakhein bina /api ke, routes matching ke liye
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      // Backend authorization requirements ke hisab se dono headers set kar diye hain
      config.headers["token"] = `Bearer ${token}`;
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("Axios Interceptor: Access token not found in localStorage!");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;