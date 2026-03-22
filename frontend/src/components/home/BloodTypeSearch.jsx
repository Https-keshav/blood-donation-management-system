import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodTypeSearch = () => {
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?bloodType=${selectedType}&location=${location}`);
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Search for Blood
            </h2>
            <p className="text-muted-foreground">
              Find available blood units near you quickly and easily
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="bg-background rounded-2xl p-6 md:p-8 shadow-xl border border-border"
          >
            {/* Blood Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Select Blood Type
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {bloodTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                      selectedType === type
                        ? "gradient-primary text-primary-foreground shadow-primary"
                        : "bg-muted text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Enter Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or pincode..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
            >
              <Search className="w-5 h-5" />
              Search Blood
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BloodTypeSearch;
