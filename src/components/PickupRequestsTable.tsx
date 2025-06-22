
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Eye, 
  Phone, 
  Package, 
  Clock,
  CheckCircle
} from 'lucide-react';
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
  userRole: 'admin' | 'assistant' | 'viewer';
}

const PickupRequestsTable = ({ 
  requests, 
  onRequestClick, 
  onUpdateStatus,
  userRole 
}: PickupRequestsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-500 hover:bg-red-600';
      case 'seen': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'ready': return 'bg-green-500 hover:bg-green-600';
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

  const canEdit = userRole === 'admin' || userRole === 'assistant';

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground dark:text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-2">
          No pickup requests yet
        </h3>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Pickup requests will appear here when customers submit them.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground dark:text-foreground">Customer</TableHead>
              <TableHead className="text-foreground dark:text-foreground">Contact</TableHead>
              <TableHead className="text-foreground dark:text-foreground">Items</TableHead>
              <TableHead className="text-foreground dark:text-foreground">Pickup Time</TableHead>
              <TableHead className="text-foreground dark:text-foreground">Amount</TableHead>
              <TableHead className="text-foreground dark:text-foreground">Status</TableHead>
              <TableHead className="text-foreground dark:text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              
              return (
                <TableRow 
                  key={request.id}
                  className="hover:bg-muted/50 dark:hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onRequestClick(request)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground dark:text-foreground">
                        {request.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                        {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-muted-foreground dark:text-muted-foreground">
                      <Phone size={14} className="mr-2" />
                      {request.whatsappNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm text-foreground dark:text-foreground">
                        {request.items.slice(0, 2).join(', ')}
                        {request.items.length > 2 && '...'}
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                        {request.items.length} item{request.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {request.pickupTime}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground dark:text-foreground">
                      KSh {request.totalAmount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusColor(request.status)} text-white hover:text-white`}
                    >
                      <StatusIcon size={12} className="mr-1" />
                      {request.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      {canEdit && request.status === 'new' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateStatus(request.id, 'seen')}
                        >
                          Mark Seen
                        </Button>
                      )}
                      {canEdit && request.status === 'seen' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateStatus(request.id, 'ready')}
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          Mark Ready
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRequestClick(request)}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {requests.map((request) => {
          const StatusIcon = getStatusIcon(request.status);
          
          return (
            <div
              key={request.id}
              className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onRequestClick(request)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground dark:text-foreground">
                  {request.customerName}
                </h3>
                <Badge 
                  className={`${getStatusColor(request.status)} text-white`}
                >
                  <StatusIcon size={12} className="mr-1" />
                  {request.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground dark:text-muted-foreground">
                  <Phone size={14} className="mr-2" />
                  {request.whatsappNumber}
                </div>
                
                <div className="text-foreground dark:text-foreground">
                  <strong>Items:</strong> {request.items.join(', ')}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground dark:text-muted-foreground">
                    <strong>Pickup:</strong> {request.pickupTime}
                  </div>
                  <div className="font-medium text-foreground dark:text-foreground">
                    KSh {request.totalAmount.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                  {format(new Date(request.createdAt), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
              
              {canEdit && (
                <div className="flex space-x-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  {request.status === 'new' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(request.id, 'seen')}
                    >
                      Mark Seen
                    </Button>
                  )}
                  {request.status === 'seen' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(request.id, 'ready')}
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    >
                      Mark Ready
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PickupRequestsTable;
