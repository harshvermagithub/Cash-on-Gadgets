const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Read the base64 constants from our pre-generated text file
const ICON_BASE64 = fs.readFileSync(path.join(__dirname, '../public/icon_base64.txt'), 'utf8').trim();

// HTML generator for 1:1 Square WhatsApp DP (Cart above FonzKart wordmark, horizontally & vertically centered, no address)
function generateSquareDPHTML(theme, size = 1000, showCropGuide = false) {
    const isDark = theme === 'dark';
    const bgColor = isDark ? '#090d16' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';

    // Proportions calibrated for maximum legibility inside WhatsApp's 1:1 circular crop safe zone
    const cartWidth = 390;
    const cartHeight = 345;
    const phoneWidth = 92;
    const phoneHeight = 154;
    const fontSize = 108;
    const gap = 28;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>FonzKart WhatsApp DP - ${theme.toUpperCase()}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: ${bgColor};
            color: ${textColor};
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .page {
            width: ${size}px;
            height: ${size}px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            background-color: ${bgColor};
            overflow: hidden;
        }
        
        /* Central Stack: Cart on top, FonzKart below, perfectly centered */
        .brand-stack {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: ${gap}px;
            transform: translateY(-8px); /* optical center compensation for cart wheels */
        }
        
        /* Cart Logo Layout */
        .cart-logo-container {
            width: ${cartWidth}px;
            height: ${cartHeight}px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            flex-shrink: 0;
        }
        
        .cart-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
        }
        
        .gadget-cluster {
            position: absolute;
            left: 54%;
            top: 40%;
            width: 62%;
            height: 50%;
            transform: translate(-50%, -50%);
        }
        
        .phone-wrapper {
            position: absolute;
            left: 38%;
            top: 2%;
            width: 24%;
            height: 72%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Wordmark Brand Layout */
        .wordmark-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
        }
        
        /* Logo Phone Frame inside Wordmark */
        .logo-phone {
            width: ${phoneWidth}px;
            height: ${phoneHeight}px;
            position: relative;
            flex-shrink: 0;
        }
        
        .brand-text {
            font-size: ${fontSize}px;
            font-weight: 900;
            letter-spacing: -0.04em;
            display: flex;
            align-items: center;
            line-height: 1;
        }
        
        .brand-text span {
            display: inline-block;
        }
        
        .rupee-symbol {
            color: #159c4f;
            margin: 0 4px;
        }

        /* Circular crop guideline overlay for checking safe zones */
        .crop-circle-guide {
            position: absolute;
            top: 0;
            left: 0;
            width: 1000px;
            height: 1000px;
            border-radius: 50%;
            border: 4px dashed rgba(239, 68, 68, 0.6);
            pointer-events: none;
            box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.35);
        }
    </style>
