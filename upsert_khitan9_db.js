const { createClient } = require('C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/node_modules/@supabase/supabase-js');
require('C:/Users/Administrator/.gemini/antigravity/scratch/bintarti/node_modules/dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_CONFIG_THEME_KHITAN_9 = {
  cover: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 15,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    customText: "Walimatul Khitan",
    buttonScale: 1.0,
    ornaments: [
      { id: "91", url: "/templates/khitan-9/ornament-planet.png", transformX: 30, transformY: 400, scale: 0.8, flipHorizontal: false },
      { id: "92", url: "/templates/khitan-9/ornament-astronaut.png", transformX: -20, transformY: 480, scale: 1.2, flipHorizontal: false }
    ],
    elementOrder: ["badge", "title", "divider", "nama", "parents", "button"]
  },
  profile: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#E0E7FF",
    fontScale: 1.0,
    avatarScale: 110,
    avatarX: 0,
    avatarY: -10,
    ornaments: [
      { id: "93", url: "/templates/khitan-9/ornament-rocket.png", transformX: 50, transformY: 200, scale: 1.0, flipHorizontal: false }
    ],
    elementOrder: ["header", "avatar", "body", "bottom"]
  },
  event: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    buttonScale: 1.0,
    countdownScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "countdown", "location", "button"]
  },
  maps: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "mapframe", "button"]
  },
  gallery: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 5,
    right: 5,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "grid"]
  },
  activities: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "list"]
  },
  envelope: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "body", "bank", "button"]
  },
  rsvp: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    buttonScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "form", "messages"]
  },
  closing: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    avatarScale: 100,
    ornaments: [],
    elementOrder: ["avatar", "header", "body"]
  },
  turut: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "body"]
  },
  checkin: {
    bgSizeWidth: 100,
    bgSizeHeight: 100,
    bgPosX: 50,
    bgPosY: 50,
    left: 8,
    right: 8,
    top: 10,
    bottom: 10,
    fontFamily: "Bungee",
    fontColor: "#F1F5F9",
    fontScale: 1.0,
    ornaments: [],
    elementOrder: ["header", "qr", "button"]
  },
  global: {
    musicUrl: "https://eehktxhhpsdffpwlxghm.supabase.co/storage/v1/object/public/invitation-assets/music/happy-birthday.mp3"
  }
};

async function run() {
  console.log("Fetching khitan-1 data from database...");
  
  const { data: khitan1, error: fetchError } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", "khitan-1")
    .single();

  if (fetchError || !khitan1) {
    console.error("FAILED to fetch khitan-1:", fetchError);
    return;
  }

  console.log("Upserting khitan-9...");

  const khitan9Record = {
    id: "khitan-9",
    type: "Khitan",
    theme: "Khitan 9",
    whatsapp: khitan1.whatsapp,
    shopee_order: "DEFAULT-KHITAN9",
    music: khitan1.music,
    full_name: khitan1.full_name,
    nickname: khitan1.nickname,
    parents_name: khitan1.parents_name,
    child_order: khitan1.child_order,
    event_date: khitan1.event_date,
    event_time: khitan1.event_time,
    event_location: khitan1.event_location,
    schedule: khitan1.schedule,
    invited_guests: khitan1.invited_guests,
    bank_account: khitan1.bank_account,
    gift_address: khitan1.gift_address,
    is_pro: true,
    maps_link: khitan1.maps_link,
    video_link: khitan1.video_link,
    child_photo_url: khitan1.child_photo_url,
    activities_photo_url: khitan1.activities_photo_url,
    gallery_images: khitan1.gallery_images,
    layout_config: JSON.stringify(DEFAULT_CONFIG_THEME_KHITAN_9)
  };

  const { data: updatedData, error: updateError } = await supabase
    .from("invitations")
    .upsert(khitan9Record, { onConflict: 'id' })
    .select();

  if (updateError) {
    console.error("FAILED to upsert khitan-9:", updateError);
  } else {
    console.log("SUCCESS! Upserted khitan-9.", updatedData[0]?.id);
  }
}

run();
