import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import API from "@/api/api";

const Camps = () => {
  const [filter, setFilter] = useState("all");
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationCounts, setRegistrationCounts] = useState({});

  /* ================= FETCH CAMPS ================= */
  useEffect(() => {
    loadCamps();
  }, []);

  const loadCamps = async () => {
    try {
      const res = await API.get("/api/camps");
      const campList = Array.isArray(res.data) ? res.data : [];
      setCamps(campList);

      // fetch registration counts
      campList.forEach(async (camp) => {
        const countRes = await API.get(`/api/camps/${camp.id}/registrations`);
        setRegistrationCounts((prev) => ({
          ...prev,
          [camp.id]: countRes.data.count,
        }));
      });
    } catch (err) {
      console.error("Camps fetch error:", err);
      setCamps([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER CAMP ================= */
  const registerForCamp = async (campId) => {
    try {
      await API.post("/api/camps/register", { campId });
      alert("Registered successfully!");
      loadCamps(); // refresh count
    } catch {
      alert("Already registered or login required");
    }
  };

  /* ================= HELPERS ================= */
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not available";

  const openDirections = (camp) => {
    if (!camp.location) return alert("Location not available");

    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(
        camp.location
      )}`,
      "_blank"
    );
  };

  /* ================= FILTER ================= */
  const filteredCamps = camps.filter((camp) => {
    if (filter === "all") return true;

    const campDate = new Date(camp.camp_date);
    const today = new Date();

    if (filter === "this-week") {
      const weekEnd = new Date();
      weekEnd.setDate(today.getDate() + 7);
      return campDate >= today && campDate <= weekEnd;
    }

    if (filter === "this-month") {
      return (
        campDate.getMonth() === today.getMonth() &&
        campDate.getFullYear() === today.getFullYear()
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">

        <h1 className="text-3xl font-bold mb-2">Blood Donation Camps</h1>
        <p className="text-muted-foreground mb-6">
          Find and register for nearby blood donation camps
        </p>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3 mb-8">
          {["all", "this-week", "this-month"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-lg ${
                filter === option ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              {option === "all"
                ? "All Camps"
                : option === "this-week"
                ? "This Week"
                : "This Month"}
            </button>
          ))}
        </div>

        {loading && <p>Loading camps...</p>}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCamps.map((camp) => (
              <div key={camp.id} className="border rounded-xl p-5">

                <h3 className="font-bold text-lg">{camp.title}</h3>
                <p className="text-sm text-gray-500">
                  by {camp.organizer || "Organizer"}
                </p>

                <div className="space-y-2 mt-3 text-sm">
                  <div className="flex gap-2">
                    <Calendar size={16} /> {formatDate(camp.camp_date)}
                  </div>

                  <div className="flex gap-2">
                    <Clock size={16} /> {camp.start_time} — {camp.end_time}
                  </div>

                  <div className="flex gap-2">
                    <MapPin size={16} /> {camp.location}
                  </div>

                  <p className="text-xs text-gray-500">
                    Registered: {registrationCounts[camp.id] || 0}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1"
                    onClick={() => registerForCamp(camp.id)}
                  >
                    Register <ArrowRight size={16} />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => openDirections(camp)}
                  >
                    <MapPin size={16} />
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}

        {!loading && filteredCamps.length === 0 && <p>No camps found.</p>}
      </div>
    </div>
  );
};

export default Camps;
