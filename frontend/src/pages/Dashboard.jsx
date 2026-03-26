import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Calendar,
  Bell,
  Clock,
  Users,
  AlertTriangle,
  User,
} from "lucide-react";

/* ✅ IMPORT AXIOS INSTANCE */
import API from "@/api/api";

/* STATIC UI DATA */
const quickActions = [
  {
    icon: MapPin,
    title: "Nearby Banks",
    description: "Locate blood banks",
    path: "/blood-banks",
    color: "bg-success/10 text-success",
  },
  {
    icon: Calendar,
    title: "Donation Camps",
    description: "View upcoming camps",
    path: "/camps",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: AlertTriangle,
    title: "Urgent Requests",
    description: "Help save lives now",
    path: "/urgent-requests",
    color: "bg-destructive/10 text-destructive",
  },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/me"); // ✅ FIXED
        setUser(res.data);
      } catch (err) {
        /* ❌ If token invalid → redirect */
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <p className="text-center mt-24">Loading dashboard...</p>;
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.full_name.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            Your dashboard to manage donations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat icon={<Heart />} value="—" label="Total Donations" />
          <Stat icon={<Users />} value="—" label="Lives Saved" />
          <Stat
            icon={<Clock />}
            value={user.last_donation ? "Recently Donated" : "Eligible"}
            label="Status"
          />
          <Stat icon={<Bell />} value="—" label="Alerts" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    to={action.path}
                    className="bg-card rounded-2xl border p-5 hover:shadow-lg"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}
                    >
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Donation Status */}
            {user.is_available && (
              <div className="gradient-primary rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-2">
                  Donation Status
                </h3>
                <p>
                  {user.last_donation
                    ? `Last donated on ${formatDate(user.last_donation)}`
                    : "You are eligible to donate!"}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Profile */}
            <div className="bg-card rounded-2xl border p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">{user.full_name}</h3>
                  <span className="text-2xl font-bold text-primary">
                    {user.blood_group}
                  </span>
                </div>
              </div>

              <Link to="/profile">
                <Button className="w-full">View Profile</Button>
              </Link>
            </div>

            {/* Info */}
            <div className="bg-muted/50 rounded-2xl p-5">
              <h3 className="font-bold mb-2">Did You Know?</h3>
              <p className="text-sm">
                Your blood group <b>{user.blood_group}</b> is always in demand ❤️
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, value, label }) => (
  <div className="bg-card rounded-2xl border p-5">
    <div className="mb-2 text-primary">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default Dashboard;