import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Heart, MapPin, Users } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  // ✅ SAFE login check
  const user = localStorage.getItem("user");
  const isLoggedIn = user && JSON.parse(user)?.isLoggedIn;

  const handleBecomeDonor = () => {
    if (isLoggedIn) {
      window.alert("✅ You are already registered as a donor.");
      return; // ⛔ STOP HERE
    }
    navigate("/register");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero pt-16">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8 animate-fade-in">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Every Drop Saves a Life
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 animate-slide-up">
            Donate Blood, <span className="text-gradient">Save Lives</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Join thousands of heroes who donate blood every day.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button variant="hero" size="xl" onClick={() => navigate("/search")}>
              <Search className="w-5 h-5" />
              Find Blood Now
            </Button>

            {/* ✅ SMART DONOR BUTTON */}
            <Button
              variant="outline"
              size="xl"
              type="button"
              onClick={handleBecomeDonor}
            >
              <Heart className="w-5 h-5" />
              Become a Donor
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { icon: Users, value: "10,000+", label: "Registered Donors" },
              { icon: Heart, value: "25,000+", label: "Lives Saved" },
              { icon: MapPin, value: "500+", label: "Blood Banks" },
              { icon: Search, value: "1,000+", label: "Daily Searches" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
