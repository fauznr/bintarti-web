const fs = require('fs');
let content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');

// 1. Replace comments state
const oldStateRegex = /const \[comments, setComments\] = useState<Array<\{ name: string; attendance: string; pax: string; wish: string; date: string \}>>\(\[[\s\S]*?\]\);/;
content = content.replace(oldStateRegex, 'const [comments, setComments] = useState<Array<any>>([]);');

// 2. Inject useEffect for fetching comments
const useEffectHook = `  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(\`/api/comments?invitationId=\${encodeURIComponent(themeId)}\`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setComments(data);
          }
        }
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    }
    fetchComments();
  }, [themeId]);`;

if (!content.includes('fetchComments() {')) {
  // Insert before the first useEffect
  content = content.replace('  useEffect(() => {', useEffectHook + '\n\n  useEffect(() => {');
}

// 3. Replace handleSubmitWish
const handleSubmitWishRegex = /const handleSubmitWish = \(e: React\.FormEvent\) => \{[\s\S]*?\}, 600\);\n  \};/;
const newHandleSubmitWish = `const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formWish.trim()) return;
    setIsSubmitting(true);

    const rsvpValue = formAttendance === "Hadir" ? \`Hadir (\${formPax} Orang)\` : "Tidak Hadir";
    const newComment = {
      name: formName,
      rsvp_status: rsvpValue,
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
          rsvpStatus: rsvpValue,
          comment: formWish
        })
      });
      setComments([newComment, ...comments]);
      setFormWish("");
    } catch (err) {
      setComments([newComment, ...comments]);
      setFormWish("");
    } finally {
      setIsSubmitting(false);
    }
  };`;
content = content.replace(handleSubmitWishRegex, newHandleSubmitWish);

// 4. Update the render block
// Replace the span
content = content.replace(/<span className=\{`px-2\.5 py-0\.5 text-\[9px\] font-semibold rounded-full border \$\{\n\s*item\.attendance === "Hadir" \? "border-emerald-400 text-emerald-300 bg-emerald-950\/40" : "border-rose-400 text-rose-300 bg-rose-950\/40"\n\s*\}`\}>\n\s*\{item\.attendance\} \(\{item\.pax\} pax\)\n\s*<\/span>/,
  `<span className={\`px-2.5 py-0.5 text-[9px] font-semibold rounded-full border \${
    (item.rsvp_status || item.attendance || "").includes("Hadir") ? "border-emerald-400 text-emerald-300 bg-emerald-950/40" : "border-rose-400 text-rose-300 bg-rose-950/40"
  }\`}>
    {item.rsvp_status || item.attendance || "Tidak Hadir"}
  </span>`);

// Replace wish
content = content.replace(/\{item\.wish\}/g, '{item.comment || item.wish}');

// Replace date
content = content.replace(/\{item\.date\}/g, '{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : item.date}');


fs.writeFileSync('src/components/wedding/Wedding6View.tsx', content);
console.log('Applied RSVP fixes.');
