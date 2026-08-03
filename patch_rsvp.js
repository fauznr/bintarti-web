const fs = require('fs');
const file = 'src/components/wedding/Wedding7View.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldSubmit = `  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMessage) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setWishes([
        {
          name: formName,
          status: formStatus,
          message: formMessage,
          time: "Baru saja"
        },
        ...wishes
      ]);
      setFormName("");
      setFormMessage("");
      setIsSubmitting(false);
    }, 500);
  };`;

const newSubmit = `  const handleSubmitWish = async (e: React.FormEvent) => {
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

c = c.replace(oldSubmit, newSubmit);

c = c.replace(
  'Foto &amp; Video Prewedding Disa &amp; Trio',
  'Foto &amp; Video Prewedding {brideNickname || "Kirana"} &amp; {groomNickname || "Aditya"}'
);

fs.writeFileSync(file, c);
console.log('Patched handleSubmitWish and names');
