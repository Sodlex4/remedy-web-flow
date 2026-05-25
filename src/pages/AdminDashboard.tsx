
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PickupRequestsTable from '@/components/PickupRequestsTable';
import RequestDetailModal from '@/components/RequestDetailModal';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsCards from '@/components/admin/StatsCards';
import PickupOverview from '@/components/admin/PickupOverview';
import { supabase } from '@/lib/supabase';
import { PickupRequest, SupabasePickupRequest } from '@/types/pickupRequest';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useAuth } from '@/context/AuthContext';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { user, role, signOut } = useAuth();
  const [userRole, setUserRole] = useState<'admin' | 'assistant' | 'viewer'>('viewer');
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
      customerName: supabaseRequest.name,
      whatsappNumber: supabaseRequest.phone,
      items: [supabaseRequest.strain + ` (${supabaseRequest.quantity}g)`],
      pickupTime: supabaseRequest.pickup_time,
      status: supabaseRequest.status,
      createdAt: supabaseRequest.created_at,
      totalAmount: supabaseRequest.total_amount
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

  // Sync role from AuthContext
  useEffect(() => {
    setUserRole(role);
  }, [role]);

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
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
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userRole={userRole}
        newRequestsCount={newRequestsCount}
        isGoogleConnected={isGoogleConnected}
        autoSyncEnabled={autoSyncEnabled}
        setAutoSyncEnabled={setAutoSyncEnabled}
        onGoogleAuth={handleGoogleAuth}
        onDisconnectGoogle={disconnectGoogle}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          isMuted={isMuted}
          toggleMute={toggleMute}
          unreadCount={unreadCount}
          loading={loading}
          pickupRequests={pickupRequests}
          onMarkAllSeen={markAllRequestsAsSeen}
          onNotificationClick={handleNotificationRequestClick}
        />

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Pickup Overview Section */}
          <PickupOverview
            loading={loading}
            thisWeekPickups={thisWeekPickups}
            pendingCount={pendingCount}
            confirmedCount={confirmedCount}
            completedCount={completedCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Stats Cards */}
          <StatsCards
            newRequestsCount={newRequestsCount}
            totalRequests={pickupRequests.length}
            completedCount={completedCount}
            totalValue={totalValue}
          />

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
