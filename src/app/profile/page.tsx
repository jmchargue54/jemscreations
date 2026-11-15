import { redirect } from "next/navigation";
import { PageShell } from "@/components/SiteChrome";
import { ProfileForm } from "@/components/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import { WishlistList } from "@/components/WishlistList";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();
  const { data: wishlistItems } = await supabase.from("wishlist_items").select("products(id, name, price, image_url)").eq("user_id", user.id);
  const wishlistProducts = (wishlistItems ?? []).flatMap((item) => Array.isArray(item.products) ? item.products : item.products ? [item.products] : []);
  const { data: orders } = await supabase.from("orders").select("id, total, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  const params = await searchParams;

  return <PageShell><section className="section narrow-page profile-page"><span className="eyebrow">Your account</span><h1>Your profile</h1>{params.submitted === "1" && <p className="home-notice order-success" role="status">Your order has been submitted successfully.</p>}<p className="profile-note">Update the information connected to your JemsCreations account.</p><ProfileForm userId={user.id} initialName={profile?.display_name ?? ""} initialEmail={user.email ?? ""} /><div className="profile-orders"><span className="eyebrow">Order history</span><h2>Your past orders</h2>{orders && orders.length > 0 ? <div className="profile-order-list">{orders.map((order) => <div className="profile-order" key={order.id}><div><strong>Order #{order.id}</strong><small>{new Date(order.created_at).toLocaleDateString()}</small></div><div><strong>${Number(order.total).toFixed(2)}</strong><span className={`status ${order.status}`}>{order.status}</span></div></div>)}</div> : <p className="empty-state">You have not submitted any orders yet.</p>}</div><div className="wishlist-section"><span className="eyebrow">Saved pieces</span><h2>Your wishlist</h2><WishlistList products={wishlistProducts} /></div></section></PageShell>;
}
