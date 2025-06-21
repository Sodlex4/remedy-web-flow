
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PickupRequestsTable from '@/components/PickupRequestsTable';
import RequestDetailModal from '@/components/RequestDetailModal';

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
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications
  useEffect(() => {
    // Create audio element for pop sound
    audioRef.current = new Audio('/sounds/pop.mp3');
    audioRef.current.volume = 0.6;
    
    // Fallback to system notification sound if file doesn't exist
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

  // Simulate real-time updates (replace with Supabase subscription)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a new request coming in (for demo purposes)
      const shouldAddNew = Math.random() < 0.1; // 10% chance every 30 seconds
      
      if (shouldAddNew) {
        const newRequest: PickupRequest = {
          id: `new-${Date.now()}`,
          customerName: `Customer ${Math.floor(Math.random() * 100)}`,
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
        
        // Show toast notification
        toast.success(`🛎️ New Pickup Request from ${newRequest.customerName}`);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isMuted]);

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const updateRequestStatus = (id: string, status: 'seen' | 'ready') => {
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
      badge: newRequestsCount > 0 ? newRequestsCount : undefined
    },
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="text-primary-foreground" size={16} />
              </div>
              <span className="font-bold text-foreground">Nature's Remedy</span>
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
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.name}
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
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
          <div className="p-4 border-t border-border">
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
        <header className="bg-card border-b border-border p-4">
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
              <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
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
            <div className="mb-8 bg-gradient-to-r from-primary/20 to-green-600/20 rounded-lg p-6 border border-primary/30 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    WELCOME CHIZOH 👋
                  </h1>
                  <p className="text-lg text-muted-foreground">
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
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">New Requests</p>
                    <p className="text-2xl font-bold text-foreground">{newRequestsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                    <Clock className="text-destructive" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Requests</p>
                    <p className="text-2xl font-bold text-foreground">{pickupRequests.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <FileText className="text-primary" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Ready for Pickup</p>
                    <p className="text-2xl font-bold text-foreground">
                      {pickupRequests.filter(r => r.status === 'ready').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-foreground">
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
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle className="text-foreground">Pickup Requests</CardTitle>
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
              />
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
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

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={updateRequestStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