</head>
<body>

    <div class="page">
        <div class="brand-stack">
            <!-- 1. Cart Logo Composition (Centered Above) -->
            <div class="cart-logo-container">
                <div class="cart-wrapper">
                    <!-- SVG Cart Outline -->
                    <svg width="100%" height="100%" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="22,55 33,60 82,60 90,38 24,38" fill="rgba(34,197,94,0.12)" />
                        <path d="M5 5H16L24 54C24.7 57.3 27.6 59.5 31 59.5H80C83.2 59.5 85.9 57.5 86.8 54.5L95 33" stroke="#16a34a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31 59.5H80C83.2 59.5 85.9 57.5 86.8 54.5L95 33" stroke="#a3e635" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="35" cy="72" r="5" stroke="#16a34a" stroke-width="3.5" fill="none" />
                        <circle cx="78" cy="72" r="5" stroke="#16a34a" stroke-width="3.5" fill="none" />
                        <circle cx="35" cy="72" r="1.5" fill="#4ade80" />
                        <circle cx="78" cy="72" r="1.5" fill="#4ade80" />
                    </svg>

                    <!-- Gadget Basket Content -->
                    <div class="gadget-cluster">
                        <svg viewBox="0 0 100 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Left Laptop -->
                            <g transform="translate(6, 32)">
                                <rect x="3" y="0" width="34" height="22" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1"/>
                                <rect x="5" y="2" width="30" height="18" rx="1" fill="#6366F1"/>
                                <rect x="8" y="5" width="14" height="2" rx="1" fill="#ffffff" opacity="0.4"/>
                                <rect x="8" y="9" width="20" height="2" rx="1" fill="#ffffff" opacity="0.3"/>
                                <rect x="8" y="13" width="16" height="2" rx="1" fill="#ffffff" opacity="0.25"/>
                                <path d="M 0 22 C 0 21.5 0.4 21 1 21 H 39 C 39.6 21 40 21.5 40 22 V 24 C 40 25.1 39.1 26 38 26 H 2 C 0.9 26 0 25.1 0 24 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="0.8"/>
                                <rect x="15" y="23" width="10" height="2" rx="1" fill="#94a3b8"/>
                            </g>

                            <!-- Right Smart TV (No Stand) -->
                            <g transform="translate(48, 30)">
                                <rect x="0" y="0" width="46" height="26" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1.2"/>
                                <rect x="2" y="2" width="42" height="22" rx="1" fill="#0284C7"/>
                                <rect x="5" y="4" width="10" height="7" rx="1" fill="#EF4444"/>
                                <rect x="18" y="4" width="10" height="7" rx="1" fill="#F59E0B"/>
                                <rect x="31" y="4" width="10" height="7" rx="1" fill="#6366F1"/>
                                <rect x="5" y="14" width="36" height="3" rx="1" fill="#ffffff" opacity="0.3"/>
                                <path d="M 2 2 H 44 V 12 L 2 20 Z" fill="#ffffff" opacity="0.1"/>
                            </g>

                            <!-- Top-Left Camera -->
                            <g transform="translate(4, 6)">
                                <rect x="10" y="0" width="12" height="4" rx="1" fill="#64748b"/>
                                <rect x="1" y="4" width="30" height="20" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1"/>
                                <circle cx="16" cy="14" r="7" stroke="#38bdf8" stroke-width="1.5" fill="none"/>
                                <circle cx="16" cy="14" r="4.5" fill="#0ea5e9"/>
                                <circle cx="15" cy="12" r="1.5" fill="#ffffff" opacity="0.5"/>
                                <circle cx="27" cy="8" r="1.5" fill="#ef4444"/>
                            </g>

                            <!-- Top-Right Smart Watch -->
                            <g transform="translate(74, 4)">
                                <path d="M 6 0 H 16 V 8 H 6 Z" fill="#64748b"/>
                                <path d="M 6 28 H 16 V 36 H 6 Z" fill="#64748b"/>
                                <rect x="1" y="7" width="20" height="22" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
                                <rect x="3" y="9" width="16" height="18" rx="2.5" fill="#0F172A"/>
                                <rect x="5" y="12" width="12" height="3" rx="1" fill="#38BDF8"/>
                                <circle cx="11" cy="20" r="3.5" stroke="#f97316" stroke-width="1.2" fill="none"/>
                            </g>
                        </svg>

                        <!-- Center Smartphone (Solid green screen with enlarged F logo) -->
                        <div class="phone-wrapper">
                            <svg viewBox="0 0 32 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                                <rect x="1" y="1" width="30" height="58" rx="5" fill="#1c1917" stroke="#27272a" stroke-width="1.8" />
                                <rect x="2.2" y="2.2" width="27.6" height="55.6" rx="4" fill="#000000" />
                                <rect x="3" y="3" width="26" height="54" rx="3.2" fill="#159c4f" />
                                <g clip-path="url(#phone-screen-clip-${theme})">
                                    <image
                                        x="4"
                                        y="18"
                                        width="24"
                                        height="24"
                                        href="${ICON_BASE64}"
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="phone-screen-clip-${theme}">
                                        <rect x="3" y="3" width="26" height="54" rx="3.2" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Wordmark Logo (FONZKART) Centered Beneath Cart -->
            <div class="wordmark-container">
                <!-- Smartphone Logo inside Wordmark (F replacement) -->
                <div class="logo-phone">
                    <svg viewBox="0 0 32 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                        <rect x="1" y="1" width="30" height="58" rx="5" fill="#1c1917" stroke="#27272a" stroke-width="1.8" />
                        <rect x="2.2" y="2.2" width="27.6" height="55.6" rx="4" fill="#000000" />
                        <rect x="3" y="3" width="26" height="54" rx="3.2" fill="#159c4f" />
                        <g clip-path="url(#logo-phone-clip-${theme})">
                            <image
                                x="4"
                                y="18"
                                width="24"
                                height="24"
                                href="${ICON_BASE64}"
                                preserveAspectRatio="xMidYMid meet"
                            />
                        </g>
                        <defs>
                            <clipPath id="logo-phone-clip-${theme}">
                                <rect x="3" y="3" width="26" height="54" rx="3.2" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                
                <!-- Logo text with Rupee symbol as R replacement -->
                <div class="brand-text">
                    <span>ONZKA</span>
                    <span class="rupee-symbol">₹</span>
                    <span>T</span>
                </div>
            </div>
        </div>
        ${showCropGuide ? '<div class="crop-circle-guide"></div>' : ''}
    </div>

