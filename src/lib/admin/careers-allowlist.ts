export function isCareersAdminEmail(email: string | null | undefined, configured?: string) {
  if (!email || !configured) return false;
  const allowed = configured.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}
