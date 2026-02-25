import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, totalItems, totalPrice, checkout } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckout, setIsCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast({ title: "Address required", description: "Please enter a shipping address.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const orderId = await checkout(shippingAddress);
    setSubmitting(false);
    if (orderId) {
      setIsCheckout(false);
      setShippingAddress("");
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">
            {isCheckout ? "Checkout" : `Shopping Cart (${totalItems})`}
          </SheetTitle>
        </SheetHeader>

        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Please sign in to view your cart.</p>
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="gold">Sign In</Button>
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/products" onClick={() => setIsOpen(false)}>
              <Button variant="gold">Browse Products</Button>
            </Link>
          </div>
        ) : isCheckout ? (
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* Order summary */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold">Order Summary</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping address */}
            <div className="space-y-2">
              <Label htmlFor="shipping">Shipping Address</Label>
              <Input
                id="shipping"
                placeholder="123 Fashion Avenue, New York, NY 10001"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-secondary rounded-xl">
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                  <p className="text-accent font-semibold text-sm mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {user && items.length > 0 && (
          <SheetFooter className="border-t border-border pt-4 flex-col gap-3">
            {!isCheckout && (
              <div className="flex justify-between w-full text-lg font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            )}
            {isCheckout ? (
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1" onClick={() => setIsCheckout(false)}>
                  Back
                </Button>
                <Button variant="gold" className="flex-1" onClick={handleCheckout} disabled={submitting}>
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            ) : (
              <Button variant="gold" className="w-full" size="lg" onClick={() => setIsCheckout(true)}>
                Proceed to Checkout
              </Button>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
