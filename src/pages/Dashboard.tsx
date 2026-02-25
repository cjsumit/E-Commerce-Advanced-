import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: { id: string }[];
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const { user, profile, signOut, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) || []);
      setOrdersLoading(false);
    };
    fetchOrders();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName, phone })
      .eq("id", user.id);
    if (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      await refreshProfile();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <div className="h-20 w-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h2 className="font-display text-lg font-semibold text-card-foreground">
                    {profile?.first_name || ""} {profile?.last_name || ""}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "orders", icon: Package, label: "My Orders" },
                    { id: "settings", icon: Settings, label: "Settings" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        activeTab === item.id
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-foreground">My Orders</h1>
                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-accent" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-card rounded-xl p-12 shadow-soft text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet. Start shopping!</p>
                      <Button variant="gold" className="mt-4" onClick={() => navigate("/products")}>
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-card rounded-xl p-6 shadow-soft hover-lift">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-card-foreground">
                                  #{order.id.slice(0, 8).toUpperCase()}
                                </h3>
                                <span className={cn(
                                  "px-2 py-1 text-xs font-medium rounded-full",
                                  order.status === "delivered" ? "bg-green-100 text-green-700" :
                                  order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                                  order.status === "processing" ? "bg-amber-100 text-amber-700" :
                                  "bg-secondary text-muted-foreground"
                                )}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.order_items?.length || 0} items • Ordered on {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="font-semibold text-card-foreground">
                              ${Number(order.total_amount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-foreground">Account Settings</h1>
                  <div className="bg-card rounded-xl p-6 shadow-soft">
                    <h2 className="font-display text-lg font-semibold text-card-foreground mb-6">
                      Personal Information
                    </h2>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user?.email || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
