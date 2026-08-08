import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabase";
import { uploadBase64ToStorage } from "../../../utils/storage";
import { generateInvitationSlug, calculateExpiryDate } from "../../../utils/invitation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { activeTab, formData, profilePhoto, galleryPhotos, activitiesPhoto, emailConfirm, photoGroom, photoBride, photoStory, photoHero, photoClosing, saveTheDateBg, quoteBg, loveStoryBg, eventBg, dresscodeBg, ourMomentBg, giftBg, rsvpBg, qrBg, turnstileToken } = body;

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
      console.error("Turnstile verification failed in formulir:", verifyData);
      return NextResponse.json({ error: "CAPTCHA verification failed" }, { status: 403 });
    }

    // Honeypot spam check (silently reject bots)
    if (emailConfirm && emailConfirm.trim() !== "") {
      console.warn("Spam detected: Honeypot field filled. Rejecting silently.");
      return NextResponse.json({
        success: true,
        message: "Form submitted successfully"
      });
    }

    if (!activeTab || !formData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Compute full name for slug generation
    const computedFullName = (activeTab === "Wedding" ? `${formData.groomName} & ${formData.brideName}` : formData.fullName || "").trim();

    // Generate a clean URL-friendly ID slug from full name with a unique random suffix
    const generatedId = generateInvitationSlug(activeTab, computedFullName);

    const musicText = formData.music === "Lainnya" ? formData.customMusic : formData.music;
    const receptionistPin = Math.floor(1000 + Math.random() * 9000).toString();

    // Expiry date: automatically 3 months after the event date
    const calculatedExpiry = calculateExpiryDate(formData.eventDate);

    // 1. Upload profile picture if provided
    let childPhotoUrl = "";
    if (profilePhoto) {
      try {
        console.log("Uploading profile photo to Supabase storage...");
        childPhotoUrl = await uploadBase64ToStorage(profilePhoto, generatedId, "profile.webp");
      } catch (err) {
        console.error("Profile photo upload failed:", err);
      }
    }

    // 2. Upload activities photo if provided
    let activitiesPhotoUrl = "";
    if (activitiesPhoto) {
      try {
        console.log("Uploading activities photo to Supabase storage...");
        activitiesPhotoUrl = await uploadBase64ToStorage(activitiesPhoto, generatedId, "activities.webp");
      } catch (err) {
        console.error("Activities photo upload failed:", err);
      }
    }

    // 3. Upload gallery pictures if provided
    let galleryUrls: string[] = [];
    if (Array.isArray(galleryPhotos) && galleryPhotos.length > 0) {
      for (let i = 0; i < galleryPhotos.length; i++) {
        try {
          console.log(`Uploading gallery photo ${i + 1} to Supabase storage...`);
          const url = await uploadBase64ToStorage(galleryPhotos[i], generatedId, `gallery_${i + 1}.webp`);
          galleryUrls.push(url);
        } catch (err) {
          console.error(`Gallery photo ${i + 1} upload failed:`, err);
        }
      }
    }

    // 4. Upload Groom and Bride photos for Wedding
    let groomPhotoUrl = "";
    let bridePhotoUrl = "";
    let storyPhotoUrl = "";
    let heroPhotoUrl = "";
    let closingPhotoUrl = "";
    let saveTheDateBgUrl = "";
    let quoteBgUrl = "";
    let loveStoryBgUrl = "";
    let eventBgUrl = "";
    let dresscodeBgUrl = "";
    let ourMomentBgUrl = "";
    let giftBgUrl = "";
    let rsvpBgUrl = "";
    let qrBgUrl = "";
    if (activeTab === "Wedding") {
      if (photoHero) {
        try {
          console.log("Uploading hero photo to Supabase storage...");
          heroPhotoUrl = await uploadBase64ToStorage(photoHero, generatedId, "hero.webp");
        } catch (err) {
          console.error("Hero photo upload failed:", err);
        }
      }
      if (photoGroom) {
        try {
          console.log("Uploading groom photo to Supabase storage...");
          groomPhotoUrl = await uploadBase64ToStorage(photoGroom, generatedId, "groom.webp");
        } catch (err) {
          console.error("Groom photo upload failed:", err);
        }
      }
      if (photoBride) {
        try {
          console.log("Uploading bride photo to Supabase storage...");
          bridePhotoUrl = await uploadBase64ToStorage(photoBride, generatedId, "bride.webp");
        } catch (err) {
          console.error("Bride photo upload failed:", err);
        }
      }
      if (photoStory) {
        try {
          console.log("Uploading story photo to Supabase storage...");
          storyPhotoUrl = await uploadBase64ToStorage(photoStory, generatedId, "story.webp");
        } catch (err) {
          console.error("Story photo upload failed:", err);
        }
      }
      if (photoClosing) {
        try {
          console.log("Uploading closing photo to Supabase storage...");
          closingPhotoUrl = await uploadBase64ToStorage(photoClosing, generatedId, "closing.webp");
        } catch (err) {
          console.error("Closing photo upload failed:", err);
        }
      }
      
      
      const uploadExtra = async (base64: string, filename: string) => {
        if (!base64) return "";
        try {
          return await uploadBase64ToStorage(base64, generatedId, filename);
        } catch (err) {
          console.error(filename + " upload failed:", err);
          return "";
        }
      };

      saveTheDateBgUrl = await uploadExtra(saveTheDateBg, "save_the_date_bg.webp");
      quoteBgUrl = await uploadExtra(quoteBg, "quote_bg.webp");
      loveStoryBgUrl = await uploadExtra(loveStoryBg, "love_story_bg.webp");
      eventBgUrl = await uploadExtra(eventBg, "event_bg.webp");
      dresscodeBgUrl = await uploadExtra(dresscodeBg, "dresscode_bg.webp");
      ourMomentBgUrl = await uploadExtra(ourMomentBg, "our_moment_bg.webp");
      giftBgUrl = await uploadExtra(giftBg, "gift_bg.webp");
      rsvpBgUrl = await uploadExtra(rsvpBg, "rsvp_bg.webp");
      qrBgUrl = await uploadExtra(qrBg, "qr_bg.webp");

    }

    // For Wedding type: pack extended data into `notes` as JSON
    let notesJson: string | null = null;
    if (activeTab === "Wedding") {
      const weddingNotes = {
        groomName:       formData.groomName       || "",
        groomNickname:   formData.groomNickname   || "",
        groomInstagram:  formData.groomInstagram  || "",
        groomParents:    formData.groomParents    || "",
        brideName:       formData.brideName       || "",
        brideNickname:   formData.brideNickname   || "",
        brideInstagram:  formData.brideInstagram  || "",
        brideParents:    formData.brideParents    || "",
        akadDate:        formData.akadDate         || formData.eventDate || "",
        akadTime:        formData.akadTime         || formData.eventTime || "",
        akadLocation:    formData.akadLocation     || formData.eventLocation || "",
        akadGmaps:       formData.akadGmaps        || "",
        resepsiDate:     formData.resepsiDate      || formData.eventDate || "",
        resepsiTime:     formData.resepsiTime      || formData.eventTime || "",
        resepsiLocation: formData.resepsiLocation  || formData.eventLocation || "",
        resepsiGmaps:    formData.resepsiGmaps     || "",
        loveStory:       formData.loveStoryList    || [],
        bankAccounts:    formData.bankAccounts     || [],
        youtubeVideo:    formData.youtubeVideo     || "",
        isPro:           false,
        groomPhotoUrl:   groomPhotoUrl,
        bridePhotoUrl:   bridePhotoUrl,
        storyPhotoUrl:   storyPhotoUrl,
        heroPhotoUrl:    heroPhotoUrl,
        closingPhotoUrl: closingPhotoUrl,
        saveTheDateBgUrl: saveTheDateBgUrl,
        quoteBgUrl: quoteBgUrl,
        loveStoryBgUrl: loveStoryBgUrl,
        eventBgUrl: eventBgUrl,
        dresscodeBgUrl: dresscodeBgUrl,
        ourMomentBgUrl: ourMomentBgUrl,
        giftBgUrl: giftBgUrl,
        rsvpBgUrl: rsvpBgUrl,
        qrBgUrl: qrBgUrl
      };
      notesJson = JSON.stringify(weddingNotes);
    }

    // Insert or update into Supabase invitations table
    const { data, error } = await supabase
      .from("invitations")
      .upsert({
        id: generatedId,
        type: activeTab,
        whatsapp: (formData.whatsapp || "").trim(),
        shopee_order: (formData.shopeeOrder || "").trim(),
        theme: formData.theme || "",
        music: musicText || "",
        birthday_age: formData.birthdayAge || null,
        full_name: computedFullName,
        nickname: (activeTab === "Wedding" ? `${formData.groomNickname} & ${formData.brideNickname}` : formData.nickname || "").trim(),
        parents_name: (activeTab === "Wedding" ? `${formData.groomParents} & ${formData.brideParents}` : formData.parentsName || "").trim(),
        child_order: formData.childOrder || null,
        event_date: formData.eventDate || formData.akadDate || "",
        event_time: formData.eventTime || formData.akadTime || "",
        event_location: formData.eventLocation || formData.akadLocation || "",
        schedule: formData.schedule || null,
        invited_guests: formData.invitedGuests || null,
        bank_account: formData.bankAccount || (formData.bankAccounts ? JSON.stringify(formData.bankAccounts) : null),
        gift_address: formData.giftAddress || null,
        notes: notesJson,
        status: "Diproses",
        link_undangan: `https://bintarti.store/${generatedId}`,
        link_tamu: `https://bintarti.store/${generatedId}?to=`,
        receptionist_pin: receptionistPin,
        expiry_date: calculatedExpiry,
        child_photo_url: childPhotoUrl || null,
        gallery_images: galleryUrls.length > 0 ? galleryUrls : null,
        activities_photo_url: activitiesPhotoUrl || null
      })
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, invitation: data?.[0] });
  } catch (error: any) {
    console.error("Error in submit-form API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
