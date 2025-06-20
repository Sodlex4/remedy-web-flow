
import { Shield, Leaf, Award, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Licensed & Compliant",
      description: "Fully licensed cannabis dispensary operating in full compliance with local regulations."
    },
    {
      icon: Leaf,
      title: "Organic & Natural",
      description: "Premium organic cannabis products sourced from trusted growers committed to sustainability."
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Every product is rigorously tested for potency, purity, and safety before reaching our shelves."
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Our knowledgeable staff provides personalized recommendations for your wellness journey."
    }
  ];

  return (
    <section id="about" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Story</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nature's Remedy was founded on the belief that everyone deserves access to high-quality, 
            natural cannabis products in a safe, welcoming environment. We're more than just a dispensary—we're 
            your partners in wellness and advocates for responsible cannabis use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border text-center hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card rounded-lg p-8 border border-border">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Commitment to Compliance</h3>
              <p className="text-muted-foreground mb-4">
                As a licensed cannabis dispensary, we take our responsibility seriously. We operate under 
                strict compliance with all local and state regulations, ensuring every transaction is legal, 
                documented, and conducted with the highest standards of professionalism.
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-primary font-medium">
                  <strong>Licensed Cannabis Dispensary</strong><br />
                  License Number: [Your License Number]<br />
                  Murang'a County, Kenya
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">🌿 Sustainability Focus</h4>
                <p className="text-sm text-muted-foreground">
                  We partner with local growers who share our commitment to sustainable, organic cultivation practices.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">🔒 Safe Environment</h4>
                <p className="text-sm text-muted-foreground">
                  Our dispensary provides a secure, welcoming space for all customers to explore cannabis products safely.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">📚 Education First</h4>
                <p className="text-sm text-muted-foreground">
                  We believe in educating our customers about responsible consumption and the benefits of cannabis.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-2">⚠️ Important Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            All products are for medical or recreational use only where permitted by law. 
            Please consume responsibly. You must be 21 years or older to purchase cannabis products. 
            This website is for informational purposes only and does not constitute an e-commerce platform—no online sales are conducted here.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
