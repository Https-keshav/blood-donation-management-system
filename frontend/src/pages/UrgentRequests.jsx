import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  MapPin,
  Phone,
  User,
  Search,
} from "lucide-react";
import { fetchBloodStock } from "../services/eraktkosh";

const bloodTypes = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const UrgentRequests = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH LIVE STOCK ---------------- */
  useEffect(() => {
    fetchBloodStock()
      .then((data) => {
        const stock = data?.data || [];

        // 🔥 Convert stock → urgent requests
        const urgent = stock.map((item, index) => {
          let urgency = "Medium";
          if (item.units < 3) urgency = "Critical";
          else if (item.units <= 5) urgency = "High";

          return {
            id: index,
            bloodType: item.bloodGroup,
            hospital: item.bloodBankName,
            location: item.districtName || item.stateName,
            unitsNeeded: Math.max(1, 5 - Number(item.units)),
            urgency,
            postedTime: "Live",
            reason: "Low Blood Stock",
            contact: item.contactNo || "Contact Hospital",
          };
        });

        setRequests(urgent);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Urgent fetch error:", err);
        setLoading(false);
      });
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredRequests = requests.filter((request) => {
    const matchesType =
      selectedType === "All" || request.bloodType === selectedType;

    const matchesSearch =
      request.hospital
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.location
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  /* ---------------- URGENCY COLOR ---------------- */
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical":
        return "bg-destructive/10 text-destructive";
      case "High":
        return "bg-warning/10 text-warning";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Urgent Blood Requests
            </h1>
          </div>
          <p className="text-muted-foreground">
            Live low-stock alerts from blood banks. Donate and save lives.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-card rounded-2xl border p-4 mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital or location..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {bloodTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  selectedType === type
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted hover:bg-primary/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-muted-foreground">Loading urgent requests...</p>
        )}

        {/* Results */}
        {!loading && (
          <>
            <p className="text-muted-foreground mb-6">
              <span className="font-semibold text-foreground">
                {filteredRequests.length}
              </span>{" "}
              urgent requests found
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-card rounded-2xl border overflow-hidden hover:border-destructive/50 hover:shadow-lg transition"
                >
                  {/* Urgency */}
                  <div className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getUrgencyColor(
                        request.urgency
                      )}`}
                    >
                      {request.urgency}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-foreground">
                          {request.bloodType}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {request.unitsNeeded} Units Needed
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.reason}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <User className="w-4 h-4" />
                        <span>{request.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                    </div>

                    <Button
                      variant={
                        request.urgency === "Critical" ? "urgent" : "hero"
                      }
                      className="w-full"
                    >
                      <Phone className="w-4 h-4" />
                      Respond Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Urgent Requests
            </h3>
            <p className="text-muted-foreground">
              No low-stock alerts match your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrgentRequests;
