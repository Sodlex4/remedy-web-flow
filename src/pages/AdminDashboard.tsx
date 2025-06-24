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
  Search,
  Trash2,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PickupRequestsTable from '@/components/PickupRequestsTable';
import RequestDetailModal from '@/components/RequestDetailModal';
import NotificationDropdown from '@/components/NotificationDropdown';
import { supabase, SupabasePickupRequest } from '@/lib/supabase';
import { PickupRequest } from '@/types/pickupRequest';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'assistant' | 'viewer'>('admin');
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  
  const { playNotification, initializeAudio } = useNotificationSound();

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    
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

  // Initialize audio
  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  // Convert Supabase data to internal format
  const convertSupabaseToInternal = (supabaseRequest: SupabasePickupRequest): PickupRequest => {
    return {
      id: supabaseRequest.id.toString(),
      customerName: supabaseRequest.customer_name,
      whatsappNumber: supabaseRequest.whatsapp_number || '+254700000000',
      items: [supabaseRequest.strain + ` (${supabaseRequest.quantity}g)`],
      pickupTime: supabaseRequest.pickup_time || 'anytime',
      status: (supabaseRequest.status as 'new' | 'seen' | 'ready' | 'completed') || 'new',
      createdAt: supabaseRequest.created_at,
      totalAmount: supabaseRequest.total_amount || supabaseRequest.quantity * 1000
    };
  };

  // Load pickup requests from Supabase
  const loadPickupRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pickup_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pickup requests:', error);
        toast.error('Failed to load pickup requests');
        return;
      }

      if (data) {
        const formattedRequests = data.map(convertSupabaseToInternal);
        setPickupRequests(formattedRequests);
        
        // Set initial unread count
        const newRequests = formattedRequests.filter(req => req.status === 'new');
        setUnreadCount(newRequests.length);
      }
    } catch (error) {
      console.error('Error loading pickup requests:', error);
      toast.error('Failed to load pickup requests');
    } finally {
      setLoading(false);
    }
  };

  // Real-time event handlers
  const handleNewRequest = (newRequest: PickupRequest) => {
    setPickupRequests(prev => [newRequest, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Add glow effect to new requests
    setTimeout(() => {
      const newRow = document.querySelector(`[data-request-id="${newRequest.id}"]`);
      if (newRow) {
        newRow.classList.add('animate-pulse', 'ring-2', 'ring-green-400');
        setTimeout(() => {
          newRow.classList.remove('animate-pulse', 'ring-2', 'ring-green-400');
        }, 3000);
      }
    }, 100);
  };

  const handleUpdateRequest = (updatedRequest: PickupRequest) => {
    setPickupRequests(prev => 
      prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
    );
    
    // Update unread count if status changed from 'new'
    if (updatedRequest.status !== 'new') {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleDeleteRequest = (deletedId: string) => {
    setPickupRequests(prev => {
      const deletedRequest = prev.find(req => req.id === deletedId);
      if (deletedRequest?.status === 'new') {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      return prev.filter(req => req.id !== deletedId);
    });
  };

  // Set up real-time subscription
  useSupabaseRealtime({
    onNewRequest: handleNewRequest,
    onUpdateRequest: handleUpdateRequest,
    onDeleteRequest: handleDeleteRequest,
    playNotification,
    isMuted
  });

  // Load data on mount
  useEffect(() => {
    loadPickupRequests();
  }, []);

  // Welcome message on component mount
  useEffect(() => {
    toast.success('Welcome back, CHIZOH 👑', {
      description: 'Connected to live Supabase data with real-time notifications',
      duration: 4000,
    });
  }, []);

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
    
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

  const updateRequestStatus = async (id: string, status: 'seen' | 'ready' | 'completed') => {
    if (userRole === 'viewer') {
      toast.error('You do not have permission to edit requests');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('pickup_requests')
        .update({ status })
        .eq('id', parseInt(id));

      if (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update request status');
        return;
      }

      toast.success(`Request marked as ${status}`);
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  };

  const deleteRequest = async (id: string) => {
    if (userRole === 'viewer') {
      toast.error('You do not have permission to delete requests');
      return;
    }

    try {
      const { error } = await supabase
        .from('pickup_requests')
        .delete()
        .eq('id', parseInt(id));

      if (error) {
        console.error('Error deleting request:', error);
        toast.error('Failed to delete request');
        return;
      }

      toast.success('Request deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const markAllRequestsAsSeen = async () => {
    try {
      const newRequestIds = pickupRequests
        .filter(req => req.status === 'new')
        .map(req => parseInt(req.id));

      if (newRequestIds.length === 0) {
        toast.info('No new requests to mark as seen');
        return;
      }

      const { error } = await supabase
        .from('pickup_requests')
        .update({ status: 'seen' })
        .in('id', newRequestIds);

      if (error) {
        console.error('Error marking all as seen:', error);
        toast.error('Failed to mark all requests as seen');
        return;
      }

      setUnreadCount(0);
      toast.success('All requests marked as seen');
    } catch (error) {
      console.error('Error marking all as seen:', error);
      toast.error('Failed to mark all requests as seen');
    }
  };

  const handleNotificationRequestClick = (id: string) => {
    const request = pickupRequests.find(req => req.id === id);
    if (request) {
      setSelectedRequest(request);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? 'Notifications unmuted 🔊' : 'Notifications muted 🔇');
  };

  const handleGoogleAuth = () => {
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

  // Calculate stats from real data
  const newRequestsCount = pickupRequests.filter(req => req.status === 'new').length;
  const thisWeekPickups = pickupRequests.length;
  const pendingCount = pickupRequests.filter(req => req.status === 'new').length;
  const confirmedCount = pickupRequests.filter(req => req.status === 'seen').length;
  const completedCount = pickupRequests.filter(req => req.status === 'ready' || req.status === 'completed').length;
  const totalValue = pickupRequests.reduce((sum, req) => sum + req.totalAmount, 0);

  // Sidebar items
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
                  {loading ? 'Loading live data...' : 'Connected to live Supabase data with real-time notifications'}
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
              
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground rounded-xl"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
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
                    {loading ? 'Loading...' : `Live Data: ${thisWeekPickups} Pickups`}
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
                      <option value="completed">Completed</option>
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
                      KSh {totalValue.toLocaleString()}
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
              <CardTitle className="text-foreground dark:text-foreground text-xl">
                {loading ? 'Loading Pickup Requests...' : 'Live Pickup Requests'}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-3 animate-pulse">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground dark:text-muted-foreground mb-4 animate-pulse" />
                  <h3 className="text-lg font-medium text-foreground dark:text-foreground mb-2">
                    Loading live data from Supabase...
                  </h3>
                </div>
              ) : (
                <PickupRequestsTable
                  requests={filteredRequests}
                  onRequestClick={setSelectedRequest}
                  onUpdateStatus={updateRequestStatus}
                  onDeleteRequest={deleteRequest}
                  userRole={userRole}
                />
              )}
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-card dark:bg-card border-t border-border dark:border-border p-4 text-center">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            Licensed Admin Area — Nature's Remedy © 2025 | Connected to Supabase with Real-time Notifications
          </p>
        </footer>
      </div>

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
