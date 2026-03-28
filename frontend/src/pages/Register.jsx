import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplet, Eye, EyeOff } from "lucide-react";
import API from "@/api"; // ✅ IMPORTANT

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    bloodGroup: "",
    location: "",
    lastDonation: "",
    isAvailable: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/register", {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        blood_group: formData.bloodGroup,
        location: formData.location,
        last_donation: formData.lastDonation || null,
        is_available: formData.isAvailable,
      });

      // ✅ SUCCESS
      alert("Registration successful ✅");
      navigate("/login");

    } catch (err) {
      // ✅ ERROR HANDLING
      const message =
        err.response?.data?.message || "Registration failed ❌";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero pt-24 pb-12 px-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-primary">
              <Droplet className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Blood<span className="text-primary">Bank</span>
            </span>
          </Link>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            Become a Donor
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              className="border p-3 rounded-xl w-full"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="border p-3 rounded-xl w-full"
            />

            {/* Phone */}
            <input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="border p-3 rounded-xl w-full"
            />

            {/* Blood Group */}
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, bloodGroup: type })
                  }
                  className={`py-2 rounded-xl ${
                    formData.bloodGroup === type
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Location */}
            <input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              className="border p-3 rounded-xl w-full"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="border p-3 rounded-xl w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;