const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const outputDir = path.join(__dirname, '..', 'public', 'social', 'linkedin');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function getBase64Image(relativePath) {
    const fullPath = path.join(__dirname, '..', relativePath);
    if (!fs.existsSync(fullPath)) return '';
    const ext = path.extname(fullPath).toLowerCase().replace('.', '');
    const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    const buffer = fs.readFileSync(fullPath);
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

async function run() {
    console.log('Generating official LinkedIn Page assets for Fonzkart...');

    const cartLogoBase64 = getBase64Image('public/fonzkart_cart_exact_transparent.png');
    const brandLogoBase64 = getBase64Image('public/fonzkart_cart_brand_logo_transparent.png');

    // 1. Profile Logo HTML (400x400)
    const profileLogoHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            width: 400px;
            height: 400px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            position: relative;
            overflow: hidden;
        }
        .outer-border {
            position: absolute;
            inset: 0;
            border: 8px solid #10b981;
            border-radius: 0;
        }
        .bg-glow {
            position: absolute;
            width: 260px;
            height: 260px;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(255,255,255,0) 70%);
            z-index: 1;
        }
        .logo-img {
            width: 220px;
            height: auto;
            object-fit: contain;
            z-index: 2;
            filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.15));
        }
        .brand-name {
            font-size: 26px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
            margin-top: 8px;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 2px;
        }
        .brand-name span {
            color: #10b981;
        }
    </style>
</head>
<body>
    <div class="outer-border"></div>
    <div class="bg-glow"></div>
    <img class="logo-img" src="${cartLogoBase64}" alt="Fonzkart Logo" />
    <div class="brand-name">Fonz<span>kart</span></div>
