const fs = require('fs');
let content = fs.readFileSync('src/components/wedding/Wedding6View.tsx', 'utf-8');

// 1. Remove the erroneous useEffect from ScrollReveal
const erroneousUseEffect = `  useEffect(() => {
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
  }, [themeId]);\n\n`;

content = content.replace(erroneousUseEffect, '');

// 2. Insert it inside Wedding6View, after useState declarations
const useStatesBlock = `  const [formName, setFormName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [formAttendance, setFormAttendance] = useState("Hadir");
  const [formPax, setFormPax] = useState("1");
  const [formWish, setFormWish] = useState("");
  const [comments, setComments] = useState<Array<any>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);`;

const correctUseEffect = `\n\n  useEffect(() => {
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

content = content.replace(useStatesBlock, useStatesBlock + correctUseEffect);

fs.writeFileSync('src/components/wedding/Wedding6View.tsx', content);
console.log('Fixed RSVP useEffect placement.');
