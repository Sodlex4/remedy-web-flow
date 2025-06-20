
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  image: string;
}

const CartPanel = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Girl Scout Cookies',
      type: 'Hybrid',
      price: 1500,
      quantity: 1,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'RAW Classic Papers',
      type: 'Rolling Papers',
      price: 300,
      quantity: 2,
      image: '/placeholder.svg'
    }
  ]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary relative"
        >
          <ShoppingCart size={20} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md bg-background border-border">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-foreground">Your Cart</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cartItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🌿</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                      <p className="text-primary font-semibold">KSh {item.price.toLocaleString()}</p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-8 w-8"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="w-8 text-center text-foreground font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-8 w-8"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    <span className="text-foreground font-semibold">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary & Actions */}
          {cartItems.length > 0 && (
            <div className="border-t border-border pt-4 mt-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">KSh {totalPrice.toLocaleString()}</span>
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                size="lg"
              >
                Continue to Request
              </Button>

              {/* Compliance Footer */}
              <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                21+ Only. For informational and pickup purposes only. No online sales.
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartPanel;
