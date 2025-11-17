import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ถ้าใช้ cookie หรือ auth
});

export default api;