
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
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PickupRequestsTable from '@/components/PickupRequestsTable';
import RequestDetailModal from '@/components/RequestDetailModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';

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

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isMuted, setIsMuted] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'assistant' | 'viewer'>('admin');
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? 'Notifications unmuted' : 'Notifications muted');
  };

  const newRequestsCount = pickupRequests.filter(req => req.status === 'new').length;
  const filteredRequests = filterStatus === 'all' 
    ? pickupRequests 
    : pickupRequests.filter(req => req.status === filterStatus);

  const sidebarItems = [
    { 
      name: 'Pickup Requests', 
      icon: FileText, 
      active: true,
      badge: newRequestsCount > 0 ? newRequestsCount : undefined,
      path: '/admin/dashboard'
    },
    { 
      name: 'Calendar View', 
      icon: CalendarIcon, 
      active: false,
      path: '/admin/calendar'
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      active: false,
      path: '/admin/settings'
    },
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

          {/* User Role Badge */}
          <div className="px-4 py-2">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor()}`}>
              <User size={12} className="mr-1" />
              {userRole.toUpperCase()}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.name}
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => item.path && navigate(item.path)}
                >
                  <item.icon className="mr-3" size={18} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border dark:border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-3" size={18} />
              Logout
            </Button>
          </div>
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
              <h1 className="text-xl font-semibold text-foreground dark:text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <div className="flex items-center space-x-2">
                <Sun size={16} className="text-muted-foreground" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
                <Moon size={16} className="text-muted-foreground" />
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-muted-foreground hover:text-foreground"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
              <span className="text-muted-foreground">Welcome, Chizoh</span>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="text-primary-foreground" size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Welcome Banner */}
          {welcomeVisible && (
            <div className="mb-8 bg-gradient-to-r from-primary/20 to-green-600/20 dark:from-primary/20 dark:to-green-600/20 rounded-lg p-6 border border-primary/30 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
                    WELCOME CHIZOH 👋
                  </h1>
                  <p className="text-lg text-muted-foreground dark:text-muted-foreground">
                    {newRequestsCount > 0 
                      ? `You've got ${newRequestsCount} new pickup requests waiting` 
                      : "All caught up! Here's your overview for today"
                    }
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setWelcomeVisible(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">New Requests</p>
                    <p className="text-2xl font-bold text-foreground dark:text-foreground">{newRequestsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                    <Clock className="text-destructive" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Total Requests</p>
                    <p className="text-2xl font-bold text-foreground dark:text-foreground">{pickupRequests.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <FileText className="text-primary" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Ready for Pickup</p>
                    <p className="text-2xl font-bold text-foreground dark:text-foreground">
                      {pickupRequests.filter(r => r.status === 'ready').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-foreground dark:text-foreground">
                      KSh {pickupRequests.reduce((sum, req) => sum + req.totalAmount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Package className="text-yellow-500" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pickup Requests Table */}
          <Card className="bg-card dark:bg-card border-border dark:border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle className="text-foreground dark:text-foreground">Pickup Requests</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {['all', 'new', 'seen', 'ready'].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
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

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={updateRequestStatus}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
