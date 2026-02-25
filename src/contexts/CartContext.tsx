import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  checkout: (shippingAddress: string) => Promise<string | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, products(id, name, price, image)")
      .eq("user_id", user.id);

    if (!error && data) {
      setItems(
        data.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.products as unknown as CartItem["product"],
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to add items to your cart.", variant: "destructive" });
      return;
    }

    // Check if already in cart
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + 1);
      return;
    }

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity: 1,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add item to cart.", variant: "destructive" });
    } else {
      toast({ title: "Added to cart!", description: "Item has been added to your cart." });
      await fetchCart();
      setIsOpen(true);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    if (!error) await fetchCart();
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (!error) await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const checkout = async (shippingAddress: string): Promise<string | null> => {
    if (!user || items.length === 0) return null;

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total_amount: total, shipping_address: shippingAddress, status: "pending" })
      .select("id")
      .single();

    if (orderError || !order) {
      toast({ title: "Error", description: "Failed to create order.", variant: "destructive" });
      return null;
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      toast({ title: "Error", description: "Failed to create order items.", variant: "destructive" });
      return null;
    }

    // Clear cart
    await clearCart();
    toast({ title: "Order placed!", description: `Order #${order.id.slice(0, 8).toUpperCase()} has been placed successfully.` });
    return order.id;
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, isOpen, setIsOpen, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
