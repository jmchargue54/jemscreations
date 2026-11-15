import { PageShell } from "@/components/SiteChrome";
import Link from "next/link";
import { isCurrentUserAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminOrdersManager } from "@/components/AdminOrdersManager";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const isAdmin = await isCurrentUserAdmin();
  const query = supabase.from("orders").select("id, guest_name, guest_email, shipping_name, total, status, created_at").order("created_at", { ascending: false });
  const { data: orders, error } = isAdmin ? await query : await query.eq("user_id", user.id);
  let restoredOrderIds: number[] = [];
  const canceledOrderIds = (orders ?? []).filter((order) => order.status === "canceled").map((order) => order.id);
  if (isAdmin && canceledOrderIds.length > 0) {
    const { data: canceledItems } = await supabase.from("order_items").select("order_id, product_id, products(status)").in("order_id", canceledOrderIds);
    restoredOrderIds = canceledOrderIds.filter((orderId) => {
      const items = (canceledItems ?? []).filter((item) => item.order_id === orderId);
      return items.length > 0 && items.every((item) => {
        const product = Array.isArray(item.products) ? item.products[0] : item.products;
        return product?.status === "active";
      });
    });
  }
  const params = await searchParams;
  const submitted = params.submitted === "1";
  return <PageShell><section className="section admin-table-page"><span className="eyebrow">{isAdmin ? "Owner tools" : "Your account"}</span><h1>{isAdmin ? "Orders" : "Your orders"}</h1>{submitted && <p className="home-notice order-success" role="status">Your order has been submitted successfully.</p>}{error ? <div className="database-message"><h2>Orders could not load.</h2><p>{error.message}</p></div> : isAdmin ? <AdminOrdersManager initialOrders={(orders ?? []) as NonNullable<typeof orders> extends (infer T)[] ? T[] : never} initialRestoredOrderIds={restoredOrderIds} /> : orders && orders.length > 0 ? <table><thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><Link className="text-link" href={`/orders/${order.id}`}>#{order.id}</Link></td><td>{new Date(order.created_at).toLocaleDateString()}</td><td>${Number(order.total).toFixed(2)}</td><td><span className={`status ${order.status}`}>{order.status}</span></td></tr>)}</tbody></table> : <p className="empty-state">You have not submitted any orders yet.</p>}</section></PageShell>;
}
