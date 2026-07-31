const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const sampleJpgBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
const imgPathA = path.join(__dirname, 'test_cover.jpg');
const imgPathC = path.join(__dirname, 'test_gallery.jpg');

fs.writeFileSync(imgPathA, Buffer.from(sampleJpgBase64, 'base64'));
fs.writeFileSync(imgPathC, Buffer.from(sampleJpgBase64, 'base64'));

(async () => {
  console.log('🚀 Testing https://bintarti.store/formulir via Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('https://bintarti.store/formulir', { waitUntil: 'networkidle2' });

  // STEP 1
  console.log('✅ STEP 1');
  await page.waitForSelector('#whatsapp');
  await page.type('#whatsapp', '081987654321');
  await page.type('#shopeeOrder', 'SHP-E2E-REALTEST');
  await page.select('#theme', 'Wedding 1');
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.textContent.includes('Lanjut'));
    if (next) next.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // STEP 2
  console.log('✅ STEP 2');
  await page.waitForSelector('#groomName');
  await page.evaluate(() => {
    const setValue = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    setValue('groomName', 'Fajar Nugraha, S.T.');
    setValue('groomNickname', 'Fajar');
    setValue('groomParents', 'Bapak H. Hendra & Ibu Hj. Ratna');
    setValue('brideName', 'Kania Putri, S.Kom.');
    setValue('brideNickname', 'Kania');
    setValue('brideParents', 'Bapak Drs. Wahyu & Ibu Hj. Nina');

    setValue('akadDate', '2026-11-20');
    setValue('akadTime', '08:00 WIB');
    setValue('akadLocation', 'Masjid Al-Ikhlas, Bandung');
    setValue('resepsiDate', '2026-11-20');
    setValue('resepsiTime', '11:00 - 14:00 WIB');
    setValue('resepsiLocation', 'Gedung Olahraga Bandung');
  });

  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.textContent.includes('Lanjut'));
    if (next) next.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // STEP 3
  console.log('✅ STEP 3 (Photo Uploads)');
  await page.waitForSelector('#photo-cover-input', { hidden: true });
  const coverInput = await page.$('#photo-cover-input');
  await coverInput.uploadFile(imgPathA);

  await page.waitForSelector('#gallery-upload-input', { hidden: true });
  const galleryInput = await page.$('#gallery-upload-input');
  await galleryInput.uploadFile(imgPathC);

  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.textContent.includes('Lanjut'));
    if (next) next.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // STEP 4
  console.log('✅ STEP 4 (Submission)');
  await page.evaluate(() => {
    const bank = document.querySelector('input[placeholder*="Contoh: BCA"]');
    if (bank) {
      bank.value = 'BCA';
      bank.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const acc = document.querySelector('input[placeholder*="nomor rekening"]');
    if (acc) {
      acc.value = '1234567890';
      acc.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const name = document.querySelector('input[placeholder*="nama penerima"]');
    if (name) {
      name.value = 'Fajar Nugraha';
      name.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const btns = Array.from(document.querySelectorAll('button'));
    const submit = btns.find(b => b.textContent.includes('Kirim ke WhatsApp'));
    if (submit) submit.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  console.log('SUCCESS! Console errors:', consoleErrors);

  await browser.close();
  if (fs.existsSync(imgPathA)) fs.unlinkSync(imgPathA);
  if (fs.existsSync(imgPathC)) fs.unlinkSync(imgPathC);
})().catch(e => console.error('FAILED:', e));
