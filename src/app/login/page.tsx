import { AuthForm } from "@/components/AuthForm";
import { PageShell } from "@/components/SiteChrome";
export default function LoginPage() { return <PageShell><section className="auth-page"><span className="eyebrow">Welcome back</span><h1>Log in</h1><p>Save favorites, follow your orders, and keep your wishlist close.</p><AuthForm mode="login" /></section></PageShell>; }
