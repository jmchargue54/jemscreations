import { PageShell } from "@/components/SiteChrome";
import { AdminProductsManager } from "@/components/AdminProductsManager";
export default function AdminProductsPage() { return <PageShell><section className="section admin-table-page"><span className="eyebrow">Owner tools</span><h1>Manage products</h1><AdminProductsManager /></section></PageShell>; }
