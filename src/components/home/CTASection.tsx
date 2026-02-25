import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the perfect blend of quality, elegance, and style with LUXE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button
                variant="gold"
                size="xl"
                className="w-full sm:w-auto"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="xl"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
