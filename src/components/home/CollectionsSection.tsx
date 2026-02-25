import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useProducts";

const CollectionsSection = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-medium uppercase tracking-wider">
            Explore
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2">
            Our Collections
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Discover curated collections designed to elevate your style and express your unique personality.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((category, index) => (
            <Link
              key={category.id}
              to={`/products`}
              className={cn(
                "group relative overflow-hidden rounded-2xl animate-fade-in-up",
                index === 0 ? "md:row-span-2" : "aspect-[4/3]"
              )}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={cn("relative", index === 0 ? "h-full min-h-[500px]" : "h-full")}>
                <img
                  src={category.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop"}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
                        {category.name}
                      </h3>
                      <p className="text-primary-foreground/80 mt-2 text-sm md:text-base">
                        {category.description || "Explore our collection"}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <ArrowUpRight className="h-5 w-5 text-primary-foreground group-hover:text-accent-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
