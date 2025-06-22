
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X } from 'lucide-react';
import { format } from 'date-fns';

interface PickupRequest {
  id: string;
  customerName: string;
  whatsappNumber: string;
  createdAt: string;
  status: 'new' | 'seen' | 'ready';
}

interface NotificationDropdownProps {
  requests: PickupRequest[];
  onMarkAllSeen: () => void;
  onRequestClick: (id: string) => void;
}

const NotificationDropdown = ({ requests, onMarkAllSeen, onRequestClick }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const newRequests = requests.filter(req => req.status === 'new');
  const recentRequests = requests.slice(0, 5);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-muted-foreground hover:text-foreground"
      >
        <Bell size={20} />
        {newRequests.length > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
          >
            {newRequests.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-80 bg-card dark:bg-card border border-border dark:border-border rounded-lg shadow-lg z-50 animate-scale-in">
            <div className="p-4 border-b border-border dark:border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground dark:text-foreground">
                  Recent Requests
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X size={14} />
                </Button>
              </div>
              {newRequests.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllSeen}
                  className="mt-2 text-xs"
                >
                  Mark all as seen
                </Button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {recentRequests.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No recent requests
                </div>
              ) : (
                recentRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => {
                      onRequestClick(request.id);
                      setIsOpen(false);
                    }}
                    className={`p-3 border-b border-border dark:border-border last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                      request.status === 'new' ? 'bg-red-500/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground dark:text-foreground text-sm">
                          {request.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                          {request.whatsappNumber}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                          {format(new Date(request.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      {request.status === 'new' && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
