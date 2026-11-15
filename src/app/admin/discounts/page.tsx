import { PageShell } from "@/components/SiteChrome";
import { AdminDiscountsManager } from "@/components/AdminDiscountsManager";
import { requireAdmin } from "@/lib/auth";

export default async function DiscountsPage() {
  await requireAdmin();
  return <PageShell><section className="section narrow-page"><span className="eyebrow">Owner tools</span><h1>Discount codes</h1><p>Manage the codes customers can use at checkout.</p><AdminDiscountsManager /></section></PageShell>;
}
