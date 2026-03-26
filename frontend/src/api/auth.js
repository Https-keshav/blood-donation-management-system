// import API from "./api";

// export const registerUser = (data) => {
//   return API.post("/register", data);
// };

// export const loginUser = (data) => {
//   return API.post("/login", data);
// };

import API from "./api";

/* ✅ FIX: ADD /api PREFIX */

export const registerUser = (data) => {
  return API.post("/api/register", data);
};

export const loginUser = (data) => {
  return API.post("/api/login", data);
};