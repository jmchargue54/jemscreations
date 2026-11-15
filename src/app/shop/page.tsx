import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/SiteChrome";
import { ShopBrowser } from "@/components/ShopBrowser";
import { getAvailableProducts } from "@/lib/products";

export default async function ShopPage() {
  const { products, error } = await getAvailableProducts();
  return <PageShell><PageIntro eyebrow="The collection" title="Shop one-of-a-kind pieces">Because every piece is handmade, availability changes as new creations find their homes.</PageIntro><section className="section shop-section">{error ? <div className="database-message"><h2>We’re preparing the collection.</h2><p>The shop could not load its products yet. Confirm that the JemsCreations database migration has been run in Supabase.</p><small>{error}</small></div> : <ShopBrowser products={products} />}{!error && products.length === 0 && <div className="database-message"><h2>The collection is coming together.</h2><p>There are no active products yet. Add the first piece from the administrator dashboard or Supabase Table Editor.</p></div>}</section></PageShell>;
}
