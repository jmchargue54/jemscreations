"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProfileFormProps = { userId: string; initialName: string; initialEmail: string };

export function ProfileForm({ userId, initialName, initialEmail }: ProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSaving(true);
    const supabase = createClient();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() || null })
      .eq("id", userId);

    if (profileError) {
      setError(profileError.message);
      setIsSaving(false);
      return;
    }

    if (email.trim().toLowerCase() !== initialEmail.toLowerCase()) {
      const { error: emailError } = await supabase.auth.updateUser({ email: email.trim() });
      if (emailError) {
        setError(emailError.message);
        setIsSaving(false);
        return;
      }
      setMessage("Profile saved. Check your email to confirm the new email address.");
    } else {
      setMessage("Profile saved successfully.");
    }

    setIsSaving(false);
    router.refresh();
  }

  return <>
    <form className="contact-form profile-form" onSubmit={handleSubmit}>
      <label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" /></label>
      <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
      <button className="button" type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Save changes"}</button>
    </form>
    {error && <p className="auth-feedback error" role="alert">{error}</p>}
    {message && <p className="auth-feedback success" role="status">{message}</p>}
  </>;
}
