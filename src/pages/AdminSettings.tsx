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
import { useBusiness } from '@/context/BusinessContext';
import type { ContentSettings } from '@/context/BusinessContext';
import { toast } from 'sonner';
import { User, Bell, Palette, Users, Save, Leaf, Moon, Sun, Volume2, VolumeX, Calendar, Shield, FileText } from 'lucide-react';

const DEFAULT_SETTINGS: ContentSettings = {
  tagline: "Don't Panic, It's Organic",
  hero_welcome: "Welcome to {businessName}, your trusted licensed cannabis dispensary in {county}.",
  hero_description: "We're committed to providing premium, organic cannabis products with the highest standards of quality and compliance.",
  about_story: "{businessName} was founded on the belief that everyone deserves access to high-quality, natural cannabis products in a safe, welcoming environment. We're more than just a dispensary — we're your partners in wellness and advocates for responsible cannabis use.",
  about_features: [
    { title: 'Licensed & Compliant', description: 'Fully licensed cannabis dispensary operating in full compliance with local regulations.' },
    { title: 'Organic & Natural', description: 'Premium organic cannabis products sourced from trusted growers committed to sustainability.' },
    { title: 'Quality Assured', description: 'Every product is rigorously tested for potency, purity, and safety before reaching our shelves.' },
    { title: 'Expert Guidance', description: 'Our knowledgeable staff provides personalized recommendations for your wellness journey.' },
  ],
  about_compliance_text: "As a licensed cannabis dispensary, we take our responsibility seriously. We operate under strict compliance with all local and state regulations, ensuring every transaction is legal, documented, and conducted with the highest standards of professionalism.",
  address: '123 Main Street',
  store_hours: 'Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 11:00 AM - 5:00 PM',
  footer_mission: 'Your trusted licensed cannabis dispensary in {county}, committed to quality, compliance, and responsible cannabis education.',
  legal_disclaimer: 'All cannabis products are for medical or recreational use only where permitted by law. Cannabis has not been analyzed or approved by the FDA. You must be 21 years of age or older to purchase cannabis products. Please consume responsibly. Keep out of reach of children and pets. Do not operate vehicles or machinery after use. This website is for informational purposes only and does not constitute an e-commerce platform — no online sales are conducted here.',
  admin_welcome: 'Welcome back, {name} 👑',
};

