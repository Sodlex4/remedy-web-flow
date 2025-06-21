
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Clock, Package, Calendar, Eye, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

interface PickupRequest {
  id: string;
  customerName: string;
  whatsappNumber: string;
  items: string[];
  pickupTime: string;
  status: 'new' | 'seen' | 'ready';
  createdAt: string;
  totalAmount: number;
}

interface RequestDetailModalProps {
  request: PickupRequest;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'seen' | 'ready') => void;
}

const RequestDetailModal = ({ request, isOpen, onClose, onUpdateStatus }: RequestDetailModalProps) => {
  const [adminNote, setAdminNote] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">New</Badge>;
      case 'seen':
        return <Badge variant="secondary">Seen</Badge>;
      case 'ready':
        return <Badge className="bg-green-500 hover:bg-green-600">Ready</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPickupTime = (time: string) => {
    switch (time) {
      case 'morning':
        return 'Morning (9AM-12PM)';
      case 'afternoon':
        return 'Afternoon (12PM-4PM)';
      case 'evening':
        return 'Evening (4PM-8PM)';
      case 'anytime':
        return 'Any time';
      default:
        return time;
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hello ${request.customerName}! This is Nature's Remedy. 

Your pickup request has been received:
${request.items.map(item => `• ${item}`).join('\n')}

Total: KSh ${request.totalAmount.toLocaleString()}

We'll have your order ready soon. Please confirm your pickup time: ${formatPickupTime(request.pickupTime)}

"Don't Panic, It's Organic" 🌿`;

    const whatsappUrl = `https://wa.me/${request.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleStatusUpdate = (status: 'seen' | 'ready') => {
    onUpdateStatus(request.id, status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground text-xl">
              Pickup Request Details
            </DialogTitle>
            {getStatusBadge(request.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Customer Name</Label>
                <p className="text-foreground font-medium">{request.customerName}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground">WhatsApp Number</Label>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <p className="text-foreground">{request.whatsappNumber}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Request Date</Label>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <p className="text-foreground">
                    {format(new Date(request.createdAt), 'MMMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground">Preferred Pickup Time</Label>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <p className="text-foreground">{formatPickupTime(request.pickupTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg flex items-center">
              <Package size={20} className="mr-2" />
              Order Details
            </h3>
            
            <div className="bg-muted/20 rounded-lg p-4 space-y-2">
              {request.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-foreground">• {item}</span>
                </div>
              ))}
              
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-foreground">Total Amount:</span>
                  <span className="text-primary text-lg">
                    KSh {request.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Admin Notes</h3>
            <div className="space-y-2">
              <Label htmlFor="adminNote" className="text-muted-foreground">
                Add internal notes (optional)
              </Label>
              <Textarea
                id="adminNote"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add any notes about this request..."
                className="bg-background border-border text-foreground min-h-[80px]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleWhatsAppContact}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone className="mr-2" size={16} />
              Contact via WhatsApp
            </Button>

            <div className="flex gap-2 sm:flex-1">
              {request.status === 'new' && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate('seen')}
                  className="flex-1"
                >
                  <Eye className="mr-2" size={16} />
                  Mark as Seen
                </Button>
              )}

              {request.status === 'seen' && (
                <Button
                  onClick={() => handleStatusUpdate('ready')}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Mark as Ready
                </Button>
              )}

              {request.status === 'ready' && (
                <div className="flex-1 flex items-center justify-center text-green-500 font-medium">
                  <CheckCircle className="mr-2" size={16} />
                  Ready for Pickup
                </div>
              )}
            </div>
          </div>

          {/* Legal Notice */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground text-center">
              ⚠️ Verify customer age (21+) and ID before releasing products. Licensed dispensary operations only.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailModal;
