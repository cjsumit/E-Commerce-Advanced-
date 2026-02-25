import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Plus,
  Search,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  category_id: string | null;
  category: string;
  is_new: boolean | null;
  is_featured: boolean | null;
  original_price: number | null;
  description: string | null;
}

interface AdminOrder {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  user_id: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: categories = [] } = useCategories();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Product dialog state
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", price: "", original_price: "", description: "", image: "", stock: "", category_id: "", is_new: false, is_featured: false,
  });
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    setProducts(
      (data || []).map((p) => ({
        ...p,
        category: (p.categories as unknown as { name: string })?.name || "Uncategorized",
      }))
    );
    setProductsLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as AdminOrder[]) || []);
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAdmin]);

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", original_price: "", description: "", image: "", stock: "", category_id: "", is_new: false, is_featured: false });
    setShowProductDialog(true);
  };

  const openEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : "",
      description: product.description || "",
      image: product.image || "",
      stock: String(product.stock),
      category_id: product.category_id || "",
      is_new: product.is_new || false,
      is_featured: product.is_featured || false,
    });
    setShowProductDialog(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      toast({ title: "Missing fields", description: "Name and price are required.", variant: "destructive" });
      return;
    }
    setSavingProduct(true);
    const payload = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
      description: productForm.description || null,
      image: productForm.image || null,
      stock: parseInt(productForm.stock) || 0,
      category_id: productForm.category_id || null,
      is_new: productForm.is_new,
      is_featured: productForm.is_featured,
    };

    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Product updated!" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Product created!" });
    }
    setSavingProduct(false);
    setShowProductDialog(false);
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Product deleted!" });
      fetchProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else fetchOrders();
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 translate-x-0">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-primary-foreground/10">
            <h1 className="font-display text-2xl font-bold">
              LUXE<span className="text-accent">.</span>
              <span className="text-sm font-normal ml-2">Admin</span>
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "orders", icon: ShoppingCart, label: "Orders" },
              { id: "products", icon: Package, label: "Products" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id
                    ? "bg-primary-foreground/10 text-primary-foreground"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-primary-foreground/10">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Store
            </Link>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto ml-64 lg:ml-0">
        <div className="p-6 lg:p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your store.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
                  { label: "Total Orders", value: String(orders.length), icon: ShoppingCart },
                  { label: "Total Products", value: String(products.length), icon: Package },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card p-6 rounded-xl shadow-soft">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                    <p className="font-display text-2xl font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : (
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-secondary/30">
                          <td className="px-6 py-4 text-sm font-medium text-card-foreground">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Select defaultValue={order.status} onValueChange={(val) => handleUpdateOrderStatus(order.id, val)}>
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-card-foreground">
                            ${Number(order.total_amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
                  <p className="text-muted-foreground">Manage your product catalog</p>
                </div>
                <Button variant="gold" onClick={openNewProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : (
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-secondary/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                              <span className="font-medium text-card-foreground">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-medium text-card-foreground">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={cn("text-sm font-medium", product.stock > 20 ? "text-green-600" : product.stock > 10 ? "text-amber-600" : "text-red-600")}>
                              {product.stock} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Original Price</Label>
                <Input type="number" step="0.01" value={productForm.original_price} onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={productForm.category_id} onValueChange={(val) => setProductForm({ ...productForm, category_id: val })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={productForm.is_new} onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })} />
                Mark as New
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={productForm.is_featured} onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })} />
                Featured
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductDialog(false)}>Cancel</Button>
            <Button variant="gold" onClick={handleSaveProduct} disabled={savingProduct}>
              {savingProduct ? "Saving..." : editingProduct ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
