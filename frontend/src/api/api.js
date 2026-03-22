import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default API;

/* ---------- BLOOD BANKS ---------- */

export const getBloodBanks = async (params = {}) => {
  const res = await API.get("/api/bloodbanks", {
    params, // ✅ sends state, district, search
  });

  return res.data;
};
