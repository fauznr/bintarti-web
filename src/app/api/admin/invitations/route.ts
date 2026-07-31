import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabase";
import { uploadBase64ToStorage } from "../../../../utils/storage";
import { generateInvitationSlug, calculateExpiryDate } from "../../../../utils/invitation";
import { validateSession } from "../../../../utils/auth";

export const dynamic = "force-dynamic";


// GET /api/admin/invitations
// Fetch all invitations ordered by creation date
export async function GET(request: Request) {
  if (!(await validateSession(request))) {
    return NextResponse.json({ error: "Unauthorized. Invalid PIN." }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .not("full_name", "ilike", "%Tema Template%")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch invitations error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format fields for frontend consistency
    const formatted = (data || []).map((item) => {
      // Parse weddingData from notes JSON for Wedding type entries
      let weddingData: any = {};
      if (item.type?.toLowerCase() === "wedding" && item.notes) {
        try {
          const parsed = JSON.parse(item.notes);
          // Exclude adminNoteText from weddingData
          const { adminNoteText, ...rest } = parsed;
          weddingData = rest;
        } catch (e) {
          // notes is not JSON, leave weddingData empty
        }
      }

      return {
        id: item.id,
        type: item.type,
        whatsapp: item.whatsapp,
        shopeeOrder: item.shopee_order,
        theme: item.theme,
        music: item.music,
        birthdayAge: item.birthday_age || "",
        fullName: item.full_name,
        nickname: item.nickname,
        parentsName: item.parents_name,
        childOrder: item.child_order || "",
        eventDate: item.event_date,
        eventTime: item.event_time,
        eventLocation: item.event_location,
        schedule: item.schedule || "",
        invitedGuests: item.invited_guests || "",
        bankAccount: item.bank_account || "",
        giftAddress: item.gift_address || "",
        mapsLink: item.maps_link || "",
        videoLink: item.video_link || "",
        status: item.status || "Diproses",
        linkUndangan: item.link_undangan || "",
        linkTamu: item.link_tamu || "",
        notes: item.notes || "",
        receptionistPin: item.receptionist_pin || "",
        isPro: !!item.is_pro,
        expiryDate: item.expiry_date || null,
        childPhotoUrl: item.child_photo_url || "",
        galleryImages: item.gallery_images || [],
        activitiesPhotoUrl: item.activities_photo_url || "",
        layoutConfig: item.layout_config || null,
        weddingData,
        createdAt: item.created_at
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Admin fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/invitations
// Update invitation status, linkUndangan, linkTamu, notes, or details
export async function PATCH(request: Request) {
  if (!(await validateSession(request))) {
    return NextResponse.json({ error: "Unauthorized. Invalid PIN." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      id, 
      status, 
      linkUndangan, 
      linkTamu, 
      notes, 
      isPro, 
      expiryDate,
      fullName,
      nickname,
      parentsName,
      childOrder,
      birthdayAge,
      eventDate,
      eventTime,
      eventLocation,
      theme,
      music,
      schedule,
      invitedGuests,
      bankAccount,
      giftAddress,
      mapsLink,
      videoLink,
      whatsapp,
      shopeeOrder,
      receptionistPin,
      childPhotoUrl,
      galleryImages,
      activitiesPhotoUrl,
      layoutConfig
    } = body;

    if (!id) {
      return NextResponse.json({ error: "invitation ID is required" }, { status: 400 });
    }

    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (linkUndangan !== undefined) updates.link_undangan = linkUndangan.trim();
    if (linkTamu !== undefined) updates.link_tamu = linkTamu.trim();
    if (notes !== undefined) updates.notes = notes.trim();
    if (isPro !== undefined) updates.is_pro = !!isPro;
    if (expiryDate !== undefined) updates.expiry_date = expiryDate ? new Date(expiryDate).toISOString() : null;

    // Event detail updates
    if (fullName !== undefined) updates.full_name = fullName.trim();
    if (nickname !== undefined) updates.nickname = nickname.trim();
    if (parentsName !== undefined) updates.parents_name = parentsName.trim();
    if (childOrder !== undefined) updates.child_order = childOrder.trim();
    if (birthdayAge !== undefined) updates.birthday_age = birthdayAge.trim();
    if (eventDate !== undefined) updates.event_date = eventDate.trim();
    if (eventTime !== undefined) updates.event_time = eventTime.trim();
    if (eventLocation !== undefined) updates.event_location = eventLocation.trim();
    if (theme !== undefined) updates.theme = theme.trim();
    if (music !== undefined) updates.music = music.trim();
    if (schedule !== undefined) updates.schedule = schedule.trim();
    if (invitedGuests !== undefined) updates.invited_guests = invitedGuests.trim();
    if (bankAccount !== undefined) updates.bank_account = bankAccount.trim();
    if (giftAddress !== undefined) updates.gift_address = giftAddress.trim();
    if (mapsLink !== undefined) updates.maps_link = mapsLink.trim();
    if (videoLink !== undefined) updates.video_link = videoLink.trim();
    if (whatsapp !== undefined) updates.whatsapp = whatsapp.trim();
    if (shopeeOrder !== undefined) updates.shopee_order = shopeeOrder.trim();
    if (receptionistPin !== undefined) updates.receptionist_pin = receptionistPin.trim();
    if (childPhotoUrl !== undefined) {
      if (childPhotoUrl && childPhotoUrl.startsWith("data:")) {
        console.log("Admin uploading new child photo...");
        const newUrl = await uploadBase64ToStorage(childPhotoUrl, id, "profile.webp");
        updates.child_photo_url = newUrl;
      } else {
        updates.child_photo_url = childPhotoUrl ? childPhotoUrl.trim() : null;
      }
    }

    if (galleryImages !== undefined) {
      const parsedImages = Array.isArray(galleryImages) ? galleryImages : [];
      const finalImages: string[] = [];
      for (let i = 0; i < parsedImages.length; i++) {
        const img = parsedImages[i];
        if (img && img.startsWith("data:")) {
          console.log(`Admin uploading new gallery photo ${i + 1}...`);
          const timestamp = Date.now();
          const newUrl = await uploadBase64ToStorage(img, id, `gallery_${timestamp}_${i}.webp`);
          finalImages.push(newUrl);
        } else if (img) {
          finalImages.push(img.trim());
        }
      }
      updates.gallery_images = finalImages;
    }

    if (activitiesPhotoUrl !== undefined) {
      if (activitiesPhotoUrl && activitiesPhotoUrl.startsWith("data:")) {
        console.log("Admin uploading new activities photo...");
        const newUrl = await uploadBase64ToStorage(activitiesPhotoUrl, id, "activities.webp");
        updates.activities_photo_url = newUrl;
      } else {
        updates.activities_photo_url = activitiesPhotoUrl ? activitiesPhotoUrl.trim() : null;
      }
    }

    if (layoutConfig !== undefined) {
      if (typeof layoutConfig === "string") {
        try {
          updates.layout_config = JSON.parse(layoutConfig);
        } catch (e) {
          updates.layout_config = null;
        }
      } else {
        updates.layout_config = layoutConfig;
      }
    }

    // Check if the record exists in the database
    const { data: existing, error: checkError } = await supabase
      .from("invitations")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase check invitation error:", checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    let resData;
    let resError;

    if (!existing) {
      // If it doesn't exist, it's a theme template config. Insert a default row for it!
      const insertData = {
        id,
        type: "Birthday",
        full_name: `Default Theme ${id}`,
        nickname: "",
        parents_name: "",
        whatsapp: "0000000000",
        shopee_order: "",
        theme: id.startsWith("birthday-") ? `Birthday ${id.split("-")[1]}` : id,
        music: "",
        event_date: "",
        event_time: "",
        event_location: "",
        maps_link: "",
        video_link: "",
        is_pro: false,
        status: "Diproses",
        receptionist_pin: "0000",
        link_undangan: `https://bintarti.store/sandbox-tema/${id}`,
        link_tamu: `https://bintarti.store/sandbox-tema/${id}#`,
        layout_config: layoutConfig || null
      };

      const { data, error } = await supabase
        .from("invitations")
        .insert([insertData])
        .select();

      resData = data;
      resError = error;
    } else {
      const { data, error } = await supabase
        .from("invitations")
        .update(updates)
        .eq("id", id)
        .select();

      resData = data;
      resError = error;
    }

    if (resError) {
      console.error("Supabase update invitation error:", resError);
      return NextResponse.json({ error: resError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, invitation: resData?.[0] });
  } catch (error: any) {
    console.error("Admin update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/invitations?id=...
// Delete an invitation
export async function DELETE(request: Request) {
  if (!(await validateSession(request))) {
    return NextResponse.json({ error: "Unauthorized. Invalid PIN." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "invitation ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete invitation error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/invitations
// Create a new invitation from admin panel
export async function POST(request: Request) {
  if (!(await validateSession(request))) {
    return NextResponse.json({ error: "Unauthorized. Invalid PIN." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      type, // "Khitan" | "Aqiqah" | "Birthday"
      fullName,
      nickname,
      parentsName,
      childOrder,
      birthdayAge,
      whatsapp,
      shopeeOrder,
      theme,
      music,
      eventDate,
      eventTime,
      eventLocation,
      schedule,
      invitedGuests,
      bankAccount,
      giftAddress,
      mapsLink,
      videoLink,
      isPro,
      status
    } = body;

    if (!type || !fullName || !whatsapp) {
      return NextResponse.json({ error: "Tipe Acara, Nama Lengkap, dan WhatsApp wajib diisi" }, { status: 400 });
    }

    // Generate slug id
    const generatedId = generateInvitationSlug(type, fullName);

    const pinCode = Math.floor(1000 + Math.random() * 9000).toString();

    const calculatedExpiry = calculateExpiryDate(eventDate);

    const insertData = {
      id: generatedId,
      type,
      full_name: fullName.trim(),
      nickname: nickname ? nickname.trim() : "",
      parents_name: parentsName ? parentsName.trim() : "",
      child_order: childOrder ? childOrder.trim() : null,
      birthday_age: birthdayAge ? birthdayAge.trim() : null,
      whatsapp: whatsapp.trim(),
      shopee_order: shopeeOrder ? shopeeOrder.trim() : "",
      theme: theme ? theme.trim() : "",
      music: music ? music.trim() : "",
      event_date: eventDate ? eventDate.trim() : "",
      event_time: eventTime ? eventTime.trim() : "",
      event_location: eventLocation ? eventLocation.trim() : "",
      schedule: schedule ? schedule.trim() : null,
      invited_guests: invitedGuests ? invitedGuests.trim() : null,
      bank_account: bankAccount ? bankAccount.trim() : null,
      gift_address: giftAddress ? giftAddress.trim() : null,
      maps_link: mapsLink ? mapsLink.trim() : "",
      video_link: videoLink ? videoLink.trim() : "",
      is_pro: !!isPro,
      status: status || "Diproses",
      receptionist_pin: pinCode,
      expiry_date: calculatedExpiry,
      link_undangan: `https://bintarti.store/sandbox-tema/${generatedId}`,
      link_tamu: `https://bintarti.store/sandbox-tema/${generatedId}#`
    };

    const { data, error } = await supabase
      .from("invitations")
      .insert([insertData])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, invitation: data?.[0] });
  } catch (error: any) {
    console.error("Admin insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
