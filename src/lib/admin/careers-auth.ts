import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isCareersAdminEmail } from "@/lib/admin/careers-allowlist";

export class AdminAuthenticationError extends Error {}

export async function requireCareersAdmin(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!token) throw new AdminAuthenticationError("Authentication required.");
  const { data, error } = await createServerSupabaseClient().auth.getUser(token);
  if (error || !data.user || !isCareersAdminEmail(data.user.email, process.env.CAREERS_ADMIN_EMAILS)) throw new AdminAuthenticationError("Authorized Axe admin access required.");
  return data.user;
}
