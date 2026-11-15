"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/data/products";
import { formatCategoryName, PRODUCT_CATEGORIES } from "@/lib/categories";

export function ShopBrowser({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("All pieces");
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () => products.filter((product) =>
      (filter === "All pieces" || product.category.toLowerCase() === filter.toLowerCase()) &&
      product.name.toLowerCase().includes(query.toLowerCase()),
    ),
    [filter, products, query],
  );

  return <>
    <div className="shop-toolbar">
      <div className="filters">{["All pieces", ...PRODUCT_CATEGORIES].map((category) => <button key={category} className={`filter ${filter === category ? "active" : ""}`} onClick={() => setFilter(category)}>{category === "All pieces" ? category : formatCategoryName(category)}</button>)}</div>
      <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pieces" aria-label="Search pieces" />
    </div>
    <div className="products">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    {visible.length === 0 && <p className="empty-state">No pieces match that search yet.</p>}
  </>;
}
