import Link from "next/link";

type WishlistProduct = { id: number; name: string; price: number; image_url: string | null };
export function WishlistList({ products }: { products: WishlistProduct[] }) {
  if (products.length === 0) return <p className="empty-state">You have not saved any pieces yet.</p>;
  return <div className="wishlist-list">{products.map((product) => <Link className="wishlist-item" href={`/products/${product.id}`} key={product.id}><img src={product.image_url ?? "/images/brand-logo-small.png"} alt="" /><span><strong>{product.name}</strong><small>${Number(product.price).toFixed(2)}</small></span></Link>)}</div>;
}
