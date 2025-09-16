import Navigation from './Navigation'
import HeroSection from './HeroSection'
import ServicesSection from './ServicesSection'
import TrustSignals from './TrustSignals'
import HowItWorks from './HowItWorks'
import WhyChooseUs from './WhyChooseUs'
import CustomerReviews from './CustomerReviews'
import FAQSection from './FAQSection'
import ContactSection from './ContactSection'
import Footer from './Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <TrustSignals />
        <HowItWorks />
        <WhyChooseUs />
        <CustomerReviews />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}