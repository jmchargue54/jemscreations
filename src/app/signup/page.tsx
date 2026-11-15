import { AuthForm } from "@/components/AuthForm";
import { PageShell } from "@/components/SiteChrome";

export default function SignupPage() { return <PageShell><section className="auth-page"><span className="eyebrow">Join the community</span><h1>Create an account</h1><p>Keep your favorites, orders, and wishlist all in one place.</p><AuthForm mode="signup" /></section></PageShell>; }
