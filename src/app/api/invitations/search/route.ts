import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";

export const dynamic = "force-dynamic";

// GET /api/invitations/search?query=...&type=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const type = searchParams.get("type"); // "whatsapp" | "shopee" | "slug"

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const t = type || "whatsapp";
    let supabaseQuery = supabase.from("invitations").select("*");

    if (t === "whatsapp") {
      supabaseQuery = supabaseQuery.eq("whatsapp", query.trim());
    } else if (t === "shopee") {
      supabaseQuery = supabaseQuery.eq("shopee_order", query.trim());
    } else if (t === "slug") {
      supabaseQuery = supabaseQuery.eq("id", query.trim());
    } else {
      return NextResponse.json({ error: "Invalid search type" }, { status: 400 });
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error("Supabase search error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ found: false });
    }

    const formattedResults = data.map((item) => ({
      found: true,
      id: item.id,
      source: item.type, // 'Khitan' or 'Birthday'
      namaAnak: item.full_name || "",
      tema: item.theme || "",
      status: item.status || "Diproses",
      linkUndangan: item.link_undangan || "",
      linkTamu: item.link_tamu || "",
      tanggalAcara: item.event_date || "",
      waktuAcara: item.event_time || "",
      tempatAcara: item.event_location || "",
      birthdayAge: item.birthday_age || "",
      childOrder: item.child_order || "",
      receptionistPin: item.receptionist_pin || "",
      isPro: !!item.is_pro,
      expiryDate: item.expiry_date || null,
      // Keep keys for search query metadata
      originalSearchQuery: query,
      originalSearchType: t
    }));

    // If searching by slug (direct page access), return a single object, else return array
    if (t === "slug") {
      return NextResponse.json(formattedResults[0]);
    }

    return NextResponse.json(formattedResults);
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
