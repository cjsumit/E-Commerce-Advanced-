import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Grid3X3, LayoutGrid, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts, useCategories } from "@/hooks/useProducts";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useProducts(selectedCategory);
  const { data: categories = [] } = useCategories();

  const categoryNames = ["All", ...categories.map((c) => c.name)];

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Our Products
            </h1>
            <p className="text-muted-foreground mt-4">
              Discover our curated collection of premium products, handpicked for quality and style.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categoryNames.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="hidden md:flex items-center gap-1 border border-input rounded-lg p-1">
                <button
                  onClick={() => setGridCols(3)}
                  className={cn(
                    "p-2 rounded transition-colors",
                    gridCols === 3 ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={cn(
                    "p-2 rounded transition-colors",
                    gridCols === 4 ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {products.length} products
              </span>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mb-6 p-4 bg-card rounded-lg border border-border animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryNames.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className={cn(
                "grid gap-6",
                gridCols === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              )}>
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
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

              {products.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
