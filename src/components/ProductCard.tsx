"use client";

import Link from "next/link";
import { Product } from "@/data/products";
import { WishlistButton } from "@/components/WishlistButton";
import { formatCategoryName } from "@/lib/categories";

export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card"><div className="product-image"><Link href={`/products/${product.id}`}><img src={product.image} alt={product.alt} /></Link><WishlistButton productId={product.id} compact /></div><Link href={`/products/${product.id}`}><div className="product-info"><h3>{product.name}</h3><div className="product-meta">{formatCategoryName(product.category)} · {product.sold ? "Sold" : "One available"}</div><div className="price">${product.price.toFixed(2)}</div></div></Link></article>;
}