</body>
</html>`;
}

// Also generate the exact 1400x520 banner file with NR Waste Management removed
function generateBannerNoAddressHTML(theme, width = 1400, height = 520) {
    const isDark = theme === 'dark';
    const bgColor = isDark ? '#090d16' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>FonzKart Logo (No Address) - ${theme.toUpperCase()}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: ${bgColor};
            color: ${textColor};
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .page {
            width: ${width}px;
            height: ${height}px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            background-color: ${bgColor};
            overflow: hidden;
        }
        
        /* Central Stack: Cart on top, FonzKart below, centered horizontally */
        .brand-stack {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 22px;
        }
        
        /* Cart Logo Layout */
        .cart-logo-container {
            width: 250px;
            height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            flex-shrink: 0;
        }
        
        .cart-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
        }
        
        .gadget-cluster {
            position: absolute;
            left: 54%;
            top: 40%;
            width: 62%;
            height: 50%;
            transform: translate(-50%, -50%);
        }
        
        .phone-wrapper {
            position: absolute;
            left: 38%;
            top: 2%;
            width: 24%;
            height: 72%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Wordmark Brand Layout */
        .wordmark-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
        }
        
        /* Logo Phone Frame inside Wordmark */
        .logo-phone {
            width: 62px;
            height: 104px;
            position: relative;
            flex-shrink: 0;
        }
        
        .brand-text {
            font-size: 72px;
            font-weight: 900;
            letter-spacing: -0.04em;
            display: flex;
            align-items: center;
            line-height: 1;
        }
        
        .brand-text span {
            display: inline-block;
        }
        
        .rupee-symbol {
            color: #159c4f;
            margin: 0 4px;
        }
    </style>
</head>
<body>

    <div class="page">
        <div class="brand-stack">
            <!-- 1. Cart Logo Composition (Centered Above) -->
            <div class="cart-logo-container">
                <div class="cart-wrapper">
                    <!-- SVG Cart Outline -->
                    <svg width="100%" height="100%" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="22,55 33,60 82,60 90,38 24,38" fill="rgba(34,197,94,0.12)" />
                        <path d="M5 5H16L24 54C24.7 57.3 27.6 59.5 31 59.5H80C83.2 59.5 85.9 57.5 86.8 54.5L95 33" stroke="#16a34a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31 59.5H80C83.2 59.5 85.9 57.5 86.8 54.5L95 33" stroke="#a3e635" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="35" cy="72" r="5" stroke="#16a34a" stroke-width="3.5" fill="none" />
                        <circle cx="78" cy="72" r="5" stroke="#16a34a" stroke-width="3.5" fill="none" />
                        <circle cx="35" cy="72" r="1.5" fill="#4ade80" />
                        <circle cx="78" cy="72" r="1.5" fill="#4ade80" />
                    </svg>

                    <!-- Gadget Basket Content -->
                    <div class="gadget-cluster">
                        <svg viewBox="0 0 100 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Left Laptop -->
                            <g transform="translate(6, 32)">
                                <rect x="3" y="0" width="34" height="22" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1"/>
                                <rect x="5" y="2" width="30" height="18" rx="1" fill="#6366F1"/>
                                <rect x="8" y="5" width="14" height="2" rx="1" fill="#ffffff" opacity="0.4"/>
                                <rect x="8" y="9" width="20" height="2" rx="1" fill="#ffffff" opacity="0.3"/>
                                <rect x="8" y="13" width="16" height="2" rx="1" fill="#ffffff" opacity="0.25"/>
                                <path d="M 0 22 C 0 21.5 0.4 21 1 21 H 39 C 39.6 21 40 21.5 40 22 V 24 C 40 25.1 39.1 26 38 26 H 2 C 0.9 26 0 25.1 0 24 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="0.8"/>
                                <rect x="15" y="23" width="10" height="2" rx="1" fill="#94a3b8"/>
                            </g>

                            <!-- Right Smart TV (No Stand) -->
                            <g transform="translate(48, 30)">
                                <rect x="0" y="0" width="46" height="26" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1.2"/>
                                <rect x="2" y="2" width="42" height="22" rx="1" fill="#0284C7"/>
                                <rect x="5" y="4" width="10" height="7" rx="1" fill="#EF4444"/>
                                <rect x="18" y="4" width="10" height="7" rx="1" fill="#F59E0B"/>
                                <rect x="31" y="4" width="10" height="7" rx="1" fill="#6366F1"/>
                                <rect x="5" y="14" width="36" height="3" rx="1" fill="#ffffff" opacity="0.3"/>
                                <path d="M 2 2 H 44 V 12 L 2 20 Z" fill="#ffffff" opacity="0.1"/>
                            </g>

                            <!-- Top-Left Camera -->
                            <g transform="translate(4, 6)">
                                <rect x="10" y="0" width="12" height="4" rx="1" fill="#64748b"/>
                                <rect x="1" y="4" width="30" height="20" rx="3" fill="#0f172a" stroke="#475569" stroke-width="1"/>
                                <circle cx="16" cy="14" r="7" stroke="#38bdf8" stroke-width="1.5" fill="none"/>
                                <circle cx="16" cy="14" r="4.5" fill="#0ea5e9"/>
                                <circle cx="15" cy="12" r="1.5" fill="#ffffff" opacity="0.5"/>
                                <circle cx="27" cy="8" r="1.5" fill="#ef4444"/>
                            </g>

                            <!-- Top-Right Smart Watch -->
                            <g transform="translate(74, 4)">
                                <path d="M 6 0 H 16 V 8 H 6 Z" fill="#64748b"/>
                                <path d="M 6 28 H 16 V 36 H 6 Z" fill="#64748b"/>
                                <rect x="1" y="7" width="20" height="22" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1"/>
                                <rect x="3" y="9" width="16" height="18" rx="2.5" fill="#0F172A"/>
                                <rect x="5" y="12" width="12" height="3" rx="1" fill="#38BDF8"/>
                                <circle cx="11" cy="20" r="3.5" stroke="#f97316" stroke-width="1.2" fill="none"/>
                            </g>
                        </svg>

                        <!-- Center Smartphone (Solid green screen with enlarged F logo) -->
                        <div class="phone-wrapper">
                            <svg viewBox="0 0 32 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                                <rect x="1" y="1" width="30" height="58" rx="5" fill="#1c1917" stroke="#27272a" stroke-width="1.8" />
                                <rect x="2.2" y="2.2" width="27.6" height="55.6" rx="4" fill="#000000" />
                                <rect x="3" y="3" width="26" height="54" rx="3.2" fill="#159c4f" />
                                <g clip-path="url(#phone-screen-clip-${theme})">
                                    <image
                                        x="4"
                                        y="18"
                                        width="24"
                                        height="24"
                                        href="${ICON_BASE64}"
                                        preserveAspectRatio="xMidYMid meet"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="phone-screen-clip-${theme}">
                                        <rect x="3" y="3" width="26" height="54" rx="3.2" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Wordmark Logo (FONZKART) Centered Beneath Cart -->
            <div class="wordmark-container">
                <!-- Smartphone Logo inside Wordmark (F replacement) -->
                <div class="logo-phone">
                    <svg viewBox="0 0 32 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                        <rect x="1" y="1" width="30" height="58" rx="5" fill="#1c1917" stroke="#27272a" stroke-width="1.8" />
                        <rect x="2.2" y="2.2" width="27.6" height="55.6" rx="4" fill="#000000" />
                        <rect x="3" y="3" width="26" height="54" rx="3.2" fill="#159c4f" />
                        <g clip-path="url(#logo-phone-clip-${theme})">
                            <image
                                x="4"
                                y="18"
                                width="24"
                                height="24"
                                href="${ICON_BASE64}"
                                preserveAspectRatio="xMidYMid meet"
                            />
                        </g>
                        <defs>
                            <clipPath id="logo-phone-clip-${theme}">
                                <rect x="3" y="3" width="26" height="54" rx="3.2" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                
                <!-- Logo text with Rupee symbol as R replacement -->
                <div class="brand-text">
                    <span>ONZKA</span>
                    <span class="rupee-symbol">₹</span>
                    <span>T</span>
                </div>
            </div>
        </div>
    </div>

</body>
</html>`;
}

