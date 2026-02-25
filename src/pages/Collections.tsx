import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";

const Collections = () => {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Our Collections
            </h1>
            <p className="text-muted-foreground mt-4">
              Explore our carefully curated collections, each designed to reflect a unique style and purpose.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/products`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={category.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop"}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-primary-foreground">
                          {category.name}
                        </h3>
                        <p className="text-primary-foreground/80 mt-2 text-sm line-clamp-2">
                          {category.description || "Explore our collection"}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors flex-shrink-0">
                        <ArrowUpRight className="h-5 w-5 text-primary-foreground group-hover:text-accent-foreground" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Collections;
