import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Phone, 
  Clock, 
  Package, 
  Calendar,
  Eye,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import type { PickupRequest } from '@/types/pickupRequest';

interface RequestDetailModalProps {
  request: PickupRequest;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'seen' | 'ready') => void;
  userRole: 'admin' | 'assistant' | 'viewer';
}

const RequestDetailModal = ({ 
  request, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  userRole,
}: RequestDetailModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-500';
      case 'seen': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Clock;
      case 'seen': return Eye;
      case 'ready': return CheckCircle;
      default: return Clock;
    }
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Hi ${request.customerName}, regarding your pickup request #${request.id}. Your order is ready for pickup!`);
    const whatsappUrl = `https://wa.me/${request.whatsappNumber.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const canEdit = userRole === 'admin' || userRole === 'assistant';
  const StatusIcon = getStatusIcon(request.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card dark:bg-card border-border dark:border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-foreground dark:text-foreground">
            <span>Pickup Request Details</span>
            <div className="flex items-center gap-2">
              <Badge 
                className={`${getStatusColor(request.status)} text-white`}
              >
                <StatusIcon size={12} className="mr-1" />
                {request.status.toUpperCase()}
              </Badge>

            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Customer Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 dark:bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Package className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground">{request.customerName}</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Customer</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted/50 dark:bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground">{request.whatsappNumber}</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">WhatsApp Number</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Order Details</h3>
            
            <div className="bg-muted/50 dark:bg-muted/50 rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground dark:text-foreground mb-2">Items Requested:</p>
                  <ul className="space-y-1">
                    {request.items.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground dark:text-muted-foreground flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border dark:border-border">
                  <span className="font-medium text-foreground dark:text-foreground">Total Amount:</span>
                  <span className="text-lg font-bold text-primary">
                    KSh {request.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Pickup Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 dark:bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground capitalize">{request.pickupTime}</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Preferred Time</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted/50 dark:bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-foreground">
                    {format(new Date(request.createdAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {format(new Date(request.createdAt), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Calendar Sync — Coming Soon */}
          {canEdit && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Google Calendar</h3>
              <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Google Calendar Sync — Coming Soon</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {canEdit && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Actions</h3>
              
              <div className="flex flex-col space-y-3">
                {request.status === 'new' && (
                  <Button
                    onClick={() => {
                      onUpdateStatus(request.id, 'seen');
                      onClose();
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    <Eye className="mr-2" size={16} />
                    Mark as Seen
                  </Button>
                )}
                
                {request.status === 'seen' && (
                  <Button
                    onClick={() => {
                      onUpdateStatus(request.id, 'ready');
                      onClose();
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="mr-2" size={16} />
                    Mark as Ready for Pickup
                  </Button>
                )}
                
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  variant="outline"
                >
                  <MessageCircle className="mr-2" size={16} />
                  Contact via WhatsApp
                </Button>
              </div>
            </div>
          )}

          {/* Role-based message for viewers */}
          {userRole === 'viewer' && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You have view-only access. Contact an admin to make changes to this request.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailModal;
