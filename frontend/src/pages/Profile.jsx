import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Clock,
  Award,
  Edit2,
  LogOut,
  Trash2,
} from "lucide-react";

/* ✅ IMPORT AXIOS */
import API from "@/api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/me"); // ✅ FIXED
        setUser(res.data);
        setForm(res.data);
      } catch {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <p className="text-center mt-20">Loading profile...</p>;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      const res = await API.put("/api/profile", {
        email: form.email,
        phone: form.phone,
        location: form.location,
        last_donation: form.last_donation || null,
      });

      setUser(form);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch {
      alert("Update failed");
    }
  };

  /* ================= TOGGLE ================= */
  const toggleAvailability = async () => {
    const updated = { ...user, is_available: !user.is_available };

    setUser(updated);
    setForm(updated);

    try {
      await API.put("/api/profile", updated);
    } catch {
      alert("Failed to update availability");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT CARD */}
        <div className="bg-card rounded-2xl border sticky top-24 overflow-hidden">
          <div className="gradient-primary p-6 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 bg-white/20">
              <User className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-xl font-bold text-white">
              {user.full_name}
            </h2>

            <span className="text-2xl font-bold text-white">
              {user.blood_group}
            </span>
          </div>

          <div className="p-6 space-y-4">
            <Info icon={<Mail />} value={user.email} />
            <Info icon={<Phone />} value={user.phone || "-"} />
            <Info icon={<MapPin />} value={user.location || "-"} />
            <Info
              icon={<Calendar />}
              value={`Joined ${formatDate(user.created_at)}`}
            />

            {/* Toggle */}
            <div className="flex justify-between items-center border-t pt-4">
              <span>Available for Donation</span>
              <button
                onClick={toggleAvailability}
                className={`w-12 h-6 rounded-full ${
                  user.is_available ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transform ${
                    user.is_available ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <Button onClick={() => setEditMode(true)} className="w-full">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Button>

            <Button variant="ghost" onClick={handleLogout} className="w-full">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat icon={<Heart />} label="Donations" value="--" />
            <Stat icon={<Award />} label="Lives Saved" value="--" />
            <Stat
              icon={<Calendar />}
              label="Last Donation"
              value={
                user.last_donation ? formatDate(user.last_donation) : "Never"
              }
            />
            <Stat
              icon={<Clock />}
              label="Available"
              value={user.is_available ? "Yes" : "No"}
            />
          </div>

          {/* Tabs */}
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="flex border-b">
              {["overview", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <p>Thank you for being a donor ❤️</p>
              )}

              {activeTab === "settings" && (
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4" /> Delete Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">Edit Profile</h3>

            {["email", "phone", "location", "last_donation"].map((field) => (
              <input
                key={field}
                type={field === "last_donation" ? "date" : "text"}
                value={form[field] || ""}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            ))}

            <div className="flex gap-3">
              <Button onClick={saveProfile} className="flex-1">
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ icon, value }) => (
  <div className="flex items-center gap-3 text-muted-foreground">
    {icon}
    <span>{value}</span>
  </div>
);

const Stat = ({ icon, label, value }) => (
  <div className="bg-card border rounded-2xl p-4 text-center">
    <div className="mb-2 text-primary">{icon}</div>
    <div className="font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default Profile;