</body>
</html>`;

    // 2. Cover Banner HTML (1128x191) - High-res layout (2256x382)
    const coverBannerHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            width: 2256px;
            height: 382px;
            background: #020617;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
        }
        /* Subtle mesh background grid & glow */
        .glow-left {
            position: absolute;
            top: -100px;
            left: 200px;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(2,6,23,0) 65%);
            filter: blur(40px);
        }
        .glow-right {
            position: absolute;
            bottom: -100px;
            right: 100px;
            width: 700px;
            height: 700px;
            background: radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, rgba(2,6,23,0) 65%);
            filter: blur(50px);
        }
        .grid-lines {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 48px 48px;
            opacity: 0.8;
        }
        
        /* Container: note LinkedIn profile photo occupies bottom-left (~280px wide on this scale) */
        .content {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0 100px 0 380px; /* Safe space for left profile avatar */
        }

        .left-info {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 1100px;
        }

        .badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.12);
            border: 1px solid rgba(16, 185, 129, 0.35);
            padding: 6px 18px;
            border-radius: 9999px;
            color: #34d399;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            width: fit-content;
        }

        .headline {
            font-size: 46px;
            font-weight: 900;
            line-height: 1.1;
            letter-spacing: -0.8px;
            color: #ffffff;
        }
        .headline span {
            background: linear-gradient(90deg, #10b981 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subheadline {
            font-size: 20px;
            color: #94a3b8;
            font-weight: 500;
            line-height: 1.4;
        }

        /* Pillars row */
        .features {
            display: flex;
            align-items: center;
            gap: 24px;
            margin-top: 4px;
        }
        .feature-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: 700;
            color: #f1f5f9;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 8px 18px;
            border-radius: 12px;
        }
        .feature-item .icon {
            font-size: 18px;
        }

        .right-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
            flex-shrink: 0;
            border-left: 1px solid rgba(255, 255, 255, 0.12);
            padding-left: 48px;
        }
        .brand-header-right {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .brand-logo-cart {
            width: 54px;
            height: auto;
            object-fit: contain;
            filter: drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3));
        }
        .web-url {
            font-size: 26px;
            font-weight: 800;
            color: #38bdf8;
            letter-spacing: -0.5px;
        }
        .corp-name {
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .contact-chip {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            padding: 8px 20px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            color: #10b981;
        }
    </style>
</head>
<body>
    <div class="grid-lines"></div>
    <div class="glow-left"></div>
    <div class="glow-right"></div>

    <div class="content">
        <div class="left-info">
            <div class="badge-pill">
                <span>⚡</span> INDIA&apos;S MOST TRUSTED RE-COMMERCE PLATFORM
            </div>
            <div class="headline">
                Smart Way to Sell Old Gadgets &amp; <span>Liquidate Corporate IT</span>
            </div>
            <div class="features">
                <div class="feature-item"><span class="icon">⚡</span> Instant Cash on Spot</div>
                <div class="feature-item"><span class="icon">🚚</span> 3-Hour Doorstep Pickup</div>
                <div class="feature-item"><span class="icon">🛡️</span> 100% Certified Data Wipe</div>
                <div class="feature-item"><span class="icon">♻️</span> Authorized E-Waste Recycling</div>
            </div>
        </div>

        <div class="right-info">
            <div class="brand-header-right">
                <img class="brand-logo-cart" src="${cartLogoBase64}" alt="Cart Logo" />
                <div class="web-url">www.fonzkart.in</div>
            </div>
            <div class="contact-chip">📞 +91 90603 36060</div>
            <div class="corp-name">NR Waste Management Pvt Ltd</div>
        </div>
    </div>
</body>
</html>`;

    // Save HTML files for reference & user preview
    fs.writeFileSync(path.join(outputDir, 'profile_logo.html'), profileLogoHtml, 'utf8');
    fs.writeFileSync(path.join(outputDir, 'cover_banner.html'), coverBannerHtml, 'utf8');

    // Launch puppeteer to generate high-resolution PNGs
    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // 1. Profile Logo (400x400)
        await page.setViewport({ width: 400, height: 400, deviceScaleFactor: 2 });
        await page.setContent(profileLogoHtml, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const profilePath = path.join(outputDir, 'fonzkart_linkedin_profile_logo_400x400.png');
        await page.screenshot({ path: profilePath });
        console.log('Created:', profilePath);

        // 2. Cover Banner (2256x382 Retina)
        await page.setViewport({ width: 2256, height: 382, deviceScaleFactor: 1 });
        await page.setContent(coverBannerHtml, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const bannerPathRetina = path.join(outputDir, 'fonzkart_linkedin_cover_banner_2256x382_retina.png');
        await page.screenshot({ path: bannerPathRetina });
        console.log('Created:', bannerPathRetina);

        // 3. Cover Banner Standard (1128x191)
        await page.setViewport({ width: 1128, height: 191, deviceScaleFactor: 1 });
        // Scale down cleanly
        const bannerPathStandard = path.join(outputDir, 'fonzkart_linkedin_cover_banner_1128x191.png');
        // We can resize or take screenshot at standard viewport
        const standardHtml = coverBannerHtml
            .replace('width: 2256px;', 'width: 1128px;')
            .replace('height: 382px;', 'height: 191px;')
            .replace('padding: 0 100px 0 380px;', 'padding: 0 50px 0 200px;')
            .replace('font-size: 46px;', 'font-size: 23px;')
            .replace('font-size: 20px;', 'font-size: 11px;')
            .replace('font-size: 15px;', 'font-size: 9px;')
            .replace('font-size: 16px;', 'font-size: 9px;')
            .replace('font-size: 26px;', 'font-size: 14px;')
            .replace('font-size: 14px;', 'font-size: 8px;')
            .replace('gap: 24px;', 'gap: 12px;')
            .replace('gap: 12px;', 'gap: 6px;')
            .replace('gap: 14px;', 'gap: 7px;')
            .replace('padding: 8px 18px;', 'padding: 4px 10px;')
            .replace('padding: 8px 20px;', 'padding: 4px 10px;')
            .replace('padding: 6px 18px;', 'padding: 3px 10px;')
            .replace('padding-left: 48px;', 'padding-left: 24px;')
            .replace('width: 54px;', 'width: 28px;')
            .replace('border-radius: 12px;', 'border-radius: 6px;')
            .replace('border-radius: 10px;', 'border-radius: 5px;');
        await page.setContent(standardHtml, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.screenshot({ path: bannerPathStandard });
        console.log('Created:', bannerPathStandard);

    } finally {
        await browser.close();
    }

    console.log('All LinkedIn assets successfully generated!');
}

run().catch(console.error);