const AdminSettings = () => {
  const { user } = useAuth();
  const { settings: loadedSettings } = useBusiness();

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '', email: '', businessName: '', whatsappNumber: '', county: '', bio: '',
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const [content, setContent] = useState<ContentSettings>(DEFAULT_SETTINGS);
  const [contentDirty, setContentDirty] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    pickupAlerts: true, soundEnabled: true, whatsappWidget: true, emailNotifications: true
  });

  const [displaySettings, setDisplaySettings] = useState({
    darkMode: true, autoSyncCalendar: false, compactView: false, animationsEnabled: true
  });

  const [adminUsers] = useState<{id: string; name: string; email: string; role: string}[]>([]);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('name, business_name, whatsapp_number, county, bio, role, settings')
      .eq('id', user.id)
      .single();
    if (data) {
      setProfileData(prev => ({
        ...prev, name: data.name || '', email: user.email || '',
        businessName: data.business_name || '', whatsappNumber: data.whatsapp_number || '',
        county: data.county || '', bio: data.bio || '',
      }));
      const saved = data.settings as Record<string, unknown> | null;
      if (saved && Object.keys(saved).length > 0) {
        setContent(prev => ({
          ...prev,
          ...saved,
          about_features: Array.isArray(saved.about_features)
            ? saved.about_features as { title: string; description: string }[]
            : prev.about_features,
        }));
      }
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
        toast.error('New passwords do not match'); return;
      }
      const { error: pwError } = await supabase.auth.updateUser({ password: profileData.newPassword });
      if (pwError) { toast.error('Failed to update password'); return; }
    }
    const { error } = await supabase.from('profiles').update({
      name: profileData.name, business_name: profileData.businessName,
      whatsapp_number: profileData.whatsappNumber, county: profileData.county, bio: profileData.bio,
    }).eq('id', user.id);
    if (error) { toast.error('Failed to save profile'); return; }
    toast.success('Profile updated successfully');
    setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const handleSaveContent = async () => {
    if (!user) { toast.error('Not authenticated'); return; }
    const { error } = await supabase.from('profiles').update({ settings: content }).eq('id', user.id);
    if (error) { toast.error('Failed to save content'); return; }
    toast.success('Content updated successfully');
    setContentDirty(false);
  };

  const handleSaveDisplay = () => {
    localStorage.setItem('theme', displaySettings.darkMode ? 'dark' : 'light');
    if (displaySettings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    toast.success('Display settings updated');
  };

  const updateFeature = (i: number, field: 'title' | 'description', value: string) => {
    setContent(prev => {
      const features = [...prev.about_features];
      features[i] = { ...features[i], [field]: value };
      return { ...prev, about_features: features };
    });
    setContentDirty(true);
  };

  const resetContentSection = (section: string) => {
    setContent(prev => ({
      ...prev,
      [section]: DEFAULT_SETTINGS[section as keyof ContentSettings],
    }));
    setContentDirty(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-green-500';
      case 'assistant': return 'bg-blue-500';
      case 'viewer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your business profile, content, and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex overflow-x-auto gap-1 w-full">
            <TabsTrigger value="profile"><User size={16} /><span className="ml-1">Profile</span></TabsTrigger>
            <TabsTrigger value="business"><Leaf size={16} /><span className="ml-1">Business</span></TabsTrigger>
            <TabsTrigger value="content"><FileText size={16} /><span className="ml-1">Content</span></TabsTrigger>
            <TabsTrigger value="strains"><Leaf size={16} /><span className="ml-1">Strains</span></TabsTrigger>
            <TabsTrigger value="notifications"><Bell size={16} /><span className="ml-1">Notifs</span></TabsTrigger>
            <TabsTrigger value="display"><Palette size={16} /><span className="ml-1">Display</span></TabsTrigger>
            <TabsTrigger value="users"><Users size={16} /><span className="ml-1">Users</span></TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle><User className="mr-2 inline" size={20} />Profile Settings</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? <p className="text-muted-foreground">Loading...</p> : <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Your Name</Label><Input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} /></div>
                    <div className="space-y-2"><Label>Email</Label><Input value={profileData.email} disabled className="opacity-60" /></div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>New Password</Label><Input type="password" value={profileData.newPassword} onChange={e => setProfileData(p => ({ ...p, newPassword: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Confirm</Label><Input type="password" value={profileData.confirmPassword} onChange={e => setProfileData(p => ({ ...p, confirmPassword: e.target.value }))} /></div>
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile}><Save className="mr-2" size={16} />Save Profile Changes</Button>
                </>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader><CardTitle><Leaf className="mr-2 inline" size={20} />Business Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? <p className="text-muted-foreground">Loading...</p> : <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Business Name</Label><Input value={profileData.businessName} onChange={e => setProfileData(p => ({ ...p, businessName: e.target.value }))} /></div>
                    <div className="space-y-2"><Label>WhatsApp Number</Label><Input value={profileData.whatsappNumber} onChange={e => setProfileData(p => ({ ...p, whatsappNumber: e.target.value }))} /></div>
                    <div className="space-y-2"><Label>County</Label><Input value={profileData.county} onChange={e => setProfileData(p => ({ ...p, county: e.target.value }))} /></div>
                  </div>
                  <div className="space-y-2"><Label>Bio</Label><Textarea value={profileData.bio} onChange={e => setProfileData(p => ({ ...p, bio: e.target.value }))} rows={3} /></div>
                  <Button onClick={handleSaveProfile}><Save className="mr-2" size={16} />Save Business Info</Button>
                </>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle><FileText className="mr-2 inline" size={20} />Editable Content</CardTitle>
                <p className="text-sm text-muted-foreground">Use {'{businessName}'} and {'{county}'} as placeholders — they auto-fill. {'{name}'} works in the admin welcome.</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {profileLoading ? <p className="text-muted-foreground">Loading...</p> : <>
                  {/* Tagline */}
                  <Section label="Tagline" onReset={() => resetContentSection('tagline')}>
                    <Input value={content.tagline} onChange={e => { setContent(p => ({ ...p, tagline: e.target.value })); setContentDirty(true); }} />
                  </Section>

                  {/* Hero Section */}
                  <Section label="Hero Section">
                    <SubField label="Welcome Text"><Textarea value={content.hero_welcome} onChange={e => { setContent(p => ({ ...p, hero_welcome: e.target.value })); setContentDirty(true); }} rows={2} /></SubField>
                    <SubField label="Description"><Textarea value={content.hero_description} onChange={e => { setContent(p => ({ ...p, hero_description: e.target.value })); setContentDirty(true); }} rows={2} /></SubField>
                  </Section>

                  {/* About Section */}
                  <Section label="About Section">
                    <SubField label="Story"><Textarea value={content.about_story} onChange={e => { setContent(p => ({ ...p, about_story: e.target.value })); setContentDirty(true); }} rows={3} /></SubField>
                    <SubField label="Compliance Text"><Textarea value={content.about_compliance_text} onChange={e => { setContent(p => ({ ...p, about_compliance_text: e.target.value })); setContentDirty(true); }} rows={3} /></SubField>
                    <div className="space-y-3">
                      <Label>Feature Cards</Label>
                      {content.about_features.map((f, i) => (
                        <div key={i} className="p-3 border border-border rounded-lg space-y-2">
                          <Input value={f.title} onChange={e => updateFeature(i, 'title', e.target.value)} placeholder="Feature title" />
                          <Textarea value={f.description} onChange={e => updateFeature(i, 'description', e.target.value)} placeholder="Feature description" rows={2} />
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* Contact Section */}
                  <Section label="Contact Section">
                    <SubField label="Address"><Input value={content.address} onChange={e => { setContent(p => ({ ...p, address: e.target.value })); setContentDirty(true); }} /></SubField>
                    <SubField label="Store Hours"><Textarea value={content.store_hours} onChange={e => { setContent(p => ({ ...p, store_hours: e.target.value })); setContentDirty(true); }} rows={3} /></SubField>
                  </Section>

                  {/* Footer */}
                  <Section label="Footer">
                    <SubField label="Mission Text"><Textarea value={content.footer_mission} onChange={e => { setContent(p => ({ ...p, footer_mission: e.target.value })); setContentDirty(true); }} rows={2} /></SubField>
                    <SubField label="Legal Disclaimer"><Textarea value={content.legal_disclaimer} onChange={e => { setContent(p => ({ ...p, legal_disclaimer: e.target.value })); setContentDirty(true); }} rows={4} /></SubField>
                  </Section>

                  {/* Admin */}
                  <Section label="Admin Dashboard">
                    <SubField label="Welcome Message"><Input value={content.admin_welcome} onChange={e => { setContent(p => ({ ...p, admin_welcome: e.target.value })); setContentDirty(true); }} /></SubField>
                  </Section>

                  <div className="flex gap-3">
                    <Button onClick={handleSaveContent} disabled={!contentDirty}>
                      <Save className="mr-2" size={16} />Save Content Changes
                    </Button>
                    {contentDirty && <p className="text-sm text-muted-foreground self-center">Unsaved changes</p>}
                  </div>
                </>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strains">
            <Card>
              <CardHeader><CardTitle><Leaf className="mr-2 inline" size={20} />Manage Strains</CardTitle></CardHeader>
              <CardContent><StrainManager /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader><CardTitle><Bell className="mr-2 inline" size={20} />Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SwitchRow label="Real-time Pickup Alerts" description="Get notified when new pickup requests arrive" checked={notificationSettings.pickupAlerts} onChange={c => setNotificationSettings(p => ({ ...p, pickupAlerts: c }))} />
                  <SwitchRow label="Notification Sounds" description="Play sound when notifications arrive" checked={notificationSettings.soundEnabled} onChange={c => setNotificationSettings(p => ({ ...p, soundEnabled: c }))} />
                </div>
                <Button><Save className="mr-2" size={16} />Save</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display">
            <Card>
              <CardHeader><CardTitle><Palette className="mr-2 inline" size={20} />Display & Appearance</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SwitchRow label={displaySettings.darkMode ? 'Dark Mode' : 'Light Mode'} description="Toggle between light and dark themes" checked={displaySettings.darkMode} onChange={c => setDisplaySettings(p => ({ ...p, darkMode: c }))} />
                  <SwitchRow label="Auto-Sync Calendar" description="Automatically sync new pickups to Google Calendar" checked={displaySettings.autoSyncCalendar} onChange={c => setDisplaySettings(p => ({ ...p, autoSyncCalendar: c }))} />
                </div>
                <Button onClick={handleSaveDisplay}><Save className="mr-2" size={16} />Save Display Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle><Users className="mr-2 inline" size={20} />User Management</CardTitle></CardHeader>
              <CardContent>
                {adminUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">User management is available for super admin accounts.</p>
                ) : (
                  <div className="space-y-4">
                    {adminUsers.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"><Shield className="text-primary" size={20} /></div>
                          <div><p className="font-medium">{u.name}</p><p className="text-sm text-muted-foreground">{u.email}</p></div>
                        </div>
                        <Badge className={`${getRoleColor(u.role)} text-white`}>{u.role.toUpperCase()}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function Section({ label, children, onReset }: { label: string; children: React.ReactNode; onReset?: () => void }) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{label}</h3>
        {onReset && <Button variant="ghost" size="sm" onClick={onReset} className="text-xs text-muted-foreground">Reset</Button>}
      </div>
      {children}
    </div>
  );
}

function SubField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="text-sm text-muted-foreground">{label}</Label>{children}</div>;
}

function SwitchRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default AdminSettings;
