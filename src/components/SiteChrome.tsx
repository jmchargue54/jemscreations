import Image from "next/image";
import Link from "next/link";
import { isCurrentUserAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";
import { CartCount } from "@/components/CartCount";

export async function Header() {
  const isAdmin = await isCurrentUserAdmin();
  const { data: { user } } = await (await createClient()).auth.getUser();
  return <><div className="announcement">Handmade with intention · Free local pickup available</div><header className="nav"><Link className="brand" href="/" aria-label="JemsCreations home"><Image src="/images/jems-logo-gem.png" alt="JemsCreations logo" width={45} height={45} /><span className="brand-name">JemsCreations</span></Link><nav className="links" aria-label="Main navigation"><Link href="/shop">Shop</Link><Link href="/about">Our story</Link><Link href="/contact">Contact</Link>{isAdmin && <div className="admin-nav"><Link href="/admin" aria-haspopup="true">Admin</Link><div className="admin-subnav"><Link href="/admin/products">Products</Link><Link href="/orders">Orders</Link><Link href="/admin/discounts">Discounts</Link><Link href="/admin/messages">Messages</Link></div></div>}</nav><div className="nav-actions"><Link className="icon-btn" href={user ? "/profile" : "/login"} aria-label={user ? "Open profile" : "Log in"}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c.8-3.3 3.2-5 7.5-5s6.7 1.7 7.5 5" /></svg></Link>{user && <LogoutButton />}<Link className="icon-btn" href="/cart" aria-label="Shopping cart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg><CartCount /></Link></div></header></>;
}

export function Footer() {
  return <footer><div className="footer-inner"><div><div className="brand-name">JemsCreations</div><div className="footer-copy">© 2026 JemsCreations · Handmade in Washington</div></div><div className="socials"><a href="https://www.instagram.com/creations_jems/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/profile.php?id=61579599052870" target="_blank" rel="noreferrer">Facebook</a></div></div></footer>;
}

export function PageShell({ children }: { children: React.ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }
