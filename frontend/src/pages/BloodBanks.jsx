import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation } from "lucide-react";
import { getBloodBanks } from "@/api/api";

const bloodTypes = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodBanks = () => {
  const [location, setLocation] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH FROM BACKEND ---------- */
  useEffect(() => {
    loadBanks();
  }, [stateFilter, districtFilter, location]);

  const loadBanks = async () => {
    setLoading(true);

    try {
      const res = await getBloodBanks({
        state: stateFilter || undefined,
        district: districtFilter || undefined,
        search: location || undefined,
        limit: 5000, // load all records (remove 50 limit)
      });

      // backend returns { total, page, data }
      setBloodBanks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setBloodBanks([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- BLOOD GROUP FILTER (FRONTEND) ---------- */
  const filteredBanks = bloodBanks.filter((bank) => {
    if (selectedType === "All") return true;

    if (!bank.blood_group) return false;

    return bank.blood_group
      .toUpperCase()
      .includes(selectedType.toUpperCase());
  });

  /* ---------- MAP DIRECTIONS ---------- */
  const openDirections = (bank) => {
    if (bank.latitude && bank.longitude) {
      window.open(
        `https://www.google.com/maps?q=${bank.latitude},${bank.longitude}`,
        "_blank"
      );
      return;
    }

    if (bank.address) {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(
          bank.address
        )}`,
        "_blank"
      );
      return;
    }

    alert("Location not available");
  };

  /* ---------- CALL ---------- */
  const callBank = (phone) => {
    if (!phone || phone === "NA") {
      alert("Contact number not available");
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Blood Banks
        </h1>

        <p className="text-muted-foreground mb-6">
          Search blood availability & nearby blood banks
        </p>

        {/* ---------- SEARCH + FILTERS ---------- */}
        <div className="bg-card border rounded-2xl p-4 mb-6 space-y-3">

          {/* Search */}
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search hospital or address..."
            className="w-full p-3 border rounded-xl"
          />

          {/* State + District */}
          <div className="grid md:grid-cols-2 gap-3">
            <input
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              placeholder="Filter by state"
              className="p-3 border rounded-xl"
            />

            <input
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              placeholder="Filter by district / city"
              className="p-3 border rounded-xl"
            />
          </div>

          {/* Blood Type Filter */}
          <div className="flex flex-wrap gap-2">
            {bloodTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === type
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- LOADING ---------- */}
        {loading && <p>Loading blood banks...</p>}

        {/* ---------- RESULTS ---------- */}
        {!loading && (
          <>
            <p className="mb-4">
              Found <b>{filteredBanks.length}</b> blood banks
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredBanks.map((bank) => (
                <div key={bank.id} className="border rounded-2xl p-6 bg-card">

                  <h3 className="text-lg font-bold mb-3">
                    {bank.h_name}
                  </h3>

                  <div className="space-y-2 text-sm mb-4">

                    <div className="flex gap-2">
                      <MapPin size={16} />
                      {bank.address || "N/A"}
                    </div>

                    <div className="flex gap-2">
                      <Phone size={16} />
                      {bank.contact || "N/A"}
                    </div>

                    <div>
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded">
                        {bank.blood_group || "NA"}
                      </span>
                    </div>

                  </div>

                  <div className="flex gap-2">

                    <Button
                      className="flex-1"
                      onClick={() => callBank(bank.contact)}
                    >
                      <Phone size={16} /> Call
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => openDirections(bank)}
                    >
                      <Navigation size={16} /> Directions
                    </Button>

                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BloodBanks;
