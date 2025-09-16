import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useGlobals } from "@/lib/globals";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { businessName } = useGlobals();

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center" data-testid="header-logo">
              <div className="text-2xl font-bold text-primary">{businessName}</div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("services")}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors hover-elevate"
                data-testid="link-services"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors hover-elevate"
                data-testid="link-how-it-works"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors hover-elevate"
                data-testid="link-reviews"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors hover-elevate"
                data-testid="link-faq"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors hover-elevate"
                data-testid="link-contact"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-1" />
              <span>+1 (713) 344-4668</span>
            </div>
            <Button
              onClick={() => scrollToSection("quote")}
              className="bg-chart-1 hover:bg-chart-1/90 text-white"
              data-testid="button-get-quote"
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
            <button
              onClick={() => scrollToSection("services")}
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover-elevate w-full text-left"
              data-testid="link-mobile-services"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover-elevate w-full text-left"
              data-testid="link-mobile-how-it-works"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover-elevate w-full text-left"
              data-testid="link-mobile-reviews"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover-elevate w-full text-left"
              data-testid="link-mobile-faq"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover-elevate w-full text-left"
              data-testid="link-mobile-contact"
            >
              Contact
            </button>
            <div className="px-3 py-2">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Phone className="h-4 w-4 mr-1" />
                <span>+1 (713) 344-4668</span>
              </div>
              <Button
                onClick={() => scrollToSection("quote")}
                className="bg-chart-1 hover:bg-chart-1/90 text-white w-full"
                data-testid="button-mobile-get-quote"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
