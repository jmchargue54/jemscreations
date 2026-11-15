import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/SiteChrome";
import { createClient } from "@/lib/supabase/server";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const orderId = Number((await params).id);
  if (!Number.isInteger(orderId)) notFound();

  const { data: order } = await supabase
    .from("orders")
    .select("id, guest_name, shipping_name, status, subtotal, discount_amount, total, venmo_paid, shipping_address, shipping_city, shipping_state, shipping_postal_code, shipping_country, customer_notes, created_at")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_name, quantity, unit_price")
    .eq("order_id", orderId)
    .order("id");

  return <PageShell><main className="order-details-page"><Link className="back-link" href="/profile">← Back to profile</Link><div className="order-details-header"><div><span className="eyebrow">Past order</span><h1>Order #{order.id}</h1><p>Placed {new Date(order.created_at).toLocaleDateString()}</p></div><span className={`status ${order.status}`}>{order.status}</span></div><div className="order-details-grid"><section className="order-details-card"><h2>Items</h2>{items && items.length > 0 ? <div className="order-item-list">{items.map((item) => <div className="order-item" key={item.id}><div><strong>{item.product_name}</strong><small>Quantity: {item.quantity}</small></div><span>${(Number(item.unit_price) * item.quantity).toFixed(2)}</span></div>)}</div> : <p className="empty-state">No item details are available for this order.</p>}<div className="order-total-list"><p><span>Subtotal</span><strong>${Number(order.subtotal).toFixed(2)}</strong></p>{Number(order.discount_amount) > 0 && <p><span>Discount</span><strong>-${Number(order.discount_amount).toFixed(2)}</strong></p>}<p className="order-total"><span>Total</span><strong>${Number(order.total).toFixed(2)}</strong></p></div></section><aside className="order-details-card"><h2>Shipping information</h2><p><strong>{order.shipping_name}</strong></p><p>{order.shipping_address}<br />{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}<br />{order.shipping_country}</p><p><strong>Payment:</strong> {order.venmo_paid ? "Venmo" : "Card"}</p>{order.customer_notes && <><h2>Order notes</h2><p>{order.customer_notes}</p></>}</aside></div></main></PageShell>;
}
