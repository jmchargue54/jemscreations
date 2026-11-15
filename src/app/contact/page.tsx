import { PageShell } from "@/components/SiteChrome";
import { PageIntro } from "@/components/PageIntro";
import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/components/ContactForm";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <PageShell><PageIntro eyebrow="Say hello" title="Let’s talk.">Have a question about a piece, an order, or finding JemsCreations in person? Send a message.</PageIntro><section className="form-section"><ContactForm initialName={user?.user_metadata?.display_name ?? ""} initialEmail={user?.email ?? ""} /><aside className="contact-aside"><h2>Find Jems online</h2><p>See new pieces and behind-the-scenes making on social media.</p><a className="text-link" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram →</a><a className="text-link" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook →</a></aside></section></PageShell>;
}
