import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useBusiness } from '@/context/BusinessContext';
import { useLocation } from '@/context/LocationContext';

interface StrainItem {
  name: string;
  price: number;
}

const PickupRequestForm = () => {
  const { businessName } = useBusiness();
  const { selectedCounty, selectedPeddlerId, selectedPeddler } = useLocation();
  const [strains, setStrains] = useState<StrainItem[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    whatsappNumber: '',
    strain: '',
    quantity: 1,
    pickupTime: 'anytime'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetPeddlerId = selectedPeddlerId || '00000000-0000-0000-0000-000000000000';
  const targetCounty = selectedCounty || '';

  useEffect(() => {
    const query = supabase
      .from('strains')
      .select('name, price')
      .eq('available', true)
      .order('name');

    if (selectedPeddlerId) {
      query.eq('peddler_id', selectedPeddlerId);
    }

    query.then(({ data }) => {
      if (data) setStrains(data);
    });
  }, [selectedPeddlerId]);

  const getStrainPrice = (name: string): number => {
    return strains.find(s => s.name === name)?.price ?? 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.whatsappNumber || !formData.strain) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('pickup_requests')
        .insert([{
          name: formData.customerName,
          phone: formData.whatsappNumber,
          strain: formData.strain,
          quantity: formData.quantity,
          pickup_time: formData.pickupTime,
          status: 'new',
          total_amount: formData.quantity * getStrainPrice(formData.strain),
          peddler_id: targetPeddlerId,
          county: targetCounty,
        }]);

      if (error) {
        console.error('Error submitting request:', error);
        toast.error('Failed to submit request. Please try again.');
        return;
      }

      toast.success('Request Submitted Successfully ✅', {
        description: `Your pickup request for ${formData.strain} has been submitted.`
      });

      setFormData({ customerName: '', whatsappNumber: '', strain: '', quantity: 1, pickupTime: 'anytime' });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading = selectedPeddler
    ? `Request Pickup — ${selectedPeddler.businessName}`
    : `Request Pickup — ${businessName}`;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Name *</Label>
            <Input id="customerName" type="text" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} placeholder="Your full name" required />
          </div>
          <div>
            <Label htmlFor="whatsappNumber">Phone Number *</Label>
            <Input id="whatsappNumber" type="tel" value={formData.whatsappNumber} onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })} placeholder="+254700123456" required />
          </div>
          <div>
            <Label htmlFor="strain">Strain *</Label>
            <Select onValueChange={value => setFormData({ ...formData, strain: value })}>
              <SelectTrigger><SelectValue placeholder="Select a strain" /></SelectTrigger>
              <SelectContent>
                {strains.map(s => (
                  <SelectItem key={s.name} value={s.name}>{s.name} (KSh {s.price}/g)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity (grams)</Label>
            <Input id="quantity" type="number" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })} />
          </div>
          <div>
            <Label htmlFor="pickupTime">Preferred Pickup Time</Label>
            <Select onValueChange={value => setFormData({ ...formData, pickupTime: value })}>
              <SelectTrigger><SelectValue placeholder="Select pickup time" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                <SelectItem value="anytime">Any time convenient</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {targetCounty && (
            <div className="text-xs text-muted-foreground">
              County: {targetCounty}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PickupRequestForm;
