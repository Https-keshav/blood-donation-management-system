import { MapPin, Calendar, Bell, Shield, Clock, Users } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Find Nearby Banks",
    description:
      "Locate blood banks and hospitals near you with real-time availability data.",
  },
  {
    icon: Calendar,
    title: "Donation Camps",
    description:
      "Stay updated with upcoming blood donation camps in your city.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Get notified when you're eligible to donate again and when there's urgent need.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and protected. We value your privacy.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description:
      "Live updates on blood availability and urgent requirements.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Join a community of donors making a difference every day.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient">BloodBank</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We make blood donation simple, accessible, and impactful. Here's what
            sets us apart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
