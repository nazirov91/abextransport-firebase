import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Shield, MapPin, Truck, Users, Clock } from 'lucide-react'

const services = [
  {
    icon: Car,
    title: 'Car Shipping',
    description: 'Professional vehicle transport for all car types - sedans, SUVs, luxury cars, and classic vehicles.',
    features: ['All vehicle types', 'Damage-free guarantee', 'Professional drivers']
  },
  {
    icon: MapPin,
    title: 'Nationwide Coverage',
    description: 'Complete coverage across all 50 states with extensive network of certified carriers.',
    features: ['All 50 states', 'Alaska & Hawaii', 'City-to-city service']
  },
  {
    icon: Truck,
    title: 'Door-to-Door Service',
    description: 'Convenient pickup and delivery directly to your specified locations.',
    features: ['Home pickup', 'Business delivery', 'Flexible scheduling']
  },
  {
    icon: Shield,
    title: 'Full Insurance',
    description: 'Comprehensive insurance coverage and protection throughout the entire transport process.',
    features: ['Up to $100K coverage', 'Zero deductible', 'Claims support']
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: '24/7 customer support with dedicated transport coordinators for your peace of mind.',
    features: ['24/7 availability', 'Live tracking', 'Personal coordinator']
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: 'Reliable delivery timeframes with express options available for urgent shipments.',
    features: ['7-10 day standard', 'Express available', 'On-time guarantee']
  }
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Auto Transport Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From single vehicles to multiple car shipments, we provide reliable, 
            professional auto transport services across the United States.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card key={index} className="hover-elevate transition-all duration-200 border-card-border">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-chart-2 rounded-full flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}