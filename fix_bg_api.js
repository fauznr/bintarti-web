const fs = require('fs');

// --- 1. Update src/app/api/submit-form/route.ts ---
let apiFile = fs.readFileSync('src/app/api/submit-form/route.ts', 'utf8');

// Add extraction of new fields from request body
const reqBodyExtractOld = `const {
      activeTab,
      formData,
      profilePhoto,
      galleryPhotos,
      activitiesPhoto,
      photoCover,
      photoHero,
      photoStory,
      photoGroom,
      photoBride,
      photoClosing,
      emailConfirm
    } = body;`;

const reqBodyExtractNew = `const {
      activeTab,
      formData,
      profilePhoto,
      galleryPhotos,
      activitiesPhoto,
      photoCover,
      photoHero,
      photoStory,
      photoGroom,
      photoBride,
      photoClosing,
      emailConfirm,
      saveTheDateBg,
      quoteBg,
      loveStoryBg,
      eventBg,
      dresscodeBg,
      ourMomentBg,
      giftBg,
      rsvpBg,
      qrBg
    } = body;`;

apiFile = apiFile.replace(reqBodyExtractOld, reqBodyExtractNew);

// Add upload logic
const uploadLogicOld = `if (photoClosing) {
        try {
          console.log("Uploading closing photo to Supabase storage...");
          closingPhotoUrl = await uploadBase64ToStorage(photoClosing, generatedId, "closing.webp");
        } catch (err) {
          console.error("Closing photo upload failed:", err);
        }
      }`;

const uploadLogicNew = `if (photoClosing) {
        try {
          console.log("Uploading closing photo to Supabase storage...");
          closingPhotoUrl = await uploadBase64ToStorage(photoClosing, generatedId, "closing.webp");
        } catch (err) {
          console.error("Closing photo upload failed:", err);
        }
      }
      
      var saveTheDateBgUrl = "";
      var quoteBgUrl = "";
      var loveStoryBgUrl = "";
      var eventBgUrl = "";
      var dresscodeBgUrl = "";
      var ourMomentBgUrl = "";
      var giftBgUrl = "";
      var rsvpBgUrl = "";
      var qrBgUrl = "";
      
      const uploadExtra = async (base64, filename) => {
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
`;

apiFile = apiFile.replace(uploadLogicOld, uploadLogicNew);

// Add to notesJson
const notesJsonOld = `        heroPhotoUrl:    heroPhotoUrl,
        closingPhotoUrl: closingPhotoUrl
      };`;

const notesJsonNew = `        heroPhotoUrl:    heroPhotoUrl,
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
      };`;

apiFile = apiFile.replace(notesJsonOld, notesJsonNew);

fs.writeFileSync('src/app/api/submit-form/route.ts', apiFile);

// --- 2. Update src/app/formulir/page.tsx ---
let formFile = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// add saveTheDateBgBase64 state
if (!formFile.includes('const [saveTheDateBgBase64')) {
    formFile = formFile.replace(
        'const [quoteBgBase64, setQuoteBgBase64] = useState<string>("");',
        'const [saveTheDateBgBase64, setSaveTheDateBgBase64] = useState<string>("");\n  const [quoteBgBase64, setQuoteBgBase64] = useState<string>("");'
    );
}

// add to fetch payload
const fetchPayloadOld = `photoClosing: photoClosingBase64,
          emailConfirm: emailConfirm`;

const fetchPayloadNew = `photoClosing: photoClosingBase64,
          emailConfirm: emailConfirm,
          saveTheDateBg: saveTheDateBgBase64,
          quoteBg: quoteBgBase64,
          loveStoryBg: loveStoryBgBase64,
          eventBg: eventBgBase64,
          dresscodeBg: dresscodeBgBase64,
          ourMomentBg: ourMomentBgBase64,
          giftBg: giftBgBase64,
          rsvpBg: rsvpBgBase64,
          qrBg: qrBgBase64`;

formFile = formFile.replace(fetchPayloadOld, fetchPayloadNew);

// UI generation for missing slots
const uiToAdd = `

                              {/* SAVE THE DATE BG */}
                              <div className="space-y-3 p-4 rounded-2xl bg-white border border-amber-100 shadow-sm">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-md">Background Save The Date</span>
                                {saveTheDateBgBase64 ? (
                                  <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200">
                                    <img src={saveTheDateBgBase64} alt="Save The Date Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setSaveTheDateBgBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setSaveTheDateBgBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>
                              
                              {/* PENUTUP BG */}
                              <div className="space-y-3 p-4 rounded-2xl bg-white border border-amber-100 shadow-sm">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-md">Background Penutup</span>
                                {photoClosingBase64 ? (
                                  <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200">
                                    <img src={photoClosingBase64} alt="Penutup Bg" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => setPhotoClosingBase64("")}
                                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer text-xs font-bold uppercase">
                                    <Upload className="w-4 h-4" /> Pilih Foto
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setPhotoClosingBase64, setProfileLoading)} className="hidden" />
                                  </label>
                                )}
                              </div>
`;

const targetUI = `<div className="space-y-3 p-4 rounded-2xl bg-white border border-amber-100 shadow-sm">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-md">1. Background Ayat / Kutipan</span>`;

formFile = formFile.replace(targetUI, uiToAdd + '\n' + targetUI);

fs.writeFileSync('src/app/formulir/page.tsx', formFile);
console.log('Fixed API and Form for all backgrounds');
