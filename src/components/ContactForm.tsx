"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ContactFormProps = { initialName?: string; initialEmail?: string };

export function ContactForm({ initialName = "", initialEmail = "" }: ContactFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSending(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error: sendError } = await supabase.from("messages").insert({
      user_id: user?.id ?? null,
      sender_name: name.trim(),
      sender_email: email.trim(),
      subject: subject.trim(),
      content: content.trim(),
    });

    if (sendError) {
      setError(sendError.message);
      setIsSending(false);
      return;
    }

    setMessage("Your message was sent successfully. We’ll be in touch soon.");
    setSubject("");
    setContent("");
    setIsSending(false);
  }

  return <div className="contact-form-column">
    {error && <p className="auth-feedback error message-status" role="alert">{error}</p>}
    {message && <p className="auth-feedback success message-status" role="status" aria-live="polite">{message}</p>}
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>Name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} required /></label>
      <label>Message<textarea rows={6} value={content} onChange={(event) => setContent(event.target.value)} required /></label>
      <button className="button" type="submit" disabled={isSending}>{isSending ? "Sending…" : "Send message"}</button>
    </form>
  </div>;
}
