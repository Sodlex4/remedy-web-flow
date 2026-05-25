
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bell, 
  Palette, 
  Users, 
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Calendar,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'assistant' | 'viewer';
  lastActive: string;
}

const AdminSettings = () => {
  const [profileData, setProfileData] = useState({
    name: 'Chizoh',
    email: 'admin@naturesremedy.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    pickupAlerts: true,
    soundEnabled: true,
    whatsappWidget: true,
    emailNotifications: true
  });

  const [displaySettings, setDisplaySettings] = useState({
    darkMode: true,
    autoSyncCalendar: false,
    compactView: false,
    animationsEnabled: true
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Chizoh (You)',
      email: 'admin@naturesremedy.com',
      role: 'admin',
      lastActive: '2025-01-21T15:30:00Z'
    },
    {
      id: '2',
      name: 'Assistant Manager',
      email: 'assistant@naturesremedy.com',
      role: 'assistant',
      lastActive: '2025-01-21T10:15:00Z'
    }
  ]);

  const handleSaveProfile = () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // Mock save to Supabase
    toast.success('Profile updated successfully');
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleSaveNotifications = () => {
    // Mock save to Supabase
    toast.success('Notification settings updated');
  };

  const handleSaveDisplay = () => {
    // Mock save to Supabase
    localStorage.setItem('theme', displaySettings.darkMode ? 'dark' : 'light');
    
    if (displaySettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success('Display settings updated');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-green-500';
      case 'assistant': return 'bg-blue-500';
      case 'viewer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'assistant': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your admin dashboard preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex overflow-x-auto gap-1 w-full">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center space-x-2">
              <Palette size={16} />
              <span>Display</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users size={16} />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" size={20} />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                  <Save className="mr-2" size={16} />
                  Save Profile Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2" size={20} />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center">
                        <Bell className="mr-2" size={16} />
                        Real-time Pickup Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new pickup requests arrive
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pickupAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, pickupAlerts: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center">
                        {notificationSettings.soundEnabled ? (
                          <Volume2 className="mr-2" size={16} />
                        ) : (
                          <VolumeX className="mr-2" size={16} />
                        )}
                        Notification Sounds
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound when notifications arrive
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.soundEnabled}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, soundEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>WhatsApp Widget Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Show WhatsApp contact widget on landing page
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.whatsappWidget}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, whatsappWidget: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                  <Save className="mr-2" size={16} />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Settings */}
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2" size={20} />
                  Display & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center">
                        {displaySettings.darkMode ? (
                          <Moon className="mr-2" size={16} />
                        ) : (
                          <Sun className="mr-2" size={16} />
                        )}
                        Dark Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <Switch
                      checked={displaySettings.darkMode}
                      onCheckedChange={(checked) => 
                        setDisplaySettings(prev => ({ ...prev, darkMode: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center">
                        <Calendar className="mr-2" size={16} />
                        Auto-Sync Calendar
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically sync new pickups to Google Calendar
                      </p>
                    </div>
                    <Switch
                      checked={displaySettings.autoSyncCalendar}
                      onCheckedChange={(checked) => 
                        setDisplaySettings(prev => ({ ...prev, autoSyncCalendar: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Compact View</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact layout for tables and lists
                      </p>
                    </div>
                    <Switch
                      checked={displaySettings.compactView}
                      onCheckedChange={(checked) => 
                        setDisplaySettings(prev => ({ ...prev, compactView: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch
                      checked={displaySettings.animationsEnabled}
                      onCheckedChange={(checked) => 
                        setDisplaySettings(prev => ({ ...prev, animationsEnabled: checked }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSaveDisplay} className="w-full md:w-auto">
                  <Save className="mr-2" size={16} />
                  Save Display Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" size={20} />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Shield className="text-primary" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          className={`${getRoleColor(user.role)} text-white`}
                          variant={getRoleBadgeVariant(user.role)}
                        >
                          {user.role.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Last active: {new Date(user.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Role Permissions</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Admin:</strong> Full access to all features</p>
                    <p><strong>Assistant:</strong> Can view and manage pickup requests</p>
                    <p><strong>Viewer:</strong> Read-only access to dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
