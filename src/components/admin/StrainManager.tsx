import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Leaf, X, Save } from 'lucide-react';
import type { DbStrain } from '@/types/pickupRequest';
import { useAuth } from '@/context/AuthContext';

const STRAIN_TYPES = ['Indica', 'Sativa', 'Hybrid', 'Edibles', 'Accessories'] as const;

const emptyStrain = {
  name: '',
  type: 'Hybrid' as const,
  thc: '',
  price: 0,
  effects: '',
  description: '',
  flavor: '',
};

const StrainManager = () => {
  const { user } = useAuth();
  const [strains, setStrains] = useState<DbStrain[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyStrain);

  const loadStrains = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('strains')
      .select('*')
      .eq('seller_id', user.id)
      .order('name');
    if (data) setStrains(data);
    setLoading(false);
  };

  useEffect(() => { loadStrains(); }, [user]);

  const resetForm = () => {
    setForm(emptyStrain);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!user) { toast.error('Not authenticated'); return; }
    if (!form.name) { toast.error('Strain name is required'); return; }
    if (!form.price) { toast.error('Price is required'); return; }

    const payload = {
      seller_id: user.id,
      name: form.name,
      type: form.type,
      thc: form.thc || null,
      price: form.price,
      effects: form.effects ? form.effects.split(',').map(e => e.trim()) : [],
      description: form.description || '',
      flavor: form.flavor || '',
    };

    if (editingId) {
      const { error } = await supabase
        .from('strains')
        .update(payload)
        .eq('id', editingId);
      if (error) { toast.error('Failed to update strain'); return; }
      toast.success('Strain updated');
    } else {
      const { error } = await supabase
        .from('strains')
        .insert(payload);
      if (error) { toast.error('Failed to create strain'); return; }
      toast.success('Strain created');
    }

    resetForm();
    loadStrains();
  };

  const handleEdit = (strain: DbStrain) => {
    setForm({
      name: strain.name,
      type: strain.type,
      thc: strain.thc || '',
      price: strain.price,
      effects: strain.effects.join(', '),
      description: strain.description,
      flavor: strain.flavor || '',
    });
    setEditingId(strain.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('strains').delete().eq('id', id);
    if (error) { toast.error('Failed to delete strain'); return; }
    toast.success('Strain deleted');
    loadStrains();
  };

  const toggleAvailable = async (strain: DbStrain) => {
    const { error } = await supabase
      .from('strains')
      .update({ available: !strain.available })
      .eq('id', strain.id);
    if (error) { toast.error('Failed to update availability'); return; }
    loadStrains();
  };

  if (!user) return <p className="text-muted-foreground text-center py-8">Sign in to manage strains</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Strains</h3>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={16} className="mr-1" /> Add Strain
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{editingId ? 'Edit Strain' : 'New Strain'}</span>
              <Button variant="ghost" size="icon" onClick={resetForm}><X size={16} /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Blue Dream" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as typeof form.type })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STRAIN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price (KSh/g) *</Label>
                <Input type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>THC %</Label>
                <Input value={form.thc} onChange={e => setForm({ ...form, thc: e.target.value })} placeholder="18-24%" />
              </div>
              <div className="space-y-2">
                <Label>Flavor</Label>
                <Input value={form.flavor} onChange={e => setForm({ ...form, flavor: e.target.value })} placeholder="Sweet Berry" />
              </div>
              <div className="space-y-2">
                <Label>Effects (comma-separated)</Label>
                <Input value={form.effects} onChange={e => setForm({ ...form, effects: e.target.value })} placeholder="Euphoric, Creative, Relaxed" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="A popular hybrid with sweet berry flavors" />
            </div>
            <Button onClick={handleSave} className="w-full md:w-auto">
              <Save size={16} className="mr-1" /> {editingId ? 'Update' : 'Create'} Strain
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground text-center py-4">Loading strains...</p>
      ) : strains.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No strains yet. {!showForm && 'Click "Add Strain" to create your first one.'}
        </p>
      ) : (
        <div className="space-y-3">
          {strains.map(strain => (
            <div key={strain.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3 min-w-0">
                <Leaf size={20} className="text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{strain.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {strain.type} — KSh {strain.price}/g{strain.thc ? ` — THC ${strain.thc}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <Switch checked={strain.available} onCheckedChange={() => toggleAvailable(strain)} />
                <Button variant="ghost" size="icon" onClick={() => handleEdit(strain)}><Pencil size={14} /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(strain.id)} className="text-destructive"><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StrainManager;
