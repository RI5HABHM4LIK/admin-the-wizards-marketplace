import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api", // your backend
  withCredentials: true, // include cookies automatically
});

export default api;
