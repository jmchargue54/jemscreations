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

  return <>
    {error && <p className="auth-feedback error" role="alert">{error}</p>}
    {message && <p className="auth-feedback success" role="status">{message}</p>}
    {orders.length > 0 ? <table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>#{order.id}</td><td>{order.guest_name ?? order.shipping_name}{order.guest_email && <><br /><small>{order.guest_email}</small></>}</td><td>{new Date(order.created_at).toLocaleDateString()}</td><td>${Number(order.total).toFixed(2)}</td><td><select value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value as OrderStatus)} aria-label={`Update status for order ${order.id}`}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></td></tr>)}</tbody></table> : <p className="empty-state">No orders have been submitted yet.</p>}
  </>;
}
