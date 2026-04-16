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
    
    // Application URL
    const appUrl = 'http://82.208.22.226:8000/project/gylea38athy9xgejk430j2ql/environment/ysmk3ux4n/application/tccc8os4swwwgkkoosko4ww8';
    console.log("Navigating to Application...");
    await page.goto(appUrl, { waitUntil: 'networkidle2' });
    
    console.log("Looking for Deploy button...");
    const buttons = await page.$$('button');
    let deployed = false;
    for (const b of buttons) {
        const text = await b.evaluate(el => el.textContent);
        if (text && text.trim() === 'Deploy') {
            console.log("Clicking Deploy button...");
            await b.click();
            deployed = true;
            await new Promise(r => setTimeout(r, 5000));
            break;
        }
    }
    
    if (!deployed) {
         // Maybe it says Force Rebuild?
         for (const b of buttons) {
            const text = await b.evaluate(el => el.textContent);
            if (text && text.trim() === 'Force Rebuild') {
                console.log("Clicking Force Rebuild button...");
                await b.click();
                deployed = true;
                await new Promise(r => setTimeout(r, 5000));
                break;
            }
        }
    }

    if (!deployed) {
        console.log("Could not find Deploy button! Dumping page text.");
        const html = await page.evaluate(() => document.body.innerText);
        const fs = require('fs');
        fs.writeFileSync('app_page_dump.txt', html);
    } else {
        console.log("Deploy triggered successfully!");
    }
    
    // MailServer Config Update
    console.log("Fixing MailServer now...");
    const mailServerConfigUrl = 'http://82.208.22.226:8000/project/gylea38athy9xgejk430j2ql/environment/ysmk3ux4n/service/a39170v6pcu46nlfd9a60xt6/configuration';
    await page.goto(mailServerConfigUrl, { waitUntil: 'networkidle0' });
    const msButtons = await page.$$('button');
    let restarted = false;
    for (const b of msButtons) {
        const text = await b.evaluate(el => el.textContent);
        if (text && (text.trim() === 'Restart' || text.trim() === 'Start')) {
            await b.click();
            restarted = true;
            console.log("Clicked Restart on MailServer!");
            break;
        }
    }

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
