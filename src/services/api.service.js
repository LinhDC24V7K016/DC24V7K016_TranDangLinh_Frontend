import axios from "axios";

const commonConfig = {
  headers: {
    Accept: "application/json",
  },
};

export default (baseURL) => {
  const api = axios.create({
    baseURL,
    ...commonConfig,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};
