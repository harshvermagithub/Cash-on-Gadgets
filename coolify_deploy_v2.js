const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log("Logging into Coolify...");
    await page.goto('http://82.208.22.226:8000/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'nrenterprisesy@gmail.com');
    await page.type('input[type="password"]', 'Noumaan@Raihaan5');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    console.log("Navigating to environment...");
    await page.goto('http://82.208.22.226:8000/project/gylea38athy9xgejk430j2ql/environment/ysmk3ux4n', { waitUntil: 'networkidle0' });
    
    // Find Cash-on-Gadgets application link dynamically
    console.log("Looking for Cash-on-Gadgets link...");
    const links = await page.$$('a');
    let appUrl = null;
    let mailUrl = null;
    for (const link of links) {
        const text = await link.evaluate(el => el.textContent);
        const href = await link.evaluate(el => el.getAttribute('href'));
        if (text && text.includes('Cash-on-Gadgets') && href && href.includes('/application/')) {
            appUrl = href;
        }
        if (text && text.includes('MailServer') && href && href.includes('/service/')) {
            mailUrl = href;
        }
    }
    
    if (!appUrl) {
       console.log("Could not find Cash-on-Gadgets link in the environment. Dumping HTML.");
       fs.writeFileSync('env_dump.html', await page.evaluate(() => document.body.innerHTML));
    } else {
       console.log("Navigating to actual application URL:", appUrl);
       await page.goto(appUrl, { waitUntil: 'networkidle0' });
       
       console.log("Clicking Deploy...");
       const buttons = await page.$$('button');
       let deployed = false;
       for (const b of buttons) {
           const text = await b.evaluate(el => el.textContent);
           if (text && (text.trim() === 'Deploy' || text.trim() === 'Force Rebuild')) {
               await b.click();
               deployed = true;
               console.log("Deploy clicked successfully!");
               break;
           }
       }
       if(!deployed) {
          console.log("Could not find Deploy button on application page! Dumping HTML.");
          fs.writeFileSync('app_dump.html', await page.evaluate(() => document.body.innerHTML));
       }
       await new Promise(r => setTimeout(r, 6000));
    }
    
    // MailServer logic
    if (!mailUrl) {
       console.log("Could not find MailServer link!");
    } else {
       console.log("Navigating to MailServer URL:", mailUrl);
       await page.goto(mailUrl + '/configuration', { waitUntil: 'networkidle0' });
       
       console.log("Fixing MailServer configuration (Deploy/Restart)...");
       const buttons = await page.$$('button');
       for (const b of buttons) {
           const text = await b.evaluate(el => el.textContent);
           if (text && (text.trim() === 'Deploy' || text.trim() === 'Restart' || text.trim() === 'Start')) {
               await b.click();
               console.log("Deploy/Restart clicked for MailServer successfully!");
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
