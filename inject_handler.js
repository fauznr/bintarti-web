const fs = require('fs');
let file = fs.readFileSync('src/app/formulir/page.tsx', 'utf8');

const func = `
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setBase64: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const base64 = await compressImage(file);
      setBase64(base64);
    } catch (err) {
      alert("Gagal mengompres foto: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
`;

file = file.replace('const handlePhotoClosingUpload = async', func + '\n  const handlePhotoClosingUpload = async');

fs.writeFileSync('src/app/formulir/page.tsx', file);
console.log('Injected handleImageUpload');
