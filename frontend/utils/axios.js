import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Your backend URL
  withCredentials: true, // Include cookies if your backend uses them
});

export default api;