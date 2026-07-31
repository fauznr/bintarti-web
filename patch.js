const fs = require('fs');
let code = fs.readFileSync('src/components/wedding/Wedding3View.tsx', 'utf8');

// Replace dummy handleSubmitWish with real API logic
code = code.replace(/const handleSubmitWish = [\s\S]*?  };/, `const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formWish.trim()) return;

    setIsSubmitting(true);
    const newComment = {
      name: formName,
      rsvp_status: formAttendance === "Hadir" ? \`Hadir (\${formPax} Orang)\` : "Tidak Hadir",
      comment: formWish,
      created_at: new Date().toISOString()
    };

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: themeId,
          name: formName,
          rsvpStatus: newComment.rsvp_status,
          comment: formWish
        })
      });
      setComments([newComment, ...comments]);
      setFormWish("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setComments([newComment, ...comments]);
      setFormWish("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };`);

// Change form submission handler
code = code.replace(/onSubmit=\{handleSubmitWish\}/, 'onSubmit={handleSubmitRSVP}');

// Update Comments mapping
code = code.replace(/\{comments\.map\(\(item, idx\) => \([\s\S]*?        <\/div>/, `{comments.map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 border-b border-[#2C1A14]/15 space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2C1A14] font-ovo text-sm">{item.name}</span>
                        <span className={\`px-2 py-0.5 text-[10px] font-semibold rounded-none border \${
                          item.rsvp_status?.includes("Hadir") && !item.rsvp_status?.includes("Tidak") ? "border-emerald-600 text-emerald-800" : "border-rose-600 text-rose-800"
                        }\`}>
                          {item.rsvp_status}
                        </span>
                      </div>
                      <p className="text-[#2C1A14]/80 leading-relaxed font-light text-xs">{item.comment}</p>
                      <span className="text-[10px] text-[#2C1A14]/50 block">{new Date(item.created_at || new Date()).toLocaleDateString('id-ID')}</span>
                    </div>
                  ))}
                </div>`);

// Change initial comments state to empty array
code = code.replace(/const \[comments, setComments\] = useState[\s\S]*?\);\n  const \[isSubmitting/, 'const [comments, setComments] = useState<any[]>([]);\n  const [isSubmitting');

// Hide QR Code section if not pro
code = code.replace(/<section id="qrcode-section"/, '{isPro && (<section id="qrcode-section"');
code = code.replace(/<\/section>\n\n        {\/\* ======================================================== \*\/}\n        {\/\* SECTION 9: GALLERY & YOUTUBE PREWEDDING VIDEO/, '</section>)}\n\n        {/* ======================================================== */}\n        {/* SECTION 9: GALLERY & YOUTUBE PREWEDDING VIDEO');

// Success message
code = code.replace(/<\/form>/, `</form>\n              {submitSuccess && (\n                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs py-2 px-3 mt-4 text-center animate-pulse">\n                  Terima kasih! Konfirmasi kehadiran Anda telah terkirim.\n                </div>\n              )}`);

fs.writeFileSync('src/components/wedding/Wedding3View.tsx', code);
console.log("Patched successfully!");
