
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Menu, 
  X, 
  Leaf, 
  ArrowLeft,
  Phone,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';

interface PickupRequest {
  id: string;
  customerName: string;
  whatsappNumber: string;
  items: string[];
  pickupTime: string;
  status: 'new' | 'seen' | 'ready' | 'completed';
  createdAt: string;
  totalAmount: number;
  scheduledDate?: string;
}

const PickupCalendar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const navigate = useNavigate();

  // Mock data with scheduled dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const mockRequests: PickupRequest[] = [
      {
        id: '1',
        customerName: 'John Doe',
        whatsappNumber: '+254700123456',
        items: ['Blue Dream (1g)', 'RAW Papers (2 packs)'],
        pickupTime: 'morning',
        status: 'ready',
        createdAt: '2025-01-21T10:30:00Z',
        totalAmount: 1900,
        scheduledDate: format(today, 'yyyy-MM-dd')
      },
      {
        id: '2',
        customerName: 'Jane M.',
        whatsappNumber: '+254701234567',
        items: ['Girl Scout Cookies (2g)', 'Grinder (1pc)'],
        pickupTime: 'afternoon',
        status: 'seen',
        createdAt: '2025-01-21T08:15:00Z',
        totalAmount: 3200,
        scheduledDate: format(tomorrow, 'yyyy-MM-dd')
      },
      {
        id: '3',
        customerName: 'Mike Johnson',
        whatsappNumber: '+254702345678',
        items: ['OG Kush (1g)', 'Lighter'],
        pickupTime: 'evening',
        status: 'new',
        createdAt: '2025-01-20T16:45:00Z',
        totalAmount: 1600,
        scheduledDate: format(today, 'yyyy-MM-dd')
      }
    ];
    
    setPickupRequests(mockRequests);
  }, []);

  const getRequestsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return pickupRequests.filter(req => req.scheduledDate === dateString);
  };

  const markAsCompleted = (id: string) => {
    setPickupRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'completed' as const } : req
      )
    );
    toast.success('Pickup marked as completed! 🎉');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-500';
      case 'seen': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDayDescription = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  const selectedDateRequests = getRequestsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-background dark:bg-background flex transition-colors duration-300">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card dark:bg-card border-r border-border dark:border-border transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="text-primary-foreground" size={16} />
              </div>
              <span className="font-bold text-foreground dark:text-foreground">Nature's Remedy</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <Button
              variant="outline"
              className="w-full justify-start mb-4"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="mr-3" size={18} />
              Back to Dashboard
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-card dark:bg-card border-b border-border dark:border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <h1 className="text-xl font-semibold text-foreground dark:text-foreground">Pickup Calendar</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-muted-foreground dark:text-muted-foreground">Welcome, Chizoh</span>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="text-primary-foreground" size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Calendar Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1 bg-card dark:bg-card border-border dark:border-border">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-foreground">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border border-border dark:border-border"
                  modifiers={{
                    hasPickups: (date) => getRequestsForDate(date).length > 0
                  }}
                  modifiersStyles={{
                    hasPickups: {
                      backgroundColor: 'rgb(74 222 128 / 0.2)',
                      borderRadius: '50%'
                    }
                  }}
                />
                
                {/* Legend */}
                <div className="mt-4 p-3 bg-muted dark:bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground dark:text-foreground mb-2">Legend:</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground dark:text-muted-foreground">
                    <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                    <span>Has scheduled pickups</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Pickups */}
            <Card className="lg:col-span-2 bg-card dark:bg-card border-border dark:border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground dark:text-foreground">
                    Pickups for {getDayDescription(selectedDate)}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {selectedDateRequests.length} pickup{selectedDateRequests.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {selectedDateRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground dark:text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-2">
                      No pickups scheduled
                    </h3>
                    <p className="text-muted-foreground dark:text-muted-foreground">
                      No pickup requests are scheduled for this date.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateRequests.map((request) => (
                      <Card key={request.id} className="border border-border dark:border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-foreground dark:text-foreground">
                                  {request.customerName}
                                </h3>
                                <Badge 
                                  className={`${getStatusColor(request.status)} text-white text-xs`}
                                >
                                  {request.status.toUpperCase()}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground mb-2">
                                <Phone size={14} className="mr-2" />
                                {request.whatsappNumber}
                              </div>
                              
                              <div className="text-sm text-muted-foreground dark:text-muted-foreground mb-2">
                                <strong>Items:</strong> {request.items.join(', ')}
                              </div>
                              
                              <div className="text-sm text-muted-foreground dark:text-muted-foreground mb-2">
                                <strong>Preferred Time:</strong> {request.pickupTime}
                              </div>
                              
                              <div className="text-sm font-medium text-foreground dark:text-foreground">
                                Total: KSh {request.totalAmount.toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                              {request.status !== 'completed' && (
                                <Button
                                  onClick={() => markAsCompleted(request.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  size="sm"
                                >
                                  <CheckCircle size={16} className="mr-1" />
                                  Mark Complete
                                </Button>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://wa.me/${request.whatsappNumber.replace('+', '')}`, '_blank')}
                              >
                                Contact
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card dark:bg-card border-t border-border dark:border-border p-4 text-center">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            Licensed Admin Area — Nature's Remedy © 2025
          </p>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PickupCalendar;
