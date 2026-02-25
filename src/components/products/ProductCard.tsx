import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image: string | null;
  category?: string;
  is_new?: boolean;
  is_sale?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative bg-card rounded-xl overflow-hidden shadow-soft hover-lift",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
              New
            </span>
          )}
          {product.is_sale && discount > 0 && (
            <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full shadow-medium"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="hero"
            className="w-full"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id);
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-lg font-medium text-card-foreground hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-body font-semibold text-card-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.original_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
