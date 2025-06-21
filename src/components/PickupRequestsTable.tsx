
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, CheckCircle, Clock, Phone } from 'lucide-react';
import { format } from 'date-fns';

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

interface PickupRequestsTableProps {
  requests: PickupRequest[];
  onRequestClick: (request: PickupRequest) => void;
  onUpdateStatus: (id: string, status: 'seen' | 'ready') => void;
}

const PickupRequestsTable = ({ requests, onRequestClick, onUpdateStatus }: PickupRequestsTableProps) => {
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

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pickup requests found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Customer</TableHead>
              <TableHead className="text-foreground">Contact</TableHead>
              <TableHead className="text-foreground">Items</TableHead>
              <TableHead className="text-foreground">Pickup Time</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Amount</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow 
                key={request.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onRequestClick(request)}
              >
                <TableCell className="font-medium text-foreground">
                  {request.customerName}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(request.createdAt), 'MMM dd, HH:mm')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Phone size={14} className="text-muted-foreground" />
                    <span className="text-foreground">{request.whatsappNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    {request.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="text-sm text-foreground">
                        {item}
                      </div>
                    ))}
                    {request.items.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{request.items.length - 2} more
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-foreground">
                  {formatPickupTime(request.pickupTime)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(request.status)}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  KSh {request.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {request.status === 'new' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(request.id, 'seen');
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        Mark Seen
                      </Button>
                    )}
                    {request.status === 'seen' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(request.id, 'ready');
                        }}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Mark Ready
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {requests.map((request) => (
          <div 
            key={request.id}
            className="bg-muted/20 rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => onRequestClick(request)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{request.customerName}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(request.createdAt), 'MMM dd, HH:mm')}
                </p>
              </div>
              {getStatusBadge(request.status)}
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{request.whatsappNumber}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items:</p>
                {request.items.slice(0, 2).map((item, index) => (
                  <p key={index} className="text-sm text-foreground">• {item}</p>
                ))}
                {request.items.length > 2 && (
                  <p className="text-xs text-muted-foreground">+{request.items.length - 2} more items</p>
                )}
              </div>
              <p className="text-sm text-foreground">
                <Clock size={14} className="inline mr-1" />
                {formatPickupTime(request.pickupTime)}
              </p>
              <p className="text-sm font-semibold text-foreground">
                Total: KSh {request.totalAmount.toLocaleString()}
              </p>
            </div>

            <div className="flex space-x-2">
              {request.status === 'new' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(request.id, 'seen');
                  }}
                >
                  <Eye size={14} className="mr-1" />
                  Mark Seen
                </Button>
              )}
              {request.status === 'seen' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(request.id, 'ready');
                  }}
                >
                  <CheckCircle size={14} className="mr-1" />
                  Mark Ready
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickupRequestsTable;
