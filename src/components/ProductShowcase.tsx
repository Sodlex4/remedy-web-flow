import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useLocation } from '@/context/LocationContext';

interface StrainItem {
  name: string;
  description: string;
  effects: string[];
  type: string;
}

const ProductShowcase = () => {
  const { selectedPeddlerId } = useLocation();
  const [strains, setStrains] = useState<StrainItem[]>([]);

  useEffect(() => {
    const query = supabase
      .from('strains')
      .select('name, description, effects, type')
      .eq('available', true)
      .limit(4)
      .order('name');

    if (selectedPeddlerId) {
      query.eq('peddler_id', selectedPeddlerId);
    }

    query.then(({ data }) => {
      if (data && data.length > 0) {
        setStrains(data);
      }
    });
  }, [selectedPeddlerId]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Indica': return 'bg-purple-500/20 text-purple-300';
      case 'Sativa': return 'bg-orange-500/20 text-orange-300';
      case 'Hybrid': return 'bg-primary/20 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section id="shop" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-primary">Strains</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of premium cannabis strains, 
            each chosen for their unique characteristics and therapeutic benefits.
          </p>
        </div>

        {strains.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strains.map(strain => (
              <Card key={strain.name} className="bg-card border-border hover:border-primary/50 transition-all duration-300 group hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                      {strain.name}
                    </CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(strain.type)}`}>
                      {strain.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {strain.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {strain.effects.map(effect => (
                      <span key={effect} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {effect}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Granddaddy Purple", description: "A classic indica strain known for its deep relaxation effects and grape-like aroma.", effects: ["Relaxing", "Sleep Aid", "Pain Relief"], type: "Indica" },
              { name: "Girl Scout Cookies", description: "A balanced hybrid offering euphoric effects with sweet and earthy flavors.", effects: ["Euphoric", "Creative", "Social"], type: "Hybrid" },
              { name: "Sour Diesel", description: "An energizing sativa strain with a pungent, fuel-like aroma.", effects: ["Energizing", "Focus", "Uplifting"], type: "Sativa" },
              { name: "Blue Dream", description: "California's most popular hybrid, offering balanced effects with sweet berry flavors.", effects: ["Balanced", "Gentle", "Versatile"], type: "Hybrid" },
            ].map(strain => (
              <Card key={strain.name} className="bg-card border-border hover:border-primary/50 transition-all duration-300 group hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-foreground group-hover:text-primary transition-colors">{strain.name}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(strain.type)}`}>{strain.type}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{strain.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {strain.effects.map(effect => (
                      <span key={effect} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{effect}</span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Visit our dispensary to explore our full selection and speak with our knowledgeable staff.
          </p>
          <Button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary hover:bg-secondary text-primary-foreground">
            Visit Our Store
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
