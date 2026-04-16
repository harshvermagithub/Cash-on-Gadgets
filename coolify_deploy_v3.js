const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log("Logging into Coolify...");
    await page.goto('http://82.208.22.226:8000/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'nrenterprisesy@gmail.com');
    await page.type('input[type="password"]', 'Noumaan@Raihaan5');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    console.log("Navigating to environment...");
    await page.goto('http://82.208.22.226:8000/project/gylea38athy9xgejk430j2ql/environment/ysmk3ux4n', { waitUntil: 'domcontentloaded' });
    
    console.log("Waiting 5 seconds for Livewire to load the list...");
    await new Promise(r => setTimeout(r, 8000));
    
    console.log("Looking for actual application link...");
    const links = await page.$$('a');
    let appUrl = null;
    let mailUrl = null;
    for (const link of links) {
        const text = await link.evaluate(el => el.textContent);
        const href = await link.evaluate(el => el.getAttribute('href'));
        if (text && text.includes('Cash-on-Gadgets') && href && href.includes('/application/')) {
            appUrl = href;
            console.log("Found app:", href);
        }
        if (text && text.includes('MailServer') && href && href.includes('/service/')) {
            mailUrl = href;
            console.log("Found mail:", href);
        }
    }
    
    if (appUrl) {
       console.log("Navigating to:", appUrl);
       let fullUrl = appUrl.startsWith('http') ? appUrl : 'http://82.208.22.226:8000' + appUrl;
       await page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
       console.log("Waiting 5 seconds for Application page Livewire...");
       await new Promise(r => setTimeout(r, 5000));
       
       const buttons = await page.$$('button');
       for (const b of buttons) {
           const text = await b.evaluate(el => el.textContent);
           if (text && (text.trim() === 'Deploy' || text.trim() === 'Force Rebuild')) {
               await b.click();
               console.log("Deploy clicked successfully!");
               break;
           }
       }
       await new Promise(r => setTimeout(r, 6000));
    }
    
    if (mailUrl) {
       console.log("Navigating to:", mailUrl + '/configuration');
       let fullUrl = mailUrl.startsWith('http') ? mailUrl : 'http://82.208.22.226:8000' + mailUrl;
       await page.goto(fullUrl + '/configuration', { waitUntil: 'domcontentloaded' });
       console.log("Waiting 5 seconds for MailServer page Livewire...");
       await new Promise(r => setTimeout(r, 5000));
       
       const buttons = await page.$$('button');
       for (const b of buttons) {
           const text = await b.evaluate(el => el.textContent);
           if (text && (text.trim() === 'Deploy' || text.trim() === 'Restart' || text.trim() === 'Start')) {
               await b.click();
               console.log("Mailserver Restart clicked!");
               break;
           }
       }
       await new Promise(r => setTimeout(r, 6000));
    }

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
