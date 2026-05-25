
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Menu, 
  X, 
  Leaf, 
  ArrowLeft,
  Phone,
  CheckCircle,
  Clock,
  User,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Download,
  MessageCircle
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
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
  totalAmount: number;
  scheduledDate?: string;
  strain?: string;
}

const PickupCalendar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [strainFilter, setStrainFilter] = useState<string>('all');
  const navigate = useNavigate();

  // Mock data with enhanced status and strains
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    const mockRequests: PickupRequest[] = [
      {
        id: '1',
        customerName: 'John Doe',
        whatsappNumber: '+254700123456',
        items: ['Blue Dream (1g)', 'RAW Papers (2 packs)'],
        pickupTime: 'morning',
        status: 'confirmed',
        createdAt: '2025-01-21T10:30:00Z',
        totalAmount: 1900,
        scheduledDate: format(today, 'yyyy-MM-dd'),
        strain: 'Blue Dream'
      },
      {
        id: '2',
        customerName: 'Jane Miller',
        whatsappNumber: '+254701234567',
        items: ['Girl Scout Cookies (2g)', 'Grinder (1pc)'],
        pickupTime: 'afternoon',
        status: 'pending',
        createdAt: '2025-01-21T08:15:00Z',
        totalAmount: 3200,
        scheduledDate: format(tomorrow, 'yyyy-MM-dd'),
        strain: 'Girl Scout Cookies'
      },
      {
        id: '3',
        customerName: 'Mike Johnson',
        whatsappNumber: '+254702345678',
        items: ['OG Kush (1g)', 'Lighter'],
        pickupTime: 'evening',
        status: 'completed',
        createdAt: '2025-01-20T16:45:00Z',
        totalAmount: 1600,
        scheduledDate: format(dayAfter, 'yyyy-MM-dd'),
        strain: 'OG Kush'
      },
      {
        id: '4',
        customerName: 'Sarah Wilson',
        whatsappNumber: '+254703456789',
        items: ['White Widow (1.5g)'],
        pickupTime: 'morning',
        status: 'pending',
        createdAt: '2025-01-22T09:20:00Z',
        totalAmount: 2400,
        scheduledDate: format(today, 'yyyy-MM-dd'),
        strain: 'White Widow'
      }
    ];
    
    setPickupRequests(mockRequests);
  }, []);

  const getFilteredRequests = () => {
    return pickupRequests.filter(req => {
      const matchesSearch = req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           req.whatsappNumber.includes(searchTerm) ||
                           req.strain?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      const matchesStrain = strainFilter === 'all' || req.strain === strainFilter;
      
      return matchesSearch && matchesStatus && matchesStrain;
    });
  };

  const getRequestsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return getFilteredRequests().filter(req => req.scheduledDate === dateString);
  };

  const getWeeklyStats = () => {
    const filtered = getFilteredRequests();
    const thisWeek = filtered.filter(req => {
      const reqDate = new Date(req.scheduledDate || req.createdAt);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return reqDate >= weekStart;
    });

    return {
      total: thisWeek.length,
      pending: thisWeek.filter(r => r.status === 'pending').length,
      confirmed: thisWeek.filter(r => r.status === 'confirmed').length,
      completed: thisWeek.filter(r => r.status === 'completed').length
    };
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
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
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
  const weeklyStats = getWeeklyStats();
  const uniqueStrains = [...new Set(pickupRequests.map(req => req.strain).filter(Boolean))];

  const exportToCalendar = (request: PickupRequest) => {
    const startDate = new Date(request.scheduledDate + 'T' + (
      request.pickupTime === 'morning' ? '09:00:00' :
      request.pickupTime === 'afternoon' ? '14:00:00' : '18:00:00'
    ));
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pickup: ${request.customerName}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Pickup for ${request.customerName}%0AItems: ${request.items.join(', ')}%0APhone: ${request.whatsappNumber}`;
    
    window.open(googleUrl, '_blank');
  };

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

        {/* Stats and Filters */}
        <div className="p-6 border-b border-border dark:border-border">
          {/* Weekly Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{weeklyStats.total}</div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">This Week</div>
              </CardContent>
            </Card>
            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">{weeklyStats.pending}</div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{weeklyStats.confirmed}</div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">Confirmed</div>
              </CardContent>
            </Card>
            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-500">{weeklyStats.completed}</div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-muted-foreground" size={16} />
              <Input
                placeholder="Search customers, phone, or strain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card dark:bg-card border-border dark:border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-card dark:bg-card border-border dark:border-border">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={strainFilter} onValueChange={setStrainFilter}>
              <SelectTrigger className="w-full md:w-40 bg-card dark:bg-card border-border dark:border-border">
                <Leaf size={16} className="mr-2" />
                <SelectValue placeholder="Strain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strains</SelectItem>
                {uniqueStrains.map(strain => (
                  <SelectItem key={strain} value={strain!}>{strain}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
                    hasPickups: (date) => getRequestsForDate(date).length > 0,
                    hasPending: (date) => getRequestsForDate(date).some(r => r.status === 'pending'),
                    hasConfirmed: (date) => getRequestsForDate(date).some(r => r.status === 'confirmed'),
                    hasCompleted: (date) => getRequestsForDate(date).some(r => r.status === 'completed')
                  }}
                  modifiersStyles={{
                    hasPickups: {
                      backgroundColor: 'rgb(74 222 128 / 0.2)',
                      borderRadius: '50%'
                    },
                    hasPending: {
                      backgroundColor: 'rgb(234 179 8 / 0.2)',
                      borderRadius: '50%'
                    },
                    hasConfirmed: {
                      backgroundColor: 'rgb(34 197 94 / 0.2)',
                      borderRadius: '50%'
                    }
                  }}
                />
                
                {/* Legend */}
                <div className="mt-4 p-3 bg-muted dark:bg-muted rounded-lg">
                  <p className="text-sm font-medium text-foreground dark:text-foreground mb-2">Legend:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                      <span className="text-muted-foreground dark:text-muted-foreground">Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      <span className="text-muted-foreground dark:text-muted-foreground">Confirmed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-muted-foreground dark:text-muted-foreground">Completed</span>
                    </div>
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
                                <strong>Strain:</strong> {request.strain}
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
                            
                            <div className="flex flex-row flex-wrap gap-2">
                              {request.status !== 'completed' && (
                                <Button
                                  onClick={() => markAsCompleted(request.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  size="sm"
                                >
                                  <CheckCircle size={14} className="sm:mr-1" />
                                  <span className="hidden sm:inline">Mark Complete</span>
                                </Button>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportToCalendar(request)}
                              >
                                <Download size={14} className="sm:mr-1" />
                                <span className="hidden sm:inline">Export</span>
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://wa.me/${request.whatsappNumber.replace('+', '')}`, '_blank')}
                              >
                                <MessageCircle size={14} className="sm:mr-1" />
                                <span className="hidden sm:inline">Contact</span>
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
