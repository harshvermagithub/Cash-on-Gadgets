const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // 1. Go to Coolify Login
    console.log("Navigating to Coolify...");
    await page.goto('http://82.208.22.226:8000/login', { waitUntil: 'networkidle2' });
    
    // 2. Login
    console.log("Logging in...");
    await page.type('input[type="email"]', 'nrenterprisesy@gmail.com');
    await page.type('input[type="password"]', 'Noumaan@Raihaan5');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log("Logged in successfully!");
    
    // 3. Go to project environment
    console.log("Navigating to environment...");
    await page.goto('http://82.208.22.226:8000/project/gylea38athy9xgejk430j2ql/environment/ysmk3ux4n', { waitUntil: 'networkidle0' });
    
    // 4. Look for the application link (Cash-on-Gadgets)
    console.log("Looking for Cash-on-Gadgets application...");
    const resourceLinks = await page.$$('a');
    let appLink = null;
    let mailLink = null;
    for (const link of resourceLinks) {
       const text = await link.evaluate(el => el.textContent);
       const href = await link.evaluate(el => el.getAttribute('href'));
       if (text.includes('Cash-on-Gadgets') && href && href.includes('/application/')) {
           appLink = href;
       }
       if (text.includes('MailServer') && href && href.includes('/service/')) {
           mailLink = href;
       }
    }
    
    if (appLink) {
        console.log("Found app link:", appLink);
        await page.goto('http://82.208.22.226:8000' + appLink, { waitUntil: 'networkidle0' });
        console.log("Clicking 'Deploy' button...");
        // the button has text "Deploy"
        const deployButtons = await page.$$('button');
        for (const btn of deployButtons) {
            const text = await btn.evaluate(el => el.textContent);
            if (text && text.trim() === 'Deploy') {
                await btn.click();
                console.log("Clicked Deploy!");
                break;
            }
        }
        await new Promise(r => setTimeout(r, 5000));
    }
    
    // 5. Fix MailServer
    if (mailLink) {
        console.log("Navigating to MailServer:", mailLink);
        await page.goto('http://82.208.22.226:8000' + mailLink + '/configuration', { waitUntil: 'networkidle0' });
        
        console.log("Fixing MailServer configuration... (Clicking Restart)");
        // Click Restart to ensure it's up if it's down.
        const restartButtons = await page.$$('button');
        for (const btn of restartButtons) {
            const text = await btn.evaluate(el => el.textContent);
            if (text && text.trim() === 'Restart') {
                await btn.click();
                console.log("Clicked Restart on MailServer!");
                break;
            }
        }
        await new Promise(r => setTimeout(r, 5000));
    }

    await browser.close();
    console.log("Done.");
  } catch (error) {
    console.error("Puppeteer error:", error);
  }
})();
