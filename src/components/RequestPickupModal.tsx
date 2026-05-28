
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBusiness } from '@/context/BusinessContext';
import { useLocation } from '@/context/LocationContext';

interface Strain {
  id: string;
  name: string;
  type: string;
  price: number;
  thc?: string;
}

interface RequestPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStrains: Strain[];
  onRemoveStrain: (strainId: string) => void;
}

const RequestPickupModal = ({ isOpen, onClose, selectedStrains, onRemoveStrain }: RequestPickupModalProps) => {
  const { businessName } = useBusiness();
  const { selectedPeddler } = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    pickupTime: '',
    ageConfirmed: false
  });

  const totalPrice = selectedStrains.reduce((sum, strain) => sum + strain.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ageConfirmed) {
      toast.error('Please confirm you are 21+ to proceed');
      return;
    }

    if (!formData.fullName || !formData.whatsappNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^\+?\d{9,15}$/.test(formData.whatsappNumber.replace(/[\s\-]/g, ''))) {
      toast.error('Please enter a valid phone number (e.g., +254700123456)');
      return;
    }
    
    // Create WhatsApp message
    const message = `Hello ${businessName}! I'd like to request a pickup:

Name: ${formData.fullName}
Phone: ${formData.whatsappNumber}
Preferred Pickup Time: ${formData.pickupTime || 'Any time'}

Selected Items:
${selectedStrains.map(strain => `- ${strain.name} (${strain.type}) - KSh ${strain.price.toLocaleString()}`).join('\n')}

Total: KSh ${totalPrice.toLocaleString()}

"Don't Panic, It's Organic" - Thank you!`;

    // Show success toast
    toast.success('✅ Request Sent! Redirecting to WhatsApp...');
    
    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
      const whatsappNumber = selectedPeddler?.whatsappNumber || '254700000000';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      onClose();
      
      // Reset form
      setFormData({
        fullName: '',
        whatsappNumber: '',
        pickupTime: '',
        ageConfirmed: false
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Request Pickup</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Items Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Selected Items</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedStrains.map((strain) => (
                <div key={strain.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{strain.name}</h4>
                    <p className="text-sm text-muted-foreground">{strain.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold">
                      KSh {strain.price.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveStrain(strain.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">KSh {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Pickup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="text-foreground">WhatsApp / Phone Number *</Label>
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
                I confirm I am 21+ years old *
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              size="lg"
            >
              Submit Pickup Request
            </Button>
          </form>

          {/* Legal Disclaimer */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground text-center">
              ⚠️ For adults 21+ only. Licensed dispensary. Pickup only. No online sales.
            </p>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground text-center">
            We'll contact you via WhatsApp to confirm your pickup details.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPickupModal;
