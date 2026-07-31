import { supabase } from "./supabase";

export async function resolveInvitationId(
  idOrSlug: string,
  typeHint?: string
): Promise<string> {
  if (!idOrSlug) return idOrSlug;

  // 1. Check if it's already a valid invitation ID
  const { data: direct } = await supabase
    .from("invitations")
    .select("id")
    .eq("id", idOrSlug);

  if (direct && direct.length > 0) {
    return idOrSlug;
  }

  // 2. Look up by link_tamu or link_undangan containing the slug exactly (matching segment)
  let matchedQuery = supabase
    .from("invitations")
    .select("id")
    .or(
      `link_tamu.ilike.%/${idOrSlug},link_tamu.ilike.%/${idOrSlug}/,link_undangan.ilike.%/${idOrSlug},link_undangan.ilike.%/${idOrSlug}/`
    );

  if (typeHint) {
    matchedQuery = matchedQuery.ilike("type", typeHint.trim());
  }

  const { data: matched } = await matchedQuery;

  if (matched && matched.length > 0) {
    return matched[0].id;
  }

  return idOrSlug;
}

export async function resolveInvitationRow(idOrSlug: string) {
  if (!idOrSlug) return null;

  // 1. Direct match on ID
  const { data: direct } = await supabase
    .from("invitations")
    .select("id, receptionist_pin, is_pro")
    .eq("id", idOrSlug);

  if (direct && direct.length > 0) {
    return direct[0];
  }

  // 2. Slug match in links exactly (matching segment)
  const { data: matched } = await supabase
    .from("invitations")
    .select("id, receptionist_pin, is_pro")
    .or(
      `link_tamu.ilike.%/${idOrSlug},link_tamu.ilike.%/${idOrSlug}/,link_undangan.ilike.%/${idOrSlug},link_undangan.ilike.%/${idOrSlug}/`
    );

  if (matched && matched.length > 0) {
    return matched[0];
  }

  return null;
}

export function generateInvitationSlug(type: string, fullName: string): string {
  const cleanName = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, ""); // strip leading/trailing dashes
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${type.toLowerCase()}_${cleanName || "tamu"}-${randomSuffix}`;
}

export function calculateExpiryDate(eventDate?: string): string {
  let baseDate = new Date();
  if (eventDate) {
    const parsed = Date.parse(eventDate);
    if (!isNaN(parsed)) {
      baseDate = new Date(parsed);
    }
  }
  baseDate.setMonth(baseDate.getMonth() + 3);
  return baseDate.toISOString();
}
