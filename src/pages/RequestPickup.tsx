
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu, X, Leaf } from 'lucide-react';

const RequestPickup = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    pickupTime: '',
    ageConfirmed: false
  });

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Shop', href: '#shop' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const cartItems = [
    { name: 'Blue Dream', quantity: 1, price: 1600, type: 'Sativa' },
    { name: 'RAW Classic Papers', quantity: 2, price: 300, type: 'Rolling Papers' }
  ];

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ageConfirmed) {
      alert('Please confirm you are 21+ to proceed');
      return;
    }
    
    // Create WhatsApp message
    const message = `Hello Nature's Remedy! I'd like to request a pickup:

Name: ${formData.fullName}
Phone: ${formData.whatsappNumber}
Preferred Pickup Time: ${formData.pickupTime || 'Any time'}

Cart Items:
${cartItems.map(item => `- ${item.name} (x${item.quantity}) - KSh ${item.price * item.quantity}`).join('\n')}

Total: KSh ${totalPrice.toLocaleString()}

Thank you!`;

    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
                Nature's Remedy
              </span>
            </div>

            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-10"
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
            We'll contact you via WhatsApp to confirm
          </p>
          <div className="mt-4">
            <span className="text-primary font-semibold text-lg">
              "Don't Panic, It's Organic"
            </span>
          </div>
        </div>

        {/* Cart Summary Section */}
        <Card className="mb-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center justify-between">
              Your Cart Summary
              <span className="text-primary">KSh {totalPrice.toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.type} • Qty: {item.quantity}</p>
                </div>
                <span className="text-primary font-semibold">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">KSh {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Request Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Pickup Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber" className="text-foreground">WhatsApp / Phone Number</Label>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="e.g., +254700123456"
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>

              {/* Pickup Time */}
              <div className="space-y-2">
                <Label htmlFor="pickupTime" className="text-foreground">Preferred Pickup Time</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select pickup time (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                    <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                    <SelectItem value="anytime">Any time convenient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Confirmation */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ageConfirmed"
                  checked={formData.ageConfirmed}
                  onCheckedChange={(checked) => setFormData({ ...formData, ageConfirmed: !!checked })}
                  className="border-border"
                />
                <Label 
                  htmlFor="ageConfirmed" 
                  className="text-foreground font-medium cursor-pointer"
                >
                  I confirm I am 21+ years old
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                size="lg"
              >
                Submit Pickup Request
              </Button>
            </form>
          </CardContent>
        </Card>

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
