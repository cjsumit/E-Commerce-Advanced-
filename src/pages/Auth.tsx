import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!", description: "You have successfully signed in." });
        navigate("/");
      }
    } else {
      const { error } = await signUp(email, password, firstName, lastName);
      if (error) {
        const msg = error.message.includes("already registered")
          ? "An account with this email already exists. Please sign in instead."
          : error.message;
        toast({ title: "Sign up failed", description: msg, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "Please check your email to verify your account." });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-background">
        <div className="max-w-md w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to store
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              LUXE<span className="text-accent">.</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Join us and start your shopping journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=1600&fit=crop"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-primary-foreground">
            <p className="font-display text-2xl font-semibold mb-4">
              "Shopping at LUXE has completely transformed my wardrobe. The quality is unmatched."
            </p>
            <footer className="text-primary-foreground/80">
              — Sarah Mitchell, Fashion Designer
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Auth;
