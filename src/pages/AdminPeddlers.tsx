import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Leaf, Pencil, Trash2, X, Save, Search, MapPin, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Peddler {
  id: string;
  business_name: string;
  whatsapp_number: string;
  county: string;
  bio: string;
  name: string;
  role: string;
  strain_count: number;
  request_count: number;
}

const AdminPeddlers = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [peddlers, setPeddlers] = useState<Peddler[]>([]);
  const [loading, setLoading] = useState(true);
  const [countyFilter, setCountyFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [counties, setCounties] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ business_name: '', whatsapp_number: '', county: '', bio: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loadPeddlers = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('id, business_name, whatsapp_number, county, bio, name, role')
      .not('business_name', 'eq', '')
      .order('business_name');

    if (countyFilter !== 'all') {
      query = query.eq('county', countyFilter);
    }

    const { data: profiles } = await query;

    if (profiles) {
      const withCounts = await Promise.all(
        profiles.map(async (p) => {
          const { count: sCount } = await supabase.from('strains').select('*', { count: 'exact', head: true }).eq('peddler_id', p.id);
          const { count: rCount } = await supabase.from('pickup_requests').select('*', { count: 'exact', head: true }).eq('peddler_id', p.id);
          return { ...p, strain_count: sCount || 0, request_count: rCount || 0 } as Peddler;
        })
      );
      setPeddlers(withCounts);
    }
    setLoading(false);
  }, [countyFilter]);

  const loadCounties = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('county').not('county', 'eq', '').not('business_name', 'eq', '');
    if (data) {
      const unique = [...new Set(data.map(p => p.county).filter(Boolean))].sort() as string[];
      setCounties(unique);
    }
  }, []);

  useEffect(() => { loadPeddlers(); }, [loadPeddlers]);
  useEffect(() => { loadCounties(); }, [loadCounties]);

  if (!user || role !== 'admin') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Shield size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">Only super admin accounts can manage peddlers.</p>
          <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const startEdit = (p: Peddler) => {
    setEditForm({ business_name: p.business_name, whatsapp_number: p.whatsapp_number, county: p.county, bio: p.bio || '' });
    setEditingId(p.id);
  };

  const handleSave = async () => {
    if (!editingId) return;
    const { error } = await supabase.from('profiles').update(editForm).eq('id', editingId);
    if (error) { toast.error('Failed to update peddler'); return; }
    toast.success('Peddler updated');
    setEditingId(null);
    loadPeddlers();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ business_name: '', county: '', whatsapp_number: '', bio: '' }).eq('id', id);
    if (error) { toast.error('Failed to remove peddler'); return; }
    toast.success('Peddler removed (profile cleared)');
    setShowDeleteConfirm(null);
    loadPeddlers();
  };

  const filteredPeddlers = peddlers.filter(p =>
    p.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Peddler Management</h1>
            <p className="text-muted-foreground">{peddlers.length} peddler{peddlers.length !== 1 ? 's' : ''} across {counties.length} count{counties.length !== 1 ? 'ies' : 'y'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={countyFilter} onValueChange={setCountyFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Counties" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {counties.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search peddlers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading peddlers...</p>
        ) : filteredPeddlers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No peddlers found</h3>
              <p className="text-muted-foreground">Peddlers appear here once they set their business name in Settings.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPeddlers.map(peddler => (
              <Card key={peddler.id} className="border-border">
                <CardContent className="p-6">
                  {editingId === peddler.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Editing: {peddler.business_name}</h3>
                        <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X size={16} /></Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Business Name</Label><Input value={editForm.business_name} onChange={e => setEditForm(f => ({ ...f, business_name: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>WhatsApp</Label><Input value={editForm.whatsapp_number} onChange={e => setEditForm(f => ({ ...f, whatsapp_number: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>County</Label><Input value={editForm.county} onChange={e => setEditForm(f => ({ ...f, county: e.target.value }))} /></div>
                      </div>
                      <div className="space-y-2"><Label>Bio</Label><Textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} rows={2} /></div>
                      <Button onClick={handleSave}><Save size={16} className="mr-1" /> Save</Button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 min-w-0">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                          <Leaf size={24} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{peddler.business_name}</h3>
                            <Badge variant="outline" className="text-xs">{peddler.role.toUpperCase()}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <MapPin size={12} className="inline mr-1" />{peddler.county}
                          </p>
                          <p className="text-sm text-muted-foreground">{peddler.name || 'No name set'}</p>
                          {peddler.bio && <p className="text-sm text-muted-foreground mt-1">{peddler.bio}</p>}
                          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{peddler.strain_count} strains</span>
                            <span>{peddler.request_count} pickup requests</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(peddler)} aria-label="Edit peddler"><Pencil size={14} /></Button>
                        {showDeleteConfirm === peddler.id ? (
                          <div className="flex items-center space-x-1">
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(peddler.id)}>Confirm</Button>
                            <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(peddler.id)} className="text-destructive" aria-label="Delete peddler"><Trash2 size={14} /></Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader><CardTitle className="text-base">Add New Peddler</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              To add a new peddler, create a user account in the Supabase Dashboard (Authentication → Users → Invite), 
              then have them log in and set their business profile in Settings → Business tab. They will appear here automatically.
            </p>
            <Button variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/vjowjaomtrhyzwidcatz/auth/users', '_blank')}>
              Open Supabase Auth Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPeddlers;
