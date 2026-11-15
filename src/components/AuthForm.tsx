"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = { mode: "login" | "signup" };

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  const passwordRequirements = [
    { label: "at least 8 characters", valid: password.length >= 8 },
    { label: "one uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "one lowercase letter", valid: /[a-z]/.test(password) },
    { label: "one number", valid: /\d/.test(password) },
    { label: "one special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const passwordIsValid = passwordRequirements.every((requirement) => requirement.valid);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (isSignup && !passwordIsValid) {
      const missing = passwordRequirements.filter((requirement) => !requirement.valid).map((requirement) => requirement.label);
      const reason = `Password must include ${missing.join(", ")}.`;
      setError(reason);
      window.alert(reason);
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      window.alert("Sign up could not continue: passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const result = isSignup
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/login` } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
      window.alert(`${isSignup ? "Sign up" : "Log in"} failed: ${result.error.message}`);
      setIsSubmitting(false);
      return;
    }

    if (isSignup && !result.data.session) {
      const confirmationMessage = "Account created. Check your email to confirm your account, then log in.";
      window.alert(confirmationMessage);
      setIsSubmitting(false);
      router.push("/login");
      return;
    }

    router.push("/?message=logged-in");
    router.refresh();
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} minLength={isSignup ? 8 : undefined} required />
          {isSignup && <span className="password-requirements">Password must have:
            <span>{passwordRequirements.map((requirement) => <span className={requirement.valid ? "requirement valid" : "requirement"} key={requirement.label}>{requirement.valid ? "✓" : "•"} {requirement.label}</span>)}</span>
          </span>}
        </label>
        {isSignup && <label>Confirm password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={6} required /></label>}
        <button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? (isSignup ? "Creating account…" : "Logging in…") : isSignup ? "Sign up" : "Log in"}</button>
      </form>
      {error && <p className="auth-feedback error" role="alert">{error}</p>}
      {message && <p className="auth-feedback success" role="status">{message}</p>}
      <p className="form-note">{isSignup ? "Already have an account? " : "New to JemsCreations? "}<Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link></p>
    </>
  );
}
