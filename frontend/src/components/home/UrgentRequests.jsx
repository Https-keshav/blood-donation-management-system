import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, Phone, ArrowRight } from "lucide-react";

const urgentRequests = [
  {
    id: 1,
    bloodType: "O-",
    hospital: "City General Hospital",
    location: "New Delhi",
    urgency: "Critical",
    postedTime: "30 mins ago",
    unitsNeeded: 3,
    contact: "+91 98XXX XXXXX",
  },
  {
    id: 2,
    bloodType: "AB+",
    hospital: "Apollo Hospital",
    location: "Mumbai",
    urgency: "High",
    postedTime: "1 hour ago",
    unitsNeeded: 2,
    contact: "+91 87XXX XXXXX",
  },
  {
    id: 3,
    bloodType: "B-",
    hospital: "Max Healthcare",
    location: "Bangalore",
    urgency: "Critical",
    postedTime: "2 hours ago",
    unitsNeeded: 4,
    contact: "+91 76XXX XXXXX",
  },
];

const UrgentRequests = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Urgent Requests
              </h2>
            </div>
            <p className="text-muted-foreground">
              Immediate blood requirements near you. Your donation can save a life today.
            </p>
          </div>
          <Link to="/urgent-requests">
            <Button variant="outline">
              View All Requests
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgentRequests.map((request) => (
            <div
              key={request.id}
              className="group bg-card rounded-2xl border border-border p-6 hover:border-destructive/50 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-foreground">
                      {request.bloodType}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        request.urgency === "Critical"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {request.urgency}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.unitsNeeded} units needed
                    </p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-foreground">{request.hospital}</p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{request.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{request.postedTime}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="urgent" className="flex-1">
                  <Phone className="w-4 h-4" />
                  Respond Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UrgentRequests;
