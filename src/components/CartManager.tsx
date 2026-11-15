"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItem, CART_STORAGE_KEY } from "@/lib/cart";

export function CartManager() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]")); } catch { setItems([]); }
  }, []);

  function removeItem(id: number) {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event("cart-updated"));
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <>{items.length === 0 ? <><p className="empty-state">Your cart is empty.</p><Link className="button" href="/shop">Continue shopping</Link></> : <><div className="cart-list">{items.map((item) => <div className="cart-row" key={item.id}><div className="cart-thumb"><img src={item.image} alt={item.alt} /></div><div><h2>{item.name}</h2><p className="product-meta">One-of-a-kind piece · Quantity 1</p><button className="table-action" type="button" onClick={() => removeItem(item.id)}>Remove</button></div><strong>${item.price.toFixed(2)}</strong></div>)}</div><div className="cart-total"><span>Estimated total</span><strong>${total.toFixed(2)}</strong></div><Link className="button" href="/checkout">Continue to checkout</Link></>}</>;
}
