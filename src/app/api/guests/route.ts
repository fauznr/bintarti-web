import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabase";

export const dynamic = "force-dynamic";

import { resolveInvitationId } from "../../../utils/invitation";


// GET /api/guests?invitationId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawInvitationId = searchParams.get("invitationId");
    const typeHint = searchParams.get("type") || undefined;

    if (!rawInvitationId) {
      return NextResponse.json({ error: "invitationId is required" }, { status: 400 });
    }

    const invitationId = await resolveInvitationId(rawInvitationId, typeHint);

    // Get guests from Supabase
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase GET guests error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert snake_case properties to expected camelCase for client compatibility
    const formattedGuests = (data || []).map((g) => ({
      id: g.id,
      invitationId: g.invitation_id,
      name: g.name,
      code: g.code,
      sent: g.sent,
      present: g.present,
      checkinTime: g.checkin_time
    }));

    return NextResponse.json(formattedGuests);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/guests
// Body: { invitationId, guests: [{ name, code }] }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitationId: rawInvitationId, guests, type: typeHint } = body;

    if (!rawInvitationId || !Array.isArray(guests)) {
      return NextResponse.json({ error: "invitationId and guests array are required" }, { status: 400 });
    }

    const invitationId = await resolveInvitationId(rawInvitationId, typeHint);

    // Build array of insert rows
    const rows = guests.map((g: any) => ({
      invitation_id: invitationId,
      name: g.name.trim(),
      code: g.code,
      sent: false,
      present: false,
      checkin_time: null
    }));

    // Upsert guests to prevent duplicate guest names on the same invitation ID
    const { data, error } = await supabase
      .from("guests")
      .upsert(rows, { onConflict: "invitation_id,name" })
      .select();

    if (error) {
      console.error("Supabase POST guests error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/guests?invitationId=...&code=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawInvitationId = searchParams.get("invitationId");
    const code = searchParams.get("code");
    const typeHint = searchParams.get("type") || undefined;

    if (!rawInvitationId || !code) {
      return NextResponse.json({ error: "invitationId and code are required" }, { status: 400 });
    }

    const invitationId = await resolveInvitationId(rawInvitationId, typeHint);

    const { error } = await supabase
      .from("guests")
      .delete()
      .eq("invitation_id", invitationId)
      .eq("code", code);

    if (error) {
      console.error("Supabase DELETE guest error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "success" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/guests
// Body: { invitationId, code, sent, present }
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { invitationId: rawInvitationId, code, sent, present, type: typeHint } = body;

    if (!rawInvitationId || !code) {
      return NextResponse.json({ error: "invitationId and code are required" }, { status: 400 });
    }

    const invitationId = await resolveInvitationId(rawInvitationId, typeHint);

    // Check if invitation is expired
    const { data: invData, error: invError } = await supabase
      .from("invitations")
      .select("expiry_date")
      .eq("id", invitationId)
      .single();

    if (!invError && invData && invData.expiry_date) {
      const expiry = new Date(invData.expiry_date);
      if (expiry < new Date()) {
        return NextResponse.json(
          { error: "Undangan telah kedaluwarsa. Check-in dinonaktifkan." },
          { status: 403 }
        );
      }
    }

    // Check if guest exists
    const { data: existing, error: fetchError } = await supabase
      .from("guests")
      .select("*")
      .eq("invitation_id", invitationId)
      .eq("code", code);

    if (fetchError) {
      console.error("Supabase PATCH check error:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    let guestRow = existing?.[0];

    if (!guestRow) {
      // Auto-register guest if not found using base64 decoding helper
      let name = "";
      try {
        name = decodeURIComponent(escape(atob(code)));
      } catch (e) {
        try {
          name = atob(code);
        } catch (err) {
          name = "Tamu Undangan";
        }
      }

      // Insert new guest Row
      const { data: inserted, error: insertError } = await supabase
        .from("guests")
        .insert({
          invitation_id: invitationId,
          name: name.trim(),
          code: code,
          sent: false,
          present: false,
          checkin_time: null
        })
        .select();

      if (insertError) {
        console.error("Supabase PATCH auto-register error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      guestRow = inserted?.[0];
    }

    // Prepare updates
    const updates: any = {};
    if (sent !== undefined) updates.sent = !!sent;
    if (present !== undefined) {
      // ── Duplicate check-in guard ──────────────────────────────────────────
      // If the guest is ALREADY checked in and we're trying to mark them
      // present again, reject the request with 409 Conflict.
      if (present === true && guestRow.present === true) {
        return NextResponse.json(
          {
            error: "Tamu sudah melakukan check-in sebelumnya.",
            alreadyCheckedIn: true,
            checkinTime: guestRow.checkin_time,
            guestName: guestRow.name
          },
          { status: 409 }
        );
      }
      // ─────────────────────────────────────────────────────────────────────
      updates.present = !!present;
      updates.checkin_time = present ? new Date().toISOString() : null;
    }

    // Perform update
    const { data: updated, error: updateError } = await supabase
      .from("guests")
      .update(updates)
      .eq("id", guestRow.id)
      .select();

    if (updateError) {
      console.error("Supabase PATCH update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const formattedUpdated = {
      id: updated?.[0].id,
      invitationId: updated?.[0].invitation_id,
      name: updated?.[0].name,
      code: updated?.[0].code,
      sent: updated?.[0].sent,
      present: updated?.[0].present,
      checkinTime: updated?.[0].checkin_time
    };

    return NextResponse.json({ status: "success", guest: formattedUpdated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
