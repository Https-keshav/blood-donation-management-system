import { Link } from "react-router-dom";
import { Droplet, Heart, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Droplet className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Blood<span className="text-primary">Bank</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Connecting donors with those in need. Every drop counts, every
              donation saves lives.
            </p>
            <div className="flex items-center gap-2 text-primary">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Save Lives Today</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Find Blood", path: "/search" },
                { name: "Blood Banks", path: "/blood-banks" },
                { name: "Donation Camps", path: "/camps" },
                { name: "Urgent Requests", path: "/urgent-requests" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Donors */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">For Donors</h4>
            <ul className="space-y-2">
              {[
                { name: "Register", path: "/register" },
                { name: "Login", path: "/login" },
                { name: "My Profile", path: "/profile" },
                { name: "Donation History", path: "/profile" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@bloodbank.org</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 BloodBank. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary" /> for saving lives
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
