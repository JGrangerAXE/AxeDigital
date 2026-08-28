import type { Metadata } from "next";
import { CareersAdmin } from "@/components/admin/CareersAdmin";

export const metadata: Metadata = { title: "Careers Admin", robots: { index: false, follow: false } };
export default function CareersAdminPage() { return <div className="surface-dark min-h-screen pb-24 pt-32"><CareersAdmin /></div>; }
