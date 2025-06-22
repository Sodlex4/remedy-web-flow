import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Menu, 
  X, 
  Leaf, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  Clock,
  Phone,
  Eye,
  CheckCircle,
  Package,
  VolumeX,
  Volume2,
  Moon,
  Sun,
  Calendar as CalendarIcon,
  MessageCircle,
  Star,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PickupRequestsTable from '@/components/PickupRequestsTable';
import RequestDetailModal from '@/components/RequestDetailModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import NotificationDropdown from '@/components/NotificationDropdown';

interface PickupRequest {
  id: string;
  customerName: string;
  whatsappNumber: string;
  items: string[];
  pickupTime: string;
  status: 'new' | 'seen' | 'ready';
  createdAt: string;
  totalAmount: number;
  isGoogleSynced?: boolean;
  lastSynced?: string;
}

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'assistant' | 'viewer'>('admin');
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(`Switched to ${newTheme ? 'dark' : 'light'} mode`);
  };

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio('/sounds/pop.mp3');
    audioRef.current.volume = 0.6;
    
    audioRef.current.onerror = () => {
      console.log('Custom sound not found, using system notification');
    };
  }, []);

  // Default/Mock data - replace with Supabase data
  useEffect(() => {
    const defaultRequests: PickupRequest[] = [
      {
        id: '1',
        customerName: 'John Doe',
        whatsappNumber: '+254700123456',
        items: ['Blue Dream (1g)', 'RAW Papers (2 packs)'],
        pickupTime: 'morning',
        status: 'new',
        createdAt: '2025-01-21T10:30:00Z',
        totalAmount: 1900
      },
      {
        id: '2',
        customerName: 'Jane M.',
        whatsappNumber: '+254701234567',
        items: ['Girl Scout Cookies (2g)', 'Grinder (1pc)'],
        pickupTime: 'afternoon',
        status: 'seen',
        createdAt: '2025-01-21T08:15:00Z',
        totalAmount: 3200
      },
      {
        id: '3',
        customerName: 'Mike Johnson',
        whatsappNumber: '+254702345678',
        items: ['OG Kush (1g)', 'Lighter'],
        pickupTime: 'evening',
        status: 'ready',
        createdAt: '2025-01-20T16:45:00Z',
        totalAmount: 1600
      },
      {
        id: '4',
        customerName: 'Sarah W.',
        whatsappNumber: '+254703456789',
        items: ['Granddaddy Purple (1g)', 'Papers (1 pack)'],
        pickupTime: 'anytime',
        status: 'new',
        createdAt: '2025-01-21T12:20:00Z',
        totalAmount: 1500
      }
    ];
    setPickupRequests(defaultRequests);
  }, []);

  // Simulate real-time updates with enhanced notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddNew = Math.random() < 0.1;
      
      if (shouldAddNew) {
        const customerName = `Customer ${Math.floor(Math.random() * 100)}`;
        const newRequest: PickupRequest = {
          id: `new-${Date.now()}`,
          customerName,
          whatsappNumber: `+2547${Math.floor(Math.random() * 100000000)}`,
          items: ['New Strain (1g)', 'Papers'],
          pickupTime: 'anytime',
          status: 'new',
          createdAt: new Date().toISOString(),
          totalAmount: 1800
        };

        setPickupRequests(prev => [newRequest, ...prev]);
        
        // Play notification sound
        if (!isMuted && audioRef.current) {
          audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
        
        // Enhanced toast notification
        toast.success(`📦 New pickup request received from ${customerName}`, {
          description: "Click to view details",
          action: {
            label: "View",
            onClick: () => setSelectedRequest(newRequest),
          },
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isMuted]);

  // Welcome message on component mount
  useEffect(() => {
    toast.success('Welcome back, CHIZOH 👑', {
      description: 'Ready to manage your dispensary',
      duration: 4000,
    });
  }, []);

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
    
    // Mock role assignment - replace with actual Supabase role fetch
    const savedRole = localStorage.getItem('user_role') as 'admin' | 'assistant' | 'viewer';
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('user_role');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const updateRequestStatus = (id: string, status: 'seen' | 'ready') => {
    if (userRole === 'viewer') {
      toast.error('You do not have permission to edit requests');
      return;
    }
    
    setPickupRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status } : req
      )
    );
    toast.success(`Request marked as ${status}`);
  };

  const markAllRequestsAsSeen = () => {
    setPickupRequests(prev => 
      prev.map(req => 
        req.status === 'new' ? { ...req, status: 'seen' } : req
      )
    );
    toast.success('All requests marked as seen');
  };

  const handleNotificationRequestClick = (id: string) => {
    const request = pickupRequests.find(req => req.id === id);
    if (request) {
      setSelectedRequest(request);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? 'Notifications unmuted' : 'Notifications muted');
  };

  const handleGoogleAuth = () => {
    // Mock Google OAuth flow
    toast.success('Connected to Google Calendar successfully!');
    setIsGoogleConnected(true);
  };

  const disconnectGoogle = () => {
    setIsGoogleConnected(false);
    setAutoSyncEnabled(false);
    toast.info('Disconnected from Google Calendar');
  };

  const syncToGoogleCalendar = (request: PickupRequest) => {
    if (!isGoogleConnected) {
      toast.error('Please connect to Google Calendar first');
      return;
    }

    // Mock sync to Google Calendar
    const updatedRequests = pickupRequests.map(req => 
      req.id === request.id 
        ? { ...req, isGoogleSynced: true, lastSynced: new Date().toISOString() }
        : req
    );
    setPickupRequests(updatedRequests);
    toast.success(`Pickup synced to Google Calendar: ${request.customerName}`);
  };

  const filteredRequests = pickupRequests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.whatsappNumber.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const newRequestsCount = pickupRequests.filter(req => req.status === 'new').length;
  const thisWeekPickups = pickupRequests.length;
  const pendingCount = pickupRequests.filter(req => req.status === 'new').length;
  const confirmedCount = pickupRequests.filter(req => req.status === 'seen').length;
  const completedCount = pickupRequests.filter(req => req.status === 'ready').length;

  const sidebarItems = [
    { 
      name: 'Dashboard', 
      icon: BarChart3, 
      active: true,
      badge: newRequestsCount > 0 ? newRequestsCount : undefined,
      path: '/admin/dashboard'
    },
    { 
      name: 'Calendar', 
      icon: CalendarIcon, 
      active: false,
      path: '/admin/calendar'
    },
    { 
      name: 'Pickup Requests', 
      icon: FileText, 
      active: false,
      badge: newRequestsCount > 0 ? newRequestsCount : undefined,
      path: '/admin/dashboard'
    },
    { 
      name: 'Messages', 
      icon: MessageCircle, 
      active: false,
      path: '/admin/messages'
    },
    { 
      name: 'Ratings', 
      icon: Star, 
      active: false,
      path: '/admin/ratings'
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      active: false,
      path: '/admin/settings'
    }
  ];

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin': return 'bg-green-500';
      case 'assistant': return 'bg-blue-500';
      case 'viewer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background flex transition-colors duration-300">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card dark:bg-card border-r border-border dark:border-border transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                <Leaf className="text-primary-foreground" size={20} />
              </div>
              <div>
                <span className="font-bold text-foreground dark:text-foreground text-lg">Nature's Remedy</span>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
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

          {/* User Role Badge */}
          <div className="px-6 py-4">
            <div className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium text-white ${getRoleColor()}`}>
              <User size={14} className="mr-2" />
              {userRole.toUpperCase()} ACCESS
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.name}
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-12 rounded-xl"
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                >
                  <item.icon className="mr-3" size={20} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-2 rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </nav>

          {/* Google Calendar Integration */}
          <div className="p-4 border-t border-border dark:border-border">
            {!isGoogleConnected ? (
              <Button
                onClick={handleGoogleAuth}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
              >
                <CalendarIcon className="mr-2" size={16} />
                Connect Google Calendar
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Auto-Sync</span>
                  <Switch
                    checked={autoSyncEnabled}
                    onCheckedChange={setAutoSyncEnabled}
                  />
                </div>
                <Button
                  onClick={disconnectGoogle}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  Disconnect Calendar
                </Button>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-border dark:border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive rounded-xl h-12"
              onClick={handleLogout}
            >
              <LogOut className="mr-3" size={20} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 bg-card/95 dark:bg-card/95 backdrop-blur-sm border-b border-border dark:border-border">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground dark:text-foreground">
                  Welcome Chizoh 👑
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Ready to manage your dispensary
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <div className="hidden sm:flex items-center space-x-2">
                <Sun size={16} className="text-muted-foreground" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
                <Moon size={16} className="text-muted-foreground" />
              </div>
              
              {/* Notification Dropdown */}
              <NotificationDropdown
                requests={pickupRequests}
                onMarkAllSeen={markAllRequestsAsSeen}
                onRequestClick={handleNotificationRequestClick}
              />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-muted-foreground hover:text-foreground rounded-xl"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Pickup Overview Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-green-600/10 border-primary/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    This Week: {thisWeekPickups} Pickups
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-red-500 text-white">Pending: {pendingCount}</Badge>
                    <Badge className="bg-yellow-500 text-white">Confirmed: {confirmedCount}</Badge>
                    <Badge className="bg-green-500 text-white">Completed: {completedCount}</Badge>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="new">New</option>
                      <option value="seen">Seen</option>
                      <option value="ready">Ready</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card dark:bg-card border-border dark:border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">New Requests</p>
                    <p className="text-3xl font-bold text-foreground dark:text-foreground">{newRequestsCount}</p>
                  </div>
                  <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center">
                    <Clock className="text-red-500" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card border-border dark:border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Total Requests</p>
                    <p className="text-3xl font-bold text-foreground dark:text-foreground">{pickupRequests.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <FileText className="text-primary" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card border-border dark:border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Ready for Pickup</p>
                    <p className="text-3xl font-bold text-foreground dark:text-foreground">{completedCount}</p>
                  </div>
                  <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card border-border dark:border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Total Value</p>
                    <p className="text-3xl font-bold text-foreground dark:text-foreground">
                      KSh {pickupRequests.reduce((sum, req) => sum + req.totalAmount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                    <Package className="text-yellow-500" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pickup Requests Table */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-foreground text-xl">Recent Pickup Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <PickupRequestsTable
                requests={filteredRequests}
                onRequestClick={setSelectedRequest}
                onUpdateStatus={updateRequestStatus}
                userRole={userRole}
              />
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-card dark:bg-card border-t border-border dark:border-border p-4 text-center">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            Licensed Admin Area — Nature's Remedy © 2025
          </p>
        </footer>
      </div>

      {/* WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Request Detail Modal with Google Calendar Sync */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={updateRequestStatus}
          userRole={userRole}
          onSyncToGoogle={syncToGoogleCalendar}
          isGoogleConnected={isGoogleConnected}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
