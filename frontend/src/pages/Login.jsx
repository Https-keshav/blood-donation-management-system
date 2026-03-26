import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplet, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      /* ✅ CALL BACKEND */
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      /* ❌ HANDLE ERROR RESPONSE */
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      /* ✅ STORE JWT TOKEN */
      localStorage.setItem("token", data.token);

      /* ✅ STORE USER INFO */
      localStorage.setItem("user", JSON.stringify(data.user));

      /* ✅ REDIRECT */
      navigate("/dashboard");

    } catch (err) {
      alert(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero pt-20 pb-12 px-4">
      <div className="w-full max-w-md">
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
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-3 rounded-xl border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full">
              Login
            </Button>
          </form>

          <p className="text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;