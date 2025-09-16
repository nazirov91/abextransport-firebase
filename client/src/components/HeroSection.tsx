import MultiStepQuoteForm from "./MultiStepQuoteForm";
import { CheckCircle, Star } from "lucide-react";
import carHaulerImage from "@assets/generated_images/Car_hauler_on_highway_4e5c4dfb.png";

export default function HeroSection() {
  return (
    <section
      id="quote"
      className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${carHaulerImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Headline & Benefits */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Reliable Auto Transport Services
                <span className="text-primary"> Nationwide</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-6 leading-relaxed">
                Professional car shipping with door-to-door service, full
                insurance coverage, and trusted nationwide network. Get your
                vehicle transported safely and affordably.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">4.8/5 Rating</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Over 50,000 vehicles transported
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-foreground">
                  Fully Insured & Licensed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-foreground">Door-to-Door Service</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-foreground">Nationwide Coverage</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-foreground">Real-Time Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Column - Multi-Step Quote Form */}
          <div className="flex justify-center lg:justify-end">
            <MultiStepQuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
