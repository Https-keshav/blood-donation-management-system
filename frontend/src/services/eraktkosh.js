const BASE = "https://eraktkosh.in/BLDAHIMS";

/* ---------------- BLOOD BANKS ---------------- */
export const fetchBloodBanks = async (stateId, districtId) => {
  const res = await fetch(
    `${BASE}/bloodbank/nearbyBBRed.cnt?stateId=${stateId}&districtId=${districtId}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return res.json();
};

/* ---------------- CAMPS ---------------- */
export const fetchCamps = async (stateId, districtId) => {
  const res = await fetch(
    `${BASE}/camp/campList.cnt?stateId=${stateId}&districtId=${districtId}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return res.json();
};

/* ---------------- URGENT STOCK ---------------- */
export const fetchBloodStock = async () => {
  const res = await fetch(
    `${BASE}/bloodstock/stockAvailability.cnt`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return res.json();
};
