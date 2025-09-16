import { Button } from "@/components/ui/button";
import { useGlobals } from "@/lib/globals";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const footerSections = [
  {
    title: "Services",
    links: [
      { name: "Car Shipping", href: "#services" },
      { name: "Motorcycle Transport", href: "#services" },
      { name: "Open Carrier", href: "#services" },
      { name: "Enclosed Transport", href: "#services" },
      { name: "Express Delivery", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#about" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Reviews", href: "#reviews" },
      { name: "Careers", href: "#careers" },
      { name: "Blog", href: "#blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Contact Us", href: "#contact" },
      { name: "FAQ", href: "#faq" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  const { businessName } = useGlobals();
  const scrollToSection = (sectionId: string) => {
    const id = sectionId.startsWith("#") ? sectionId.substring(1) : sectionId;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary/5 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold text-primary mb-4">{businessName}</div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              America's trusted auto transport company with over 15 years of
              experience. We provide safe, reliable, and affordable vehicle
              shipping services nationwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-foreground">+1 (713) 344-4668</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-foreground">Bon999@yahoo.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-foreground">Nationwide Service</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="hover-elevate w-8 h-8"
                    onClick={() => console.log(`${social.label} clicked`)}
                    data-testid={`button-social-${social.label.toLowerCase()}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors hover-elevate"
                      data-testid={`link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">© {currentYear} {businessName}. All rights reserved.</div>

            <div className="flex items-center gap-6 text-sm">
              <button
                className="text-muted-foreground hover:text-primary transition-colors hover-elevate"
                onClick={() => console.log("Privacy policy clicked")}
                data-testid="link-privacy-policy"
              >
                Privacy Policy
              </button>
              <button
                className="text-muted-foreground hover:text-primary transition-colors hover-elevate"
                onClick={() => console.log("Terms of service clicked")}
                data-testid="link-terms-of-service"
              >
                Terms of Service
              </button>
              <span className="text-muted-foreground">FMCSA MC-123456</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
