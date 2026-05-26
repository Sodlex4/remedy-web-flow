import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import StrainManager from '@/components/admin/StrainManager';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { User, Bell, Palette, Users, Save, Leaf, Moon, Sun, Volume2, VolumeX, Calendar, Shield } from 'lucide-react';

const AdminSettings = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    businessName: '',
    whatsappNumber: '',
    county: '',
    bio: '',
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

  const [adminUsers, setAdminUsers] = useState<{id: string; name: string; email: string; role: string; lastActive: string}[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('name, business_name, whatsapp_number, county, bio, role')
      .eq('id', user.id)
      .single();
    if (data) {
      setProfileData(prev => ({
        ...prev,
        name: data.name || '',
        email: user.email || '',
        businessName: data.business_name || '',
        whatsappNumber: data.whatsapp_number || '',
        county: data.county || '',
        bio: data.bio || '',
      }));
    }
    setProfileLoading(false);
  }, [user]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDisplaySettings(prev => ({ ...prev, darkMode: savedTheme !== 'light' }));
  }, []);

  const handleSaveProfile = async () => {
    if (!user) { toast.error('Not authenticated'); return; }

    if (profileData.newPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      const { error: pwError } = await supabase.auth.updateUser({ password: profileData.newPassword });
      if (pwError) { toast.error('Failed to update password'); return; }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        business_name: profileData.businessName,
        whatsapp_number: profileData.whatsappNumber,
        county: profileData.county,
        bio: profileData.bio,
      })
      .eq('id', user.id);

    if (error) { toast.error('Failed to save profile'); return; }
    toast.success('Profile updated successfully');
    setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const handleSaveDisplay = () => {
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your business profile and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex overflow-x-auto gap-1 w-full">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center space-x-2">
              <Leaf size={16} />
              <span>Business</span>
            </TabsTrigger>
            <TabsTrigger value="strains" className="flex items-center space-x-2">
              <Leaf size={16} />
              <span>Strains</span>
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

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" size={20} />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? (
                  <p className="text-muted-foreground">Loading profile...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" value={profileData.name} onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={profileData.email} disabled className="opacity-60" />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" value={profileData.newPassword} onChange={e => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" value={profileData.confirmPassword} onChange={e => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                      <Save className="mr-2" size={16} />
                      Save Profile Changes
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2" size={20} />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? (
                  <p className="text-muted-foreground">Loading business info...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input id="businessName" value={profileData.businessName} onChange={e => setProfileData(prev => ({ ...prev, businessName: e.target.value }))} placeholder="Nature's Remedy" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                        <Input id="whatsappNumber" value={profileData.whatsappNumber} onChange={e => setProfileData(prev => ({ ...prev, whatsappNumber: e.target.value }))} placeholder="254700000000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="county">County / Service Area</Label>
                        <Input id="county" value={profileData.county} onChange={e => setProfileData(prev => ({ ...prev, county: e.target.value }))} placeholder="Murang'a County" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / Description</Label>
                      <Textarea id="bio" value={profileData.bio} onChange={e => setProfileData(prev => ({ ...prev, bio: e.target.value }))} placeholder="Your trusted licensed cannabis dispensary..." rows={3} />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                      <Save className="mr-2" size={16} />
                      Save Business Info
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strains">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2" size={20} />
                  Manage Strains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StrainManager />
              </CardContent>
            </Card>
          </TabsContent>

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
                      <Label className="flex items-center"><Bell className="mr-2" size={16} />Real-time Pickup Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new pickup requests arrive</p>
                    </div>
                    <Switch checked={notificationSettings.pickupAlerts} onCheckedChange={checked => setNotificationSettings(prev => ({ ...prev, pickupAlerts: checked }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center">{notificationSettings.soundEnabled ? <Volume2 className="mr-2" size={16} /> : <VolumeX className="mr-2" size={16} />}Notification Sounds</Label>
                      <p className="text-sm text-muted-foreground">Play sound when notifications arrive</p>
                    </div>
                    <Switch checked={notificationSettings.soundEnabled} onCheckedChange={checked => setNotificationSettings(prev => ({ ...prev, soundEnabled: checked }))} />
                  </div>
                </div>
                <Button className="w-full md:w-auto"><Save className="mr-2" size={16} />Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

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
                      <Label className="flex items-center">{displaySettings.darkMode ? <Moon className="mr-2" size={16} /> : <Sun className="mr-2" size={16} />}Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                    <Switch checked={displaySettings.darkMode} onCheckedChange={checked => setDisplaySettings(prev => ({ ...prev, darkMode: checked }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center"><Calendar className="mr-2" size={16} />Auto-Sync Calendar</Label>
                      <p className="text-sm text-muted-foreground">Automatically sync new pickups to Google Calendar</p>
                    </div>
                    <Switch checked={displaySettings.autoSyncCalendar} onCheckedChange={checked => setDisplaySettings(prev => ({ ...prev, autoSyncCalendar: checked }))} />
                  </div>
                </div>
                <Button onClick={handleSaveDisplay} className="w-full md:w-auto"><Save className="mr-2" size={16} />Save Display Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

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
                  {adminUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"><Shield className="text-primary" size={20} /></div>
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getRoleColor(u.role)} text-white`} variant={getRoleBadgeVariant(u.role)}>{u.role.toUpperCase()}</Badge>
                      </div>
                    </div>
                  ))}
                  {adminUsers.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">User management is available for super admin accounts.</p>
                  )}
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
