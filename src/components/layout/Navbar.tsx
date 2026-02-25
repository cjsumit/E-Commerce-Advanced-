import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Menu, X, Search, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Collections", path: "/collections" },
  { name: "Products", path: "/products" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold text-foreground">
              LUXE<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-accent",
                  location.pathname === link.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="gold" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon" aria-label="Account">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" aria-label="Sign out" onClick={signOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" aria-label="Sign in">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-xs font-bold flex items-center justify-center text-accent-foreground">
                {totalItems}
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium py-2 transition-colors duration-200",
                    location.pathname === link.path
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-base font-medium py-2 text-muted-foreground">
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center space-x-4 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm">My Account</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => { signOut(); setIsOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                )}
                <Button variant="gold" size="sm" onClick={() => { setCartOpen(true); setIsOpen(false); }}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Cart ({totalItems})
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
