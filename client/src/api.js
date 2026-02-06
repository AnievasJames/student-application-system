import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // change ONLY if backend uses 4000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
