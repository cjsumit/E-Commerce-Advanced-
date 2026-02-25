import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-2">
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full">
                New Collection 2024
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Discover Your
              <br />
              <span className="text-gradient-gold">Perfect Style</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Explore our curated collection of premium products designed for those who appreciate quality and elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button variant="hero" size="xl">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="hero-outline" size="xl">
                  View Collections
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-border">
              {[
                { value: "500+", label: "Products" },
                { value: "10k+", label: "Customers" },
                { value: "4.9", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1000&fit=crop"
                alt="Hero fashion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -left-8 bottom-24 p-4 bg-card rounded-xl shadow-elegant animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
                <div>
                  <p className="font-display font-semibold text-card-foreground">Premium Quality</p>
                  <p className="text-sm text-muted-foreground">Handcrafted with care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
