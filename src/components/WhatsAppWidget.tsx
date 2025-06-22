
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi Nature's Remedy, I'd like to request a pickup.");
    const phoneNumber = "254700000000"; // Replace with actual business number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <div className="mb-4 bg-card dark:bg-card border border-border dark:border-border rounded-lg p-4 shadow-lg max-w-sm animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground dark:text-foreground">Need Help?</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(false)}
            >
              <X size={14} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">
            Chat with us on WhatsApp for quick support or to request a pickup.
          </p>
          <Button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            <MessageCircle size={16} className="mr-2" />
            Start WhatsApp Chat
          </Button>
        </div>
      )}
      
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        size="icon"
      >
        {isExpanded ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </Button>
    </div>
  );
};

export default WhatsAppWidget;
