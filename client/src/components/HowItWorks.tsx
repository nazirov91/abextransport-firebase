import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Search, Truck, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: FileText,
    title: 'Get Your Quote',
    description: 'Fill out our simple form with pickup and delivery locations. Receive an instant, transparent quote with no hidden fees.',
    action: 'Takes 60 seconds'
  },
  {
    number: 2,
    icon: Search,
    title: 'We Find Your Carrier',
    description: 'Our team matches you with vetted, insured carriers from our nationwide network. We handle all the logistics.',
    action: 'Usually within 1-3 days'
  },
  {
    number: 3,
    icon: Truck,
    title: 'Vehicle Pickup',
    description: 'Carrier arrives at your location, inspects your vehicle, and begins safe transport to your destination.',
    action: 'Flexible scheduling'
  },
  {
    number: 4,
    icon: CheckCircle,
    title: 'Safe Delivery',
    description: 'Track your vehicle in real-time. Upon delivery, inspect your car and complete the process with peace of mind.',
    action: 'Full insurance coverage'
  }
]

export default function HowItWorks() {
  const scrollToQuote = () => {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Auto Transport Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process makes shipping your vehicle simple, safe, and stress-free. 
            From quote to delivery in just 4 easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            const isLast = index === steps.length - 1
            
            return (
              <div key={index} className="relative">
                <Card className="text-center hover-elevate transition-all duration-200 border-card-border">
                  <CardContent className="pt-8 pb-6">
                    {/* Step Number */}
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    <div className="text-sm font-medium text-chart-2">
                      {step.action}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Connector Arrow - Hidden on last item and mobile */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-primary/30"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-primary/30 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of satisfied customers who trust us with their vehicle transport needs.
          </p>
          <Button 
            onClick={scrollToQuote}
            size="lg"
            className="bg-chart-1 hover:bg-chart-1/90 text-white px-8 py-6 text-lg"
            data-testid="button-start-quote"
          >
            Get Your Free Quote Now
          </Button>
        </div>
      </div>
    </section>
  )
}