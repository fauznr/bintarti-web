const fs = require('fs');
const file = 'src/components/wedding/Wedding7View.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Replace state initialization
const stateRegex = /const \[wishes, setWishes\] = useState\(\[\s*\{[\s\S]*?\]\);/;
const newState = `const [wishes, setWishes] = useState<Array<any>>([]);

  useEffect(() => {
    async function fetchComments() {
      if (!themeId) return;
      try {
        const res = await fetch(\`/api/comments?invitationId=\${encodeURIComponent(themeId)}\`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped = data.map((d: any) => ({
              name: d.name,
              status: d.rsvp_status || "Hadir",
              message: d.comment,
              time: d.created_at ? new Date(d.created_at).toLocaleDateString("id-ID") : "Baru saja"
            }));
            setWishes(mapped);
          }
        }
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    }
    fetchComments();
  }, [themeId]);`;

c = c.replace(stateRegex, newState);

// 2. Replace handleWishSubmit
const submitRegex = /const handleWishSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?\}\, 800\);\n\s*\};/;
const newSubmit = `const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    setIsSubmitting(true);
    const rsvpValue = formStatus === "Hadir" ? \`Hadir (\${formPax} Orang)\` : "Tidak Hadir";
    
    const newWish = {
      name: formName,
      status: rsvpValue,
      message: formMessage,
      time: "Baru saja"
    };

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: themeId,
          name: formName,
          rsvpStatus: rsvpValue,
          comment: formMessage
        })
      });
      setWishes([newWish, ...wishes]);
      setFormMessage("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      setWishes([newWish, ...wishes]);
      setFormMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };`;

c = c.replace(submitRegex, newSubmit);

fs.writeFileSync(file, c);
console.log('Fixed comments/RSVP logic');
