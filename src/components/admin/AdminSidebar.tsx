
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  X, 
  Leaf, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  BarChart3,
  Calendar as CalendarIcon,
  MessageCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  userRole: 'admin' | 'assistant' | 'viewer';
  newRequestsCount: number;
  isGoogleConnected: boolean;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
  onGoogleAuth: () => void;
  onDisconnectGoogle: () => void;
  onLogout: () => void;
}

const AdminSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  userRole,
  newRequestsCount,
  isGoogleConnected,
  autoSyncEnabled,
  setAutoSyncEnabled,
  onGoogleAuth,
  onDisconnectGoogle,
  onLogout
}: AdminSidebarProps) => {
  const navigate = useNavigate();

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
              onClick={onGoogleAuth}
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
                onClick={onDisconnectGoogle}
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
            onClick={onLogout}
          >
            <LogOut className="mr-3" size={20} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
