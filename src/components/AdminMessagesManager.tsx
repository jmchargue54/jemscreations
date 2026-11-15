"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AdminMessage = {
  id: number;
  sender_name: string;
  sender_email: string;
  subject: string;
  content: string;
  status: "new" | "read" | "archived";
  created_at: string;
};

export function AdminMessagesManager({ initialMessages }: { initialMessages: AdminMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [filter, setFilter] = useState<"unread" | "read" | "all">("unread");
  const [error, setError] = useState<string | null>(null);
  const visibleMessages = useMemo(
    () => messages.filter((message) => filter === "all" || (filter === "unread" ? message.status === "new" : message.status === "read")),
    [filter, messages],
  );

  async function updateStatus(id: number, status: "new" | "read") {
    setError(null);
    const { error: updateError } = await createClient().from("messages").update({ status }).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message));
  }

  return <>
    <div className="message-toolbar" aria-label="Message filters">
      <button className={`filter ${filter === "unread" ? "active" : ""}`} type="button" onClick={() => setFilter("unread")}>Unread</button>
      <button className={`filter ${filter === "read" ? "active" : ""}`} type="button" onClick={() => setFilter("read")}>Read</button>
      <button className={`filter ${filter === "all" ? "active" : ""}`} type="button" onClick={() => setFilter("all")}>All messages</button>
    </div>
    {error && <p className="auth-feedback error" role="alert">{error}</p>}
    {visibleMessages.length > 0 ? <div className="message-list">{visibleMessages.map((item) => <article className="message-card" key={item.id}><div className="message-card-header"><div><h2>{item.subject}</h2><p>{item.sender_name} · <a href={`mailto:${item.sender_email}`}>{item.sender_email}</a></p></div><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString()}</time></div><p className="message-content">{item.content}</p><div className="message-card-footer"><span className={`status ${item.status}`}>{item.status}</span><div className="message-actions"><a className="table-action" href={`mailto:${item.sender_email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`} target="_blank" rel="noreferrer">Reply</a>{item.status === "new" ? <button className="table-action" type="button" onClick={() => void updateStatus(item.id, "read")}>Mark as read</button> : <button className="table-action" type="button" onClick={() => void updateStatus(item.id, "new")}>Mark unread</button>}</div></div></article>)}</div> : <p className="empty-state">{filter === "unread" ? "No unread messages." : filter === "read" ? "No read messages." : "No messages have been sent yet."}</p>}
  </>;
}
