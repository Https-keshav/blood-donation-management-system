import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
console.log("API BASE:", API.defaults.baseURL);

/* ✅ AUTO TOKEN ATTACH */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;

/* BLOOD BANKS */
export const getBloodBanks = async (params = {}) => {
  const res = await API.get("/api/bloodbanks", { params });
  return res.data;
};