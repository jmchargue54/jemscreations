"use client";

import { useState } from "react";
import { CartItem, CART_STORAGE_KEY } from "@/lib/cart";

export function AddToCartButton({ product }: { product: CartItem }) {
  const [added, setAdded] = useState(false);
  function addToCart() {
    const current: CartItem[] = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    if (!current.some((item) => item.id === product.id)) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...current, product]));
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
  }
  return <><button className="button" type="button" onClick={addToCart}>{added ? "Added to cart" : "Add to cart"}</button>{added && <p className="cart-added-message" role="status" aria-live="polite">Item added to cart.</p>}</>;
}
