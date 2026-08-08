import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabase";

export const dynamic = "force-dynamic";

import { resolveInvitationId } from "../../../utils/invitation";


// GET /api/comments?invitationId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawInvitationId = searchParams.get("invitationId");

    if (!rawInvitationId) {
      return NextResponse.json({ error: "invitationId is required" }, { status: 400 });
    }

    const invitationId = await resolveInvitationId(rawInvitationId);

    const { data, error } = await supabase
      .from("guest_comments")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Comments GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/comments?id=...&invitationId=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("id");
    const rawInvitationId = searchParams.get("invitationId");

    if (!commentId || !rawInvitationId) {
      return NextResponse.json({ error: "id and invitationId are required" }, { status: 400 });
    }

    const invitationId = await resolveInvitationId(rawInvitationId);

    // 1. Verify the comment belongs to this invitation before deleting (security check)
    const { data: comment, error: fetchError } = await supabase
      .from("guest_comments")
      .select("invitation_id")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.invitation_id !== invitationId) {
      return NextResponse.json({ error: "Unauthorized access to this comment" }, { status: 403 });
    }

    // 2. Perform deletion
    const { error: deleteError } = await supabase
      .from("guest_comments")
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      console.error("Error deleting comment:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error: any) {
    console.error("Comments DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitationId, name, comment, rsvpStatus, turnstileToken } = body;

    if (!invitationId || !name || !comment) {
      return NextResponse.json({ error: "invitationId, name, and comment are required" }, { status: 400 });
    }

    // Turnstile Validation
    if (!turnstileToken) {
      return NextResponse.json({ error: "CAPTCHA token is required" }, { status: 400 });
    }

    const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const secret = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

    const verifyRes = await fetch(verifyEndpoint, {
      method: 'POST',
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(turnstileToken)}`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      console.error("Turnstile verification failed:", verifyData);
      return NextResponse.json({ error: "CAPTCHA verification failed" }, { status: 403 });
    }

    const resolvedId = await resolveInvitationId(invitationId);

    const { data, error } = await supabase
      .from("guest_comments")
      .insert({
        invitation_id: resolvedId,
        name: name.trim(),
        comment: comment.trim(),
        rsvp_status: rsvpStatus || null
      })
      .select();

    if (error) {
      console.error("Error inserting comment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, comment: data?.[0] });
  } catch (error: any) {
    console.error("Comments POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
