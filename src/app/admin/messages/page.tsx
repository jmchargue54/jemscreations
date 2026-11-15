import { PageShell } from "@/components/SiteChrome";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminMessagesManager } from "@/components/AdminMessagesManager";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, sender_name, sender_email, subject, content, status, created_at")
    .order("created_at", { ascending: false });

  return <PageShell><section className="section admin-table-page"><span className="eyebrow">Owner tools</span><h1>Messages</h1>{error ? <div className="database-message"><h2>Messages could not load.</h2><p>{error.message}</p></div> : <AdminMessagesManager initialMessages={(messages ?? []) as NonNullable<typeof messages> extends (infer T)[] ? T[] : never} />}</section></PageShell>;
}
