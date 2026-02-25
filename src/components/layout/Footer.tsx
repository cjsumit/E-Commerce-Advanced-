import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">
              LUXE<span className="text-accent">.</span>
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Curating exceptional products for the discerning customer. Quality meets elegance in every piece.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Shop</h4>
            <ul className="space-y-2">
              {["All Products", "New Arrivals", "Best Sellers", "Sale"].map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="text-primary-foreground/70 text-sm hover:text-accent transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Contact", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <Link
                    to="/contact"
                    className="text-primary-foreground/70 text-sm hover:text-accent transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Stay Updated</h4>
            <p className="text-primary-foreground/70 text-sm">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-l-lg text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent"
              />
              <button className="px-4 py-2 bg-accent text-accent-foreground rounded-r-lg hover:bg-accent/90 transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/50 text-sm">
              © 2024 LUXE. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service", "Shipping Info"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-primary-foreground/50 text-sm hover:text-accent transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
