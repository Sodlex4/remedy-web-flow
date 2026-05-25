
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import RequestPickupModal from '@/components/RequestPickupModal';
import { strains, type Strain } from '@/data/strains';

const StrainSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedStrains, setSelectedStrains] = useState<Strain[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const filters = ['All', 'Indica', 'Sativa', 'Hybrid', 'Edibles', 'Accessories'];

  const filteredStrains = strains.filter(strain => {
    const matchesSearch = strain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strain.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strain.effects.some(effect => effect.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (strain.flavor && strain.flavor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'All' || strain.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const addToRequest = (strain: Strain) => {
    if (!selectedStrains.find(s => s.id === strain.id)) {
      setSelectedStrains([...selectedStrains, strain]);
    }
  };

  const removeFromRequest = (strainId: string) => {
    setSelectedStrains(selectedStrains.filter(s => s.id !== strainId));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Indica': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Sativa': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Hybrid': return 'bg-primary/20 text-primary border-primary/30';
      case 'Edibles': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Accessories': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Strain Explorer</h1>
              <p className="text-muted-foreground">Discover premium cannabis products</p>
            </div>
          </div>

          {/* Expanded Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search strain, product, type, or effect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg bg-card border-border text-foreground focus:border-primary"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={`whitespace-nowrap ${
                  selectedFilter === filter 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border hover:bg-primary/10'
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredStrains.length} {filteredStrains.length === 1 ? 'product' : 'products'} found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {filteredStrains.map((strain) => (
            <Card 
              key={strain.id} 
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-foreground group-hover:text-primary transition-colors text-lg">
                    {strain.name}
                  </CardTitle>
                  <Badge className={getTypeColor(strain.type)}>
                    {strain.type}
                  </Badge>
                </div>
                {strain.thc && (
                  <span className="text-sm text-muted-foreground">THC: {strain.thc}</span>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🌿</span>
                </div>
                
                <p className="text-muted-foreground text-sm">
                  {strain.description}
                </p>

                {strain.flavor && (
                  <p className="text-primary text-sm">
                    <span className="font-medium">Flavor:</span> {strain.flavor}
                  </p>
                )}
                
                {strain.effects.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {strain.effects.slice(0, 3).map((effect) => (
                      <span 
                        key={effect}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-primary font-semibold text-lg">
                  KSh {strain.price.toLocaleString()}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => addToRequest(strain)}
                  disabled={selectedStrains.some(s => s.id === strain.id)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus size={16} className="mr-2" />
                  {selectedStrains.some(s => s.id === strain.id) ? 'Added' : 'Request'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredStrains.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Legal Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              ⚠️ For adults 21+ only. Licensed dispensary. Pickup only. No online sales.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Request Button */}
      {selectedStrains.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setShowRequestModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-200 pl-4 pr-6 py-3 rounded-full"
            size="lg"
          >
            <ShoppingBag size={20} className="mr-2" />
            Request Pickup ({selectedStrains.length})
          </Button>
        </div>
      )}

      {/* Request Pickup Modal */}
      <RequestPickupModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        selectedStrains={selectedStrains}
        onRemoveStrain={removeFromRequest}
      />
    </div>
  );
};

export default StrainSearch;
