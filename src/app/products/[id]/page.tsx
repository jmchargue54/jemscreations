import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/SiteChrome";
import { AddToCartButton } from "@/components/AddToCartButton";
import { WishlistButton } from "@/components/WishlistButton";
import { getProductById } from "@/lib/products";
import { formatCategoryName } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { product } = await getProductById(Number(id));
  if (!product) notFound();
  return <PageShell><section className="detail-page"><Link className="back-link" href="/shop">← Back to shop</Link><div className="detail-grid"><div className="detail-image"><img src={product.image} alt={product.alt} /></div><div className="detail-copy"><span className="eyebrow">{formatCategoryName(product.category)} · Handmade</span><h1>{product.name}</h1><div className="detail-price">${product.price.toFixed(2)}</div><p>{product.description}</p><p className="availability">{product.sold ? "Currently unavailable" : "One unique piece · Available now"}</p>{!product.sold && <AddToCartButton product={product} />}<WishlistButton productId={product.id} /></div></div></section></PageShell>;
}
