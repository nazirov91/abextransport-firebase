import { Card, CardContent } from "@/components/ui/card";
import { useGlobals } from "@/lib/globals";

const stats = [
  {
    number: "50,000+",
    label: "Vehicles Shipped",
    description: "Successfully transported nationwide",
  },
  {
    number: "4.8/5",
    label: "Customer Rating",
    description: "Average satisfaction score",
  },
  {
    number: "98%",
    label: "On-Time Delivery",
    description: "Reliable pickup and delivery",
  },
  {
    number: "24/7",
    label: "Customer Support",
    description: "Always here when you need us",
  },
];

export default function WhyChooseUs() {
  const { businessName } = useGlobals();
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose {businessName}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're not just another auto transport company. We're your trusted partner committed to
            providing exceptional service and peace of mind.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-card-border">
              <CardContent className="pt-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
