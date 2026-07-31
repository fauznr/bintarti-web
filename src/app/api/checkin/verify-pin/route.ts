import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

export const dynamic = "force-dynamic";

import { resolveInvitationRow } from "../../../../utils/invitation";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitationId, pin } = body;

    if (!invitationId || !pin) {
      return NextResponse.json({ error: "invitationId and pin are required" }, { status: 400 });
    }

    const invitation = await resolveInvitationRow(invitationId);

    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    // STRICT PREMIUM/PRO PACKAGE CHECK: Block scanner login if not PRO package
    if (!invitation.is_pro) {
      return NextResponse.json({ 
        success: false, 
        error: "Fitur Scanner hanya tersedia untuk paket PRO. Harap hubungi admin untuk upgrade." 
      }, { status: 403 });
    }

    // Default to "2104" fallback if receptionist_pin is not set during transition
    const validPin = invitation.receptionist_pin || "2104";

    if (pin.toString().trim() === validPin.toString().trim()) {
      return NextResponse.json({ success: true, invitationId: invitation.id });
    } else {
      return NextResponse.json({ success: false, error: "PIN Otorisasi Salah!" }, { status: 401 });
    }
  } catch (e: any) {
    console.error("verify-pin endpoint error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