async function run() {
    console.log('Generating WhatsApp DP files...');

    const waLightHtml = path.resolve(__dirname, '../public/whatsapp_dp_light.html');
    const waDarkHtml = path.resolve(__dirname, '../public/whatsapp_dp_dark.html');
    const bannerLightHtml = path.resolve(__dirname, '../public/shop_logo_no_address_light.html');
    const bannerDarkHtml = path.resolve(__dirname, '../public/shop_logo_no_address_dark.html');
    const checkGuideHtml = path.resolve(__dirname, '../public/whatsapp_dp_crop_check.html');

    fs.writeFileSync(waLightHtml, generateSquareDPHTML('light', 1000, false));
    fs.writeFileSync(waDarkHtml, generateSquareDPHTML('dark', 1000, false));
    fs.writeFileSync(checkGuideHtml, generateSquareDPHTML('light', 1000, true));
    fs.writeFileSync(bannerLightHtml, generateBannerNoAddressHTML('light', 1400, 520));
    fs.writeFileSync(bannerDarkHtml, generateBannerNoAddressHTML('dark', 1400, 520));

    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 1. WhatsApp DP Light (1000x1000 square)
    console.log('Rendering WhatsApp DP Light (1000x1000)...');
    await page.setViewport({ width: 1000, height: 1000, deviceScaleFactor: 2 });
    await page.goto('file://' + waLightHtml, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '../public/whatsapp_dp_light.png') });
    await page.pdf({
        path: path.resolve(__dirname, '../public/whatsapp_dp_light.pdf'),
        width: '1000px',
        height: '1000px',
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    // 2. WhatsApp DP Dark (1000x1000 square)
    console.log('Rendering WhatsApp DP Dark (1000x1000)...');
    await page.goto('file://' + waDarkHtml, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '../public/whatsapp_dp_dark.png') });
    await page.pdf({
        path: path.resolve(__dirname, '../public/whatsapp_dp_dark.pdf'),
        width: '1000px',
        height: '1000px',
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    // 3. Verification Crop Guide
    console.log('Rendering Crop Check Guide...');
    await page.goto('file://' + checkGuideHtml, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '../public/whatsapp_dp_crop_check.png') });

    // 4. Banner without address Light (1400x520)
    console.log('Rendering Banner without address Light (1400x520)...');
    await page.setViewport({ width: 1400, height: 520, deviceScaleFactor: 2 });
    await page.goto('file://' + bannerLightHtml, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '../public/shop_logo_no_address_light.png') });
    await page.pdf({
        path: path.resolve(__dirname, '../public/shop_logo_no_address_light.pdf'),
        width: '1400px',
        height: '520px',
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    // 5. Banner without address Dark (1400x520)
    console.log('Rendering Banner without address Dark (1400x520)...');
    await page.goto('file://' + bannerDarkHtml, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.resolve(__dirname, '../public/shop_logo_no_address_dark.png') });
    await page.pdf({
        path: path.resolve(__dirname, '../public/shop_logo_no_address_dark.pdf'),
        width: '1400px',
        height: '520px',
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    await browser.close();
    console.log('All WhatsApp DP and Banner (no address) files generated successfully!');
}

run().catch(err => {
    console.error('Error generating WhatsApp DP:', err);
    process.exit(1);
});
