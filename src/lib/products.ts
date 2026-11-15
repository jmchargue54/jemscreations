import { Product } from "@/data/products";
import { createClient } from "@/lib/supabase/server";

type SupabaseProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  status: "active" | "sold" | "inactive";
  inventory_tracking: boolean;
  inventory_quantity: number | null;
  categories: { name: string } | { name: string }[] | null;
};

export async function getAvailableProducts(): Promise<{ products: Product[]; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, status, inventory_tracking, inventory_quantity, categories(name)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) return { products: [], error: error.message };

  const rows = (data ?? []) as SupabaseProduct[];
  return {
    products: rows
      .filter((product) => !product.inventory_tracking || (product.inventory_quantity ?? 0) > 0)
      .map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        category: (Array.isArray(product.categories) ? product.categories[0]?.name : product.categories?.name) ?? "Collection",
        price: Number(product.price),
        image: product.image_url ?? "/images/brand-logo.png",
        alt: `${product.name} handmade piece`,
      })),
    error: null,
  };
}

export async function getProductById(id: number): Promise<{ product: Product | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, status, inventory_tracking, inventory_quantity, categories(name)")
    .eq("id", id)
    .maybeSingle();

  if (error) return { product: null, error: error.message };
  if (!data) return { product: null, error: null };

  const row = data as SupabaseProduct;
  const category = (Array.isArray(row.categories) ? row.categories[0]?.name : row.categories?.name) ?? "Collection";
  const available = row.status === "active" && (!row.inventory_tracking || (row.inventory_quantity ?? 0) > 0);
  return {
    product: {
      id: row.id,
      name: row.name,
      description: row.description,
      category,
      price: Number(row.price),
      image: row.image_url ?? "/images/brand-logo.png",
      alt: `${row.name} handmade piece`,
      sold: !available,
    },
    error: null,
  };
}
