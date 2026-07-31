const fs = require('fs');
let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

// 1. Add FormData fields
file = file.replace(
  'akadLocation: "",',
  'akadTitle: "",\n    akadLocation: "",'
);
file = file.replace(
  'resepsiLocation: "",',
  'resepsiTitle: "",\n    resepsiLocation: "",'
);
file = file.replace(
  'loveStoryList: [',
  'dresscodes: [\n      { name: "Black", hex: "#171717" },\n      { name: "Charcoal", hex: "#737373" },\n      { name: "Silver", hex: "#D4D4D4" },\n      { name: "White", hex: "#FFFFFF" }\n    ],\n    loveStoryList: ['
);

// 2. Add base64 photo states
file = file.replace(
  'const [photoClosingBase64, setPhotoClosingBase64] = useState<string>(""); // Halaman Penutup',
  `const [photoClosingBase64, setPhotoClosingBase64] = useState<string>(""); // Halaman Penutup
  const [quoteBgBase64, setQuoteBgBase64] = useState<string>("");
  const [loveStoryBgBase64, setLoveStoryBgBase64] = useState<string>("");
  const [eventBgBase64, setEventBgBase64] = useState<string>("");
  const [dresscodeBgBase64, setDresscodeBgBase64] = useState<string>("");
  const [ourMomentBgBase64, setOurMomentBgBase64] = useState<string>("");
  const [giftBgBase64, setGiftBgBase64] = useState<string>("");
  const [rsvpBgBase64, setRsvpBgBase64] = useState<string>("");
  const [qrBgBase64, setQrBgBase64] = useState<string>("");`
);

// 3. Payload preparation in handleSubmit
const uploadFields = `
      if (quoteBgBase64) uploadedPhotoUrls.quoteBgUrl = await uploadBase64Image(quoteBgBase64, "quoteBg");
      if (loveStoryBgBase64) uploadedPhotoUrls.loveStoryBgUrl = await uploadBase64Image(loveStoryBgBase64, "loveStoryBg");
      if (eventBgBase64) uploadedPhotoUrls.eventBgUrl = await uploadBase64Image(eventBgBase64, "eventBg");
      if (dresscodeBgBase64) uploadedPhotoUrls.dresscodeBgUrl = await uploadBase64Image(dresscodeBgBase64, "dresscodeBg");
      if (ourMomentBgBase64) uploadedPhotoUrls.ourMomentBgUrl = await uploadBase64Image(ourMomentBgBase64, "ourMomentBg");
      if (giftBgBase64) uploadedPhotoUrls.giftBgUrl = await uploadBase64Image(giftBgBase64, "giftBg");
      if (rsvpBgBase64) uploadedPhotoUrls.rsvpBgUrl = await uploadBase64Image(rsvpBgBase64, "rsvpBg");
      if (qrBgBase64) uploadedPhotoUrls.qrBgUrl = await uploadBase64Image(qrBgBase64, "qrBg");
`;
file = file.replace(
  'if (photoClosingBase64) uploadedPhotoUrls.closingPhotoUrl = await uploadBase64Image(photoClosingBase64, "closing");',
  `if (photoClosingBase64) uploadedPhotoUrls.closingPhotoUrl = await uploadBase64Image(photoClosingBase64, "closing");${uploadFields}`
);

// 4. Update the JSON notes parsing in handleSubmit
file = file.replace(
  'bridePhotoUrl: uploadedPhotoUrls.bridePhotoUrl || "",',
  `bridePhotoUrl: uploadedPhotoUrls.bridePhotoUrl || "",
        akadTitle: formData.akadTitle,
        resepsiTitle: formData.resepsiTitle,
        dresscodes: formData.dresscodes,
        quoteBgUrl: uploadedPhotoUrls.quoteBgUrl || "",
        loveStoryBgUrl: uploadedPhotoUrls.loveStoryBgUrl || "",
        eventBgUrl: uploadedPhotoUrls.eventBgUrl || "",
        dresscodeBgUrl: uploadedPhotoUrls.dresscodeBgUrl || "",
        ourMomentBgUrl: uploadedPhotoUrls.ourMomentBgUrl || "",
        giftBgUrl: uploadedPhotoUrls.giftBgUrl || "",
        rsvpBgUrl: uploadedPhotoUrls.rsvpBgUrl || "",
        qrBgUrl: uploadedPhotoUrls.qrBgUrl || "",`
);

// 5. Inject Dresscode handling functions
const dresscodeFuncs = `
  const addDresscode = () => {
    if (formData.dresscodes.length < 10) {
      setFormData(prev => ({
        ...prev,
        dresscodes: [...prev.dresscodes, { name: "", hex: "#000000" }]
      }));
    }
  };
  const removeDresscode = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dresscodes: prev.dresscodes.filter((_, i) => i !== index)
    }));
  };
  const updateDresscode = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.dresscodes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, dresscodes: updated };
    });
  };
`;
file = file.replace(
  'const addStory = () => {',
  `${dresscodeFuncs}\n  const addStory = () => {`
);

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log('Patched basic logic in formulir');
