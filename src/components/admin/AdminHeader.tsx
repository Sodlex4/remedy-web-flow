
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Menu,
  Bell,
  Sun,
  Moon,
  VolumeX,
  Volume2
} from 'lucide-react';
import NotificationDropdown from '@/components/NotificationDropdown';
import { PickupRequest } from '@/types/pickupRequest';

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  unreadCount: number;
  loading: boolean;
  pickupRequests: PickupRequest[];
  onMarkAllSeen: () => void;
  onNotificationClick: (id: string) => void;
}

const AdminHeader = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isDarkMode,
  toggleTheme,
  isMuted,
  toggleMute,
  unreadCount,
  loading,
  pickupRequests,
  onMarkAllSeen,
  onNotificationClick
}: AdminHeaderProps) => {
  return (
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
            onMarkAllSeen={onMarkAllSeen}
            onRequestClick={onNotificationClick}
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
  );
};

export default AdminHeader;
