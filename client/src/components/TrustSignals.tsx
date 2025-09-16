import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Award, Users, Star } from 'lucide-react'

const trustSignals = [
  {
    icon: Shield,
    title: 'FMCSA Licensed',
    subtitle: 'MC-123456',
    description: 'Fully licensed and regulated by Federal Motor Carrier Safety Administration'
  },
  {
    icon: Award,
    title: 'A+ BBB Rating',
    subtitle: 'Accredited Business',
    description: 'Better Business Bureau accredited with excellent customer satisfaction'
  },
  {
    icon: Users,
    title: '50,000+',
    subtitle: 'Happy Customers',
    description: 'Successfully transported over 50,000 vehicles nationwide'
  },
  {
    icon: Star,
    title: '4.8/5 Rating',
    subtitle: 'Customer Reviews',
    description: 'Consistently rated excellent by thousands of satisfied customers'
  }
]

const partnerLogos = [
  'Transport Partners Association',
  'Auto Transport Alliance',
  'National Vehicle Logistics',
  'Certified Carrier Network'
]

export default function TrustSignals() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Trusted by Thousands Nationwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're fully licensed, insured, and committed to providing the highest quality auto transport services.
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustSignals.map((signal, index) => {
            const IconComponent = signal.icon
            return (
              <Card key={index} className="text-center border-card-border">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-chart-2" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {signal.title}
                  </div>
                  <div className="text-sm font-medium text-primary mb-2">
                    {signal.subtitle}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {signal.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Certifications & Partners */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Certified & Trusted Partners
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {partnerLogos.map((partner, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                {partner}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Licensed • Bonded • Insured • DOT Compliant
          </p>
        </div>
      </div>
    </section>
  )
}