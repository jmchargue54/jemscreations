"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DiscountType = "percentage" | "fixed";
type Discount = { id: number; code: string; type: DiscountType; value: number; active: boolean; expires_at: string | null; usage_limit: number | null };
type DiscountForm = { code: string; type: DiscountType; value: string; expiresAt: string; usageLimit: string };
const emptyForm: DiscountForm = { code: "", type: "percentage", value: "", expiresAt: "", usageLimit: "" };

export function AdminDiscountsManager() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [form, setForm] = useState<DiscountForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const supabase = createClient();
  const visibleDiscounts = discounts.filter((discount) => statusFilter === "all" || (statusFilter === "active" ? discount.active : !discount.active));

  async function loadDiscounts() {
    const { data, error: loadError } = await supabase.from("discounts").select("id, code, type, value, active, expires_at, usage_limit").order("active", { ascending: false }).order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    else setDiscounts((data ?? []) as Discount[]);
  }

  useEffect(() => { void loadDiscounts(); }, []);

  function updateForm(field: keyof DiscountForm, value: string) { setForm((current) => ({ ...current, [field]: value })); }
  function editDiscount(discount: Discount) {
    setEditingId(discount.id);
    setIsFormOpen(true);
    setForm({ code: discount.code, type: discount.type, value: String(discount.value), expiresAt: discount.expires_at ? discount.expires_at.slice(0, 10) : "", usageLimit: discount.usage_limit === null ? "" : String(discount.usage_limit) });
    setMessage(null);
    setError(null);
  }
  function resetForm() { setEditingId(null); setForm(emptyForm); setIsFormOpen(false); }

  async function saveDiscount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);
    const values = { code: form.code.trim().toUpperCase(), type: form.type, value: Number(form.value), expires_at: form.expiresAt ? new Date(`${form.expiresAt}T23:59:59`).toISOString() : null, usage_limit: form.usageLimit ? Number(form.usageLimit) : null };
    const result = editingId ? await supabase.from("discounts").update(values).eq("id", editingId) : await supabase.from("discounts").insert({ ...values, active: true });
    if (result.error) setError(result.error.message);
    else { setMessage(editingId ? "Discount updated successfully." : "Discount created successfully."); resetForm(); await loadDiscounts(); }
    setIsSaving(false);
  }

  async function toggleActive(discount: Discount) {
    setError(null);
    const { error: updateError } = await supabase.from("discounts").update({ active: !discount.active }).eq("id", discount.id);
    if (updateError) setError(updateError.message);
    else { setMessage(`${discount.code} is now ${discount.active ? "inactive" : "active"}.`); await loadDiscounts(); }
  }

  return <>
    {!isFormOpen && <button className="button" type="button" onClick={() => setIsFormOpen(true)}>Create discount</button>}
    {isFormOpen && <form className="contact-form admin-form" onSubmit={saveDiscount}>
      <h2>{editingId ? "Edit discount" : "Create discount"}</h2>
      <label>Code<input value={form.code} onChange={(event) => updateForm("code", event.target.value)} placeholder="WELCOME10" required /></label>
      <label>Discount type<select value={form.type} onChange={(event) => updateForm("type", event.target.value as DiscountType)}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></label>
      <label>Value<input type="number" min="0" step="0.01" value={form.value} onChange={(event) => updateForm("value", event.target.value)} placeholder="10" required /></label>
      <label>Expiration date<input type="date" value={form.expiresAt} onChange={(event) => updateForm("expiresAt", event.target.value)} /></label>
      <label>Usage limit<input type="number" min="1" step="1" value={form.usageLimit} onChange={(event) => updateForm("usageLimit", event.target.value)} placeholder="Unlimited" /></label>
      <div className="admin-form-actions"><button className="button" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : editingId ? "Save changes" : "Create discount"}</button><button className="button alt" type="button" onClick={resetForm}>{editingId ? "Cancel" : "Close"}</button></div>
    </form>}
    {error && <p className="auth-feedback error" role="alert">{error}</p>}
    {message && <p className="auth-feedback success" role="status">{message}</p>}
    <div className="discount-list"><h2>Discount codes</h2><div className="discount-filters" aria-label="Discount filters"><button className={`filter ${statusFilter === "all" ? "active" : ""}`} type="button" onClick={() => setStatusFilter("all")}>All</button><button className={`filter ${statusFilter === "active" ? "active" : ""}`} type="button" onClick={() => setStatusFilter("active")}>Active</button><button className={`filter ${statusFilter === "inactive" ? "active" : ""}`} type="button" onClick={() => setStatusFilter("inactive")}>Inactive</button></div>{discounts.length === 0 ? <p className="empty-state">No discount codes have been created yet.</p> : visibleDiscounts.length === 0 ? <p className="empty-state">No {statusFilter} discount codes.</p> : <table><thead><tr><th>Code</th><th>Value</th><th>Expires</th><th>Usage limit</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleDiscounts.map((discount) => <tr key={discount.id}><td><strong>{discount.code}</strong></td><td>{discount.type === "percentage" ? `${discount.value}%` : `$${Number(discount.value).toFixed(2)}`}</td><td>{discount.expires_at ? new Date(discount.expires_at).toLocaleDateString() : "Never"}</td><td>{discount.usage_limit ?? "Unlimited"}</td><td><span className={`status ${discount.active ? "active" : "inactive"}`}>{discount.active ? "Active" : "Inactive"}</span></td><td><button className="table-action" type="button" onClick={() => editDiscount(discount)}>Edit</button><button className="table-action" type="button" onClick={() => void toggleActive(discount)}>{discount.active ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table>}</div>
  </>;
}
