const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Log all console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Log all failed requests
  page.on('requestfailed', request => {
    if (request.failure()) {
      console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
    } else {
      console.log(`REQUEST FAILED: ${request.url()} - No error text`);
    }
  });

  try {
    console.log('Navigating to page...');
    await page.goto('https://bintarti.store/wedding_puja-apri-48hp', { waitUntil: 'networkidle2' });
    
    // Wait for a few seconds to let Turnstile do its thing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if the Turnstile iframe exists
    const iframes = await page.$$('iframe');
    console.log(`Found ${iframes.length} iframes.`);
    for (const iframe of iframes) {
      const src = await iframe.evaluate(el => el.src);
      console.log(`Iframe src: ${src}`);
    }

    // Check for Troubleshoot text
    const troubleshootText = await page.evaluate(() => {
      return document.body.innerText.includes('Troubleshoot');
    });
    console.log(`Troubleshoot text found: ${troubleshootText}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
