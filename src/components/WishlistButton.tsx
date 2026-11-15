"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type WishlistButtonProps = { productId: number; compact?: boolean };

export function WishlistButton({ productId, compact = false }: WishlistButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let active = true;
    async function loadSavedState() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("wishlist_items").select("product_id").eq("user_id", user.id).eq("product_id", productId).maybeSingle();
      if (active) setSaved(Boolean(data));
    }
    void loadSavedState();
    return () => { active = false; };
  }, [productId, supabase]);

  async function toggleWishlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setIsSaving(true);
    const result = saved
      ? await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", productId)
      : await supabase.from("wishlist_items").insert({ user_id: user.id, product_id: productId });
    if (!result.error) setSaved(!saved);
    setIsSaving(false);
  }

  return <button className={`${compact ? "heart" : "wishlist-button"} ${saved ? "saved" : ""}`} type="button" aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved} disabled={isSaving} onClick={(event) => { event.preventDefault(); event.stopPropagation(); void toggleWishlist(); }}>{compact ? "♡" : saved ? "♥ Saved to wishlist" : "♡ Save to wishlist"}</button>;
}
