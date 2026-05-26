import { Facebook, Instagram, Twitter, Leaf } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

const Footer = () => {
  const { businessName, county, content } = useBusiness();
  const footerMission = content('footer_mission');
  const legalDisclaimer = content('legal_disclaimer');

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="text-primary-foreground" size={20} />
              </div>
              <span className="text-xl font-bold text-foreground">{businessName}</span>
            </div>
            <p className="text-muted-foreground text-sm">{footerMission}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <button onClick={() => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' })} className="block text-muted-foreground hover:text-primary transition-colors">Home</button>
              <button onClick={() => document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' })} className="block text-muted-foreground hover:text-primary transition-colors">Shop</button>
              <button onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })} className="block text-muted-foreground hover:text-primary transition-colors">About</button>
              <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="block text-muted-foreground hover:text-primary transition-colors">Contact</button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Legal Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Licensed Cannabis Dispensary</p>
              <p>License #: [Your License Number]</p>
              <p>{county}, Kenya</p>
              <p className="text-primary font-medium">Must be 21+ to enter</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
            <h4 className="text-foreground font-semibold mb-2">⚠️ Legal Disclaimer</h4>
            <p className="text-sm text-muted-foreground">{legalDisclaimer}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2025 {businessName}. All Rights Reserved.</p>
            <p className="mt-2 md:mt-0">Must be 21+ to enter • Licensed Cannabis Dispensary</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
