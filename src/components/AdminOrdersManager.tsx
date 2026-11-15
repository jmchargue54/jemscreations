"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type OrderStatus = "submitted" | "pending" | "processing" | "shipped" | "complete" | "canceled";
type AdminOrder = { id: number; guest_name: string | null; guest_email: string | null; shipping_name: string; total: number; status: OrderStatus; created_at: string };

const statuses: OrderStatus[] = ["submitted", "pending", "processing", "shipped", "complete", "canceled"];

export function AdminOrdersManager({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [restoredOrderIds, setRestoredOrderIds] = useState<Set<number>>(new Set());

  async function updateStatus(id: number, status: OrderStatus) {
    setError(null);
    setMessage(null);
    const { error: updateError } = await createClient().from("orders").update({ status }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
    setMessage(`Order #${id} was updated.`);
  }

  async function restoreProducts(orderId: number) {
    setError(null);
    setMessage(null);
    setRestoringId(orderId);
    const supabase = createClient();
    const { data: items, error: itemError } = await supabase.from("order_items").select("product_id").eq("order_id", orderId);
    if (itemError) {
      setError(itemError.message);
      setRestoringId(null);
      return;
    }
    const productIds = (items ?? []).map((item) => item.product_id).filter((id): id is number => typeof id === "number");
    if (productIds.length === 0) {
      setMessage(`Order #${orderId} has no products available to restore.`);
      setRestoringId(null);
      return;
    }
    const { error: restoreError } = await supabase.from("products").update({ status: "active" }).in("id", productIds);
    if (restoreError) {
      setError(restoreError.message);
      setRestoringId(null);
      return;
    }
    setMessage(`The products from order #${orderId} are active on the shop again.`);
    setRestoredOrderIds((current) => new Set(current).add(orderId));
    setRestoringId(null);
  }

  return <>
    {error && <p className="auth-feedback error" role="alert">{error}</p>}
    {message && <p className="auth-feedback success" role="status">{message}</p>}
    {orders.length > 0 ? <table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>#{order.id}</td><td>{order.guest_name ?? order.shipping_name}{order.guest_email && <><br /><small>{order.guest_email}</small></>}</td><td>{new Date(order.created_at).toLocaleDateString()}</td><td>${Number(order.total).toFixed(2)}</td><td><select value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value as OrderStatus)} aria-label={`Update status for order ${order.id}`}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></td><td>{order.status === "canceled" && (restoredOrderIds.has(order.id) ? <span className="returned-message">Item has been returned to shop</span> : <button className="table-action" type="button" disabled={restoringId === order.id} onClick={() => void restoreProducts(order.id)}>{restoringId === order.id ? "Restoring…" : "Return products to shop"}</button>)}</td></tr>)}</tbody></table> : <p className="empty-state">No orders have been submitted yet.</p>}
  </>;
}
