import { PageShell } from "@/components/SiteChrome";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (!user.email_confirmed_at) {
    return <PageShell><section className="section checkout-page"><span className="eyebrow">Email confirmation required</span><h1>Confirm your email first</h1><p className="checkout-note">Please confirm your email address before checking out. Open the confirmation email we sent you, then log in again to continue.</p><Link className="button" href="/login">Back to log in</Link></section></PageShell>;
  }

  return <PageShell><section className="section checkout-page"><span className="eyebrow">Almost yours</span><h1>Submit your order</h1><p className="checkout-note">Choose Venmo if you have already paid, or provide card details to pay by card.</p><CheckoutForm email={user.email ?? ""} /></section></PageShell>;
}
