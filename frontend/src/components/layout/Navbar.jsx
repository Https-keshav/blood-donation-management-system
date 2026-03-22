import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Droplet, User, LogIn, LayoutDashboard } from "lucide-react";
import API from "@/api/api"; // ✅ use axios instance

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blood Banks", path: "/blood-banks" },
    { name: "Camps", path: "/camps" },
    { name: "Urgent Requests", path: "/urgent-requests" },
  ];

  const isActive = (path) => location.pathname === path;

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/api/me"); // ✅ FIXED
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Droplet className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              Blood<span className="text-primary">Bank</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>

                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted"
                >
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.full_name?.split(" ")[0] || "User"}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg hover:bg-muted"
            >
              {link.name}
            </Link>
          ))}

          {!user ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full" variant="outline">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full" variant="hero">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dashboard");
                }}
              >
                Dashboard
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/profile");
                }}
              >
                My Profile
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
