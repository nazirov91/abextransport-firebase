import MultiStepQuoteForm from "./MultiStepQuoteForm";
import { CheckCircle, Star } from "lucide-react";
import carHaulerImage from "@assets/generated_images/Car_hauler_on_highway_4e5c4dfb.png";
import { useGlobals } from "@/lib/globals";

export default function HeroSection() {
  const { heroMessage, tagline } = useGlobals();
  return (
    <section
      id="quote"
      className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: `url(${carHaulerImage})` }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Headline & Benefits */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                {heroMessage}
              </h1>
              <p className="text-xl text-white/90 mt-6 leading-relaxed drop-shadow-xl">
                {tagline ||
                  "Professional car shipping with door-to-door service, full insurance coverage, and trusted nationwide network."}
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
                <span className="text-sm font-medium text-white drop-shadow-2xl">
                  4.8/5 Rating
                </span>
              </div>
              <div className="text-sm text-white/80 drop-shadow-2xl">
                Over 50,000 vehicles transported
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-white/90 drop-shadow-2xl">
                  Fully Insured & Licensed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-white/90 drop-shadow-2xl">Door-to-Door Service</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-white/90 drop-shadow-2xl">Nationwide Coverage</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-white/90 drop-shadow-2xl">Real-Time Tracking</span>
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
