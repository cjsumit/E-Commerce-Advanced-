import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductWithCategory {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string | null;
  stock: number;
  is_new: boolean | null;
  is_featured: boolean | null;
  category_id: string | null;
  category: string;
  created_at: string;
}

export const useProducts = (categoryFilter?: string) => {
  return useQuery({
    queryKey: ["products", categoryFilter],
    queryFn: async (): Promise<ProductWithCategory[]> => {
      let query = supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      let products = (data || []).map((p) => ({
        ...p,
        category: (p.categories as unknown as { name: string })?.name || "Uncategorized",
      }));

      if (categoryFilter && categoryFilter !== "All") {
        products = products.filter((p) => p.category === categoryFilter);
      }

      return products;
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async (): Promise<ProductWithCategory[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("is_featured", true)
        .limit(4);

      if (error) throw error;

      return (data || []).map((p) => ({
        ...p,
        category: (p.categories as unknown as { name: string })?.name || "Uncategorized",
      }));
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};
