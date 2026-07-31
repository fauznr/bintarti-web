import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";
import { resolveInvitationId } from "../../../../utils/invitation";

export const dynamic = "force-dynamic";

// GET /api/webhook/comments (Retrieve last 10 webhook logs for debugging)
export async function GET(request: Request) {
  try {
    // Optional Security: check webhook token if configured
    const secretToken = process.env.WEBHOOK_SECRET;
    if (secretToken) {
      const { searchParams } = new URL(request.url);
      const token = searchParams.get("token") || request.headers.get("x-webhook-token");
      if (token !== secretToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { data, error } = await supabase
      .from("webhook_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error reading webhook logs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/webhook/comments (Receive webhook from WordPress)
export async function POST(request: Request) {
  let rawBody: any = null;
  let resolvedInvitationId: string | null = null;
  
  try {
    // Optional Security check
    const secretToken = process.env.WEBHOOK_SECRET;
    if (secretToken) {
      const { searchParams } = new URL(request.url);
      const token = searchParams.get("token") || request.headers.get("x-webhook-token");
      if (token !== secretToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json();
    rawBody = body;
    console.log("Received comments webhook payload:", body);

    // Extract nested structures from WP Webhooks comment trigger format
    const commentData = body.comment_data || {};
    const currentPostData = body.current_post_data || {};
    const commentMeta = body.comment_meta || {};

    const name = body.name || 
                 body.comment_author || 
                 body.author_name || 
                 body.author || 
                 commentData.comment_author || 
                 "Tamu";

    const comment = body.comment || 
                    body.comment_content || 
                    body.content || 
                    body.message || 
                    commentData.comment_content;

    // Support both English (rsvp, rsvp_status) and Indonesian (konfirmasi, kehadiran) keys
    let rsvpStatusRaw = body.rsvp || body.rsvp_status || body.rsvp_meta || body.konfirmasi || body.kehadiran || "";
    if (!rsvpStatusRaw && commentMeta) {
      const rsvpVal = commentMeta.konfirmasi || 
                      commentMeta.kehadiran || 
                      commentMeta.rsvp_status || 
                      commentMeta.rsvp || 
                      (body.comment_meta && (body.comment_meta.konfirmasi || body.comment_meta.kehadiran || body.comment_meta.rsvp_status || body.comment_meta.rsvp));
      if (Array.isArray(rsvpVal)) {
        rsvpStatusRaw = rsvpVal[0];
      } else if (typeof rsvpVal === "string") {
        rsvpStatusRaw = rsvpVal;
      }
    }

    // Normalize RSVP status to standard Indonesian terms
    let rsvpStatus = "";
    if (rsvpStatusRaw) {
      const rsvpLower = String(rsvpStatusRaw).toLowerCase();
      if (rsvpLower.includes("hadir") && !rsvpLower.includes("tidak")) {
        rsvpStatus = "Hadir";
      } else if (rsvpLower.includes("tidak") || rsvpLower.includes("absen")) {
        rsvpStatus = "Tidak Hadir";
      } else if (rsvpLower.includes("ragu") || rsvpLower.includes("tentative") || rsvpLower.includes("maybe")) {
        rsvpStatus = "Ragu-ragu";
      } else {
        rsvpStatus = String(rsvpStatusRaw).charAt(0).toUpperCase() + String(rsvpStatusRaw).slice(1);
      }
    }

    // Resolve invitation slug/ID from payload (supporting root, nested post, and current_post_data)
    const slugOrId = body.slug || 
                     body.post_slug || 
                     body.post_name || 
                     body.invitation_id || 
                     body.id ||
                     currentPostData.post_name ||
                     (body.post && (body.post.post_name || body.post.post_title || body.post.ID || body.post.id));

    const url = body.url || 
                body.post_permalink || 
                body.permalink || 
                body.link_undangan || 
                body.link ||
                currentPostData.guid ||
                (body.post && (body.post.guid || body.post.permalink || body.post.url));

    if (!comment) {
      await logWebhook("comment_created", body, null, "error", "Comment content is required");
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    let invitationId = null;

    if (slugOrId) {
      const resolved = await resolveInvitationId(slugOrId);
      const { data: direct } = await supabase
        .from("invitations")
        .select("id")
        .eq("id", resolved);
      if (direct && direct.length > 0) {
        invitationId = resolved;
      }
    }

    if (!invitationId && url) {
      try {
        const cleanUrl = url.replace(/\/$/, "");
        const lastSegment = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
        if (lastSegment) {
          const resolved = await resolveInvitationId(lastSegment);
          const { data: direct } = await supabase
            .from("invitations")
            .select("id")
            .eq("id", resolved);
          if (direct && direct.length > 0) {
            invitationId = resolved;
          }
        }
      } catch (e) {
        console.error("Error parsing URL in webhook:", e);
      }
    }

    resolvedInvitationId = invitationId;

    if (!invitationId) {
      console.warn("Could not resolve invitation ID for payload:", body);
      await logWebhook("comment_created", body, null, "error", "Could not resolve invitation ID");
      return NextResponse.json({ 
        error: "Could not resolve invitation ID. Please ensure the invitation exists and the URL/slug matches." 
      }, { status: 404 });
    }

    // Insert comment into guest_comments table
    const { data, error } = await supabase
      .from("guest_comments")
      .insert([
        {
          invitation_id: invitationId,
          name: name.trim(),
          comment: comment.trim(),
          rsvp_status: rsvpStatus ? rsvpStatus : null
        }
      ])
      .select();

    if (error) {
      console.error("Error inserting comment:", error);
      await logWebhook("comment_created", body, invitationId, "error", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log success
    await logWebhook("comment_created", body, invitationId, "success");

    return NextResponse.json({ 
      success: true, 
      message: "Comment saved successfully",
      comment: data[0]
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    await logWebhook("comment_created", rawBody || {}, resolvedInvitationId, "error", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to log webhooks into Supabase (fails silently if table is not yet created)
async function logWebhook(eventType: string, payload: any, resolvedId: string | null, status: string, errorMessage?: string) {
  try {
    await supabase
      .from("webhook_logs")
      .insert([
        {
          event_type: eventType,
          payload,
          resolved_id: resolvedId,
          status,
          error_message: errorMessage || null
        }
      ]);
  } catch (err) {
    console.warn("Could not write to webhook_logs table (is the table created?):", err);
  }
}
