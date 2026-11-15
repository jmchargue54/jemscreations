import { PageShell } from "@/components/SiteChrome";
import { CartManager } from "@/components/CartManager";

export default function CartPage() {
  return <PageShell><section className="section narrow-page"><span className="eyebrow">Your selections</span><h1>Your cart</h1><CartManager /></section></PageShell>;
}
