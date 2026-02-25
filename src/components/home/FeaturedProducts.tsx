import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/useProducts";

const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useFeaturedProducts();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-accent text-sm font-medium uppercase tracking-wider">
              Curated Selection
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2">
              Featured Products
            </h2>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="group">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={{
                    ...product,
                    is_sale: !!product.original_price,
                    category: product.category,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
