"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCategoryName, PRODUCT_CATEGORIES } from "@/lib/categories";

type ProductStatus = "active" | "sold" | "inactive";
type ProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  status: ProductStatus;
  category_id: number | null;
  categories: { name: string } | { name: string }[] | null;
};
type Category = { id: number; name: string };
type ProductForm = { name: string; description: string; price: string; imageUrl: string; categoryId: string };

const emptyForm: ProductForm = { name: "", description: "", price: "", imageUrl: "", categoryId: "" };

export function AdminProductsManager() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const supabase = createClient();
  const filteredProducts = useMemo(() => products.filter((product) => {
    const category = Array.isArray(product.categories) ? product.categories[0]?.name : product.categories?.name;
    return (statusFilter === "all" || product.status === statusFilter) &&
      (categoryFilter === "all" || category === categoryFilter) &&
      product.name.toLowerCase().includes(search.toLowerCase().trim());
  }), [categoryFilter, products, search, statusFilter]);

  async function loadData() {
    const [{ data: productData, error: productError }, { data: categoryData, error: categoryError }] = await Promise.all([
      supabase.from("products").select("id, name, description, price, image_url, status, category_id, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name").eq("active", true).order("name"),
    ]);
    if (productError || categoryError) {
      setError(productError?.message ?? categoryError?.message ?? "Could not load products.");
      return;
    }
    setProducts((productData ?? []) as ProductRow[]);
    let loadedCategories = (categoryData ?? []) as Category[];
    const missingCategories = PRODUCT_CATEGORIES.filter((name) => !loadedCategories.some((category) => category.name === name));
    if (missingCategories.length > 0) {
      const { error: seedError } = await supabase.from("categories").insert(missingCategories.map((name) => ({ name, description: `Handmade ${name}` })));
      if (seedError && !seedError.message.toLowerCase().includes("duplicate")) {
        setError(seedError.message);
        return;
      }
      const { data: refreshedCategories, error: refreshError } = await supabase.from("categories").select("id, name").eq("active", true).order("name");
      if (refreshError) {
        setError(refreshError.message);
        return;
      }
      loadedCategories = (refreshedCategories ?? []) as Category[];
    }
    setCategories(loadedCategories.filter((category, index, list) => PRODUCT_CATEGORIES.includes(category.name as typeof PRODUCT_CATEGORIES[number]) && list.findIndex((item) => item.name === category.name) === index));
  }

  useEffect(() => { void loadData(); }, []);

  function updateField(field: keyof ProductForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEditing(product: ProductRow) {
    setEditingId(product.id);
    setIsFormOpen(true);
    setForm({ name: product.name, description: product.description, price: String(product.price), imageUrl: product.image_url ?? "", categoryId: String(product.category_id ?? "") });
    setImageFile(null);
    setError(null);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setIsFormOpen(false);
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);
    const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
    if (sessionError || !session) {
      setError("Your admin session has expired. Please sign out, sign back in, and try the upload again.");
      setIsSaving(false);
      return;
    }
    let imageUrl = form.imageUrl.trim() || null;
    if (imageFile) {
      const fileExtension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${crypto.randomUUID()}.${fileExtension}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, imageFile, { contentType: imageFile.type, upsert: false });
      if (uploadError) {
        const normalizedUploadError = uploadError.message.toLowerCase();
        const message = normalizedUploadError.includes("bucket not found")
          ? "Image upload failed because the product-images Storage bucket is missing. Run the product image storage migration in Supabase, then try again."
          : normalizedUploadError.includes("row-level security")
            ? "Image upload failed because this account is not authorized for product images. Confirm that the signed-in user has role = 'admin' in public.profiles, then sign out and back in."
            : `Image upload failed: ${uploadError.message}`;
        setError(message);
        setIsSaving(false);
        return;
      }
      imageUrl = supabase.storage.from("product-images").getPublicUrl(filePath).data.publicUrl;
    }
    const values = { name: form.name.trim(), description: form.description.trim(), price: Number(form.price), image_url: imageUrl, category_id: form.categoryId ? Number(form.categoryId) : null };
    const result = editingId
      ? await supabase.from("products").update(values).eq("id", editingId)
      : await supabase.from("products").insert({ ...values, status: "active" });

    if (result.error) {
      setError(result.error.message);
      setIsSaving(false);
      return;
    }

    setMessage(editingId ? "Product updated successfully." : "Product created and listed for sale.");
    cancelEditing();
    await loadData();
    setIsSaving(false);
  }

  async function markAsSold(product: ProductRow) {
    setError(null);
    setMessage(null);
    const { error: updateError } = await supabase.from("products").update({ status: "sold" }).eq("id", product.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessage(`${product.name} was marked as sold.`);
    await loadData();
  }

  return <>
    {!isFormOpen && <button className="button" type="button" onClick={() => setIsFormOpen(true)}>Add product</button>}
    {isFormOpen && <form className="contact-form admin-product-form" onSubmit={saveProduct}>
      <h2>{editingId ? "Edit product" : "Add a product"}</h2>
      <label>Product name<input value={form.name} onChange={(event) => updateField("name", event.target.value)} required /></label>
      <label>Description<textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={4} required /></label>
      <label>Price<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField("price", event.target.value)} required /></label>
      <label>Category<select value={form.categoryId} onChange={(event) => updateField("categoryId", event.target.value)}><option value="">Choose a category</option>{categories.map((category) => <option value={category.id} key={category.id}>{formatCategoryName(category.name)}</option>)}</select></label>
      <label>Product image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} />{imageFile && <span className="file-note">Selected: {imageFile.name}</span>}{!imageFile && form.imageUrl && <span className="file-note">Current image will be kept unless replaced.</span>}</label>
      <div className="admin-form-actions"><button className="button" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : editingId ? "Save changes" : "Create product"}</button><button className="button alt" type="button" onClick={cancelEditing}>{editingId ? "Cancel" : "Close"}</button></div>
    </form>}
    {error && <p className="auth-feedback error" role="alert">{error}</p>}
    {message && <p className="auth-feedback success" role="status">{message}</p>}
    <div className="admin-product-list">
      <h2>Products</h2>
      {products.length === 0 ? <p className="empty-state">No products have been created yet.</p> : <><div className="product-filters"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" /><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map((category) => <option value={category.name} key={category.id}>{formatCategoryName(category.name)}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | ProductStatus)} aria-label="Filter by status"><option value="all">All statuses</option><option value="active">Active</option><option value="sold">Sold</option><option value="inactive">Inactive</option></select></div>{filteredProducts.length === 0 ? <p className="empty-state">No products match these filters.</p> : <table><thead><tr><th>Photo</th><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredProducts.map((product) => { const category = Array.isArray(product.categories) ? product.categories[0]?.name : product.categories?.name; return <tr key={product.id}><td><img className="admin-product-thumb" src={product.image_url ?? "/images/brand-logo-small.png"} alt="" /></td><td>{product.name}</td><td>{category ? formatCategoryName(category) : "—"}</td><td>${Number(product.price).toFixed(2)}</td><td><span className={`status ${product.status}`}>{product.status}</span></td><td><button className="table-action" type="button" onClick={() => startEditing(product)}>Edit</button>{product.status !== "sold" && <button className="table-action" type="button" onClick={() => void markAsSold(product)}>Mark sold</button>}</td></tr>; })}</tbody></table>}</>}
    </div>
  </>;
}
