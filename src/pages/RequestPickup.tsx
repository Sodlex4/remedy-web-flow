
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Leaf } from 'lucide-react';
import PickupRequestForm from '@/components/PickupRequestForm';
import { useBusiness } from '@/context/BusinessContext';

const RequestPickup = () => {
  const { businessName } = useBusiness();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Shop', href: '#shop' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="text-primary-foreground" size={20} />
              </div>
              <span className="text-xl font-bold text-foreground">
                {businessName}
              </span>
            </div>

            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-10 md:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="text-foreground hover:text-primary transition-colors duration-200 text-left text-lg"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Page Title Section */}
        <div className="text-center mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Request Your Pickup
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit your request and we'll contact you to confirm
          </p>
          <div className="mt-4">
            <span className="text-primary font-semibold text-lg">
              "Don't Panic, It's Organic"
            </span>
          </div>
        </div>

        {/* Pickup Request Form */}
        <PickupRequestForm />

        {/* Legal Footer Disclaimer */}
        <div className="mt-8 text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              ⚠️ For adults 21+ only. Licensed dispensary. Pickup only. No online sales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPickup;
