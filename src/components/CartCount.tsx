"use client";

import { useEffect, useState } from "react";
import { CART_STORAGE_KEY, CartItem } from "@/lib/cart";

function readCartCount() {
  try { return (JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as CartItem[]).length; } catch { return 0; }
}

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(readCartCount());
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return <span className="cart-count">{count}</span>;
}
