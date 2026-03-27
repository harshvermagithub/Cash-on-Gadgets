const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to the clean logo page
  await page.goto('http://localhost:3000/export-logo', { timeout: 0, waitUntil: 'domcontentloaded' });

  // Wait for 10 seconds for Next.js to finish rendering (dev mode)
  await new Promise(r => setTimeout(r, 10000));

  // Set viewport
  await page.setViewport({ width: 800, height: 800 });

  // Get the logo element
  const logoElement = await page.$('#capture-logo');
  
  // Screenshot the element
  await logoElement.screenshot({
    path: 'public/uploads/fcart_logo_exported.png',
    omitBackground: true
  });
  
  console.log('Successfully exported logo to public/uploads/fcart_logo_exported.png');

  await browser.close();
})();
