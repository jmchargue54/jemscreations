"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CartItem, CART_STORAGE_KEY } from "@/lib/cart";

type Discount = { code: string; type: "percentage" | "fixed"; value: number; expires_at: string | null };

export function CheckoutForm({ email }: { email: string }) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"venmo" | "card">("venmo");
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]")); } catch { setItems([]); }
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);
  const discountAmount = discount ? discount.type === "percentage" ? Math.min(subtotal, subtotal * (discount.value / 100)) : Math.min(subtotal, discount.value) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  async function applyDiscount() {
    setDiscountError(null);
    setDiscount(null);
    if (!discountCode.trim()) return;
    setIsApplyingDiscount(true);
    const { data, error: lookupError } = await createClient().from("discounts").select("code, type, value, expires_at").eq("code", discountCode.trim().toUpperCase()).eq("active", true).maybeSingle();
    if (lookupError || !data || (data.expires_at && new Date(data.expires_at) < new Date())) setDiscountError("That discount code is invalid or expired.");
    else setDiscount(data as Discount);
    setIsApplyingDiscount(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const values = new FormData(event.currentTarget);
    const street = String(values.get("street_address") ?? "").trim();
    const addressLine2 = String(values.get("address_line2") ?? "").trim();
    const shippingAddress = addressLine2 ? `${street}, ${addressLine2}` : street;
    const { data: orderId, error: submitError } = await createClient().rpc("submit_order", {
      p_items: items.map((item) => ({ product_id: item.id, quantity: 1 })),
      p_guest_name: String(values.get("customer_name") ?? "").trim(),
      p_guest_email: String(values.get("customer_email") ?? "").trim(),
      p_shipping_name: String(values.get("customer_name") ?? "").trim(),
      p_shipping_address: shippingAddress,
      p_shipping_city: String(values.get("city") ?? "").trim(),
      p_shipping_state: String(values.get("state") ?? "").trim(),
      p_shipping_postal_code: String(values.get("postal_code") ?? "").trim(),
      p_shipping_country: String(values.get("country") ?? "United States").trim(),
      p_customer_notes: String(values.get("order_notes") ?? "").trim(),
      p_discount_code: discount?.code ?? discountCode.trim().toUpperCase(),
      p_venmo_paid: paymentMethod === "venmo",
    });
    if (submitError || !orderId) {
      setError(submitError?.message ?? "Your order could not be submitted. Please try again.");
      setIsSubmitting(false);
      return;
    }
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/profile?submitted=1");
  }

  return <form className="checkout-grid" onSubmit={handleSubmit}>
    <div className="contact-form">
      <h2>Your information</h2>
      <label>Name<input name="customer_name" required autoComplete="name" /></label>
      <label>Email<input name="customer_email" type="email" defaultValue={email} required autoComplete="email" /></label>
      <fieldset className="address-fields"><legend>Shipping address</legend><label>Street address<input name="street_address" required autoComplete="street-address" /></label><label>Apartment, suite, or unit <span className="optional">(optional)</span><input name="address_line2" autoComplete="address-line2" /></label><div className="address-row"><label>Town / city<input name="city" required autoComplete="address-level2" /></label><label>State<input name="state" required autoComplete="address-level1" /></label><label>ZIP code<input name="postal_code" required inputMode="numeric" autoComplete="postal-code" /></label></div><label>Country<input name="country" defaultValue="United States" required autoComplete="country-name" /></label></fieldset>
      <label>Order notes<textarea name="order_notes" rows={3} /></label>
    </div>
    <div className="checkout-summary">
      <h2>Payment</h2>
      <div className="checkout-totals"><p><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></p>{discount && <p><span>Discount ({discount.code})</span><strong>-${discountAmount.toFixed(2)}</strong></p>}<p className="checkout-total"><span>Total</span><strong>${total.toFixed(2)}</strong></p></div>
      <div className="discount-entry"><label>Discount code<input value={discountCode} onChange={(event) => setDiscountCode(event.target.value)} placeholder="WELCOME10" /></label><button className="table-action" type="button" onClick={() => void applyDiscount()} disabled={isApplyingDiscount}>{isApplyingDiscount ? "Applying…" : "Apply"}</button></div>
      {discountError && <p className="auth-feedback error" role="alert">{discountError}</p>}
      {error && <p className="auth-feedback error" role="alert">{error}</p>}
      <p>Choose how you paid for your order.</p>
      <div className="payment-options"><label className="payment-option"><input type="radio" name="payment-method" value="venmo" checked={paymentMethod === "venmo"} onChange={() => setPaymentMethod("venmo")} /> I paid through Venmo</label><label className="payment-option"><input type="radio" name="payment-method" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /> Pay by card</label></div>
      {paymentMethod === "venmo" ? <p className="payment-help">Send payment through Venmo to the account shown by the business owner, then submit your order.</p> : <div className="card-fields"><label>Name on card<input required autoComplete="cc-name" /></label><label>Card number<input required inputMode="numeric" autoComplete="cc-number" maxLength={19} /></label><div className="card-row"><label>Expiration<input required placeholder="MM/YY" autoComplete="cc-exp" /></label><label>CVC<input required inputMode="numeric" autoComplete="cc-csc" maxLength={4} /></label></div><p className="payment-help">Card details are used only for this checkout form and are not saved.</p></div>}
      <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit order"}</button>
    </div>
  </form>;
}
