const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');

const postersDir = path.join(__dirname, '..', 'public', 'careers', 'posters');
const htmlDir = path.join(postersDir, 'html');

if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
}

// Convert image to base64 data URI for reliable offline embedding
function getBase64Image(relativePath) {
    const fullPath = path.join(__dirname, '..', relativePath);
    if (!fs.existsSync(fullPath)) return '';
    const ext = path.extname(fullPath).toLowerCase().replace('.', '');
    const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    const buffer = fs.readFileSync(fullPath);
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

async function generatePosters() {
    console.log('Generating hiring posters...');

    const nrLogoBase64 = getBase64Image('public/logos/nr/nr_logo_transparent_gold.png') || getBase64Image('public/logos/nr/nr_logo_white_bg.png');
    const fonzkartLogoBase64 = getBase64Image('public/fonzkart_cart_brand_logo_transparent.png');
    const riderImageBase64 = getBase64Image('public/fonzkart_rider_isolated.png');

    // Generate WhatsApp QR Codes
    const accountantQrUrl = 'https://wa.me/919060336060?text=Hi%20FonzKart%20Hiring%20Team%2C%20I%20am%20applying%20for%20the%20Accountant%20%26%20Operations%20Executive%20position%20at%20Bangalore.%20Here%20are%20my%20details%3A';
    const fieldExecQrUrl = 'https://wa.me/919060336060?text=Hi%20FonzKart%20Hiring%20Team%2C%20I%20am%20applying%20for%20the%20Field%20Executive%20position%20at%20Bangalore.%20Here%20are%20my%20details%3A';

    const accountantQrBase64 = await QRCode.toDataURL(accountantQrUrl, {
        width: 400,
        margin: 1,
        color: {
            dark: '#064e3b',
            light: '#ffffff'
        }
    });

    const fieldExecQrBase64 = await QRCode.toDataURL(fieldExecQrUrl, {
        width: 400,
        margin: 1,
        color: {
            dark: '#064e3b',
            light: '#ffffff'
        }
    });

    // SVG Icons
    const whatsappIconSvg = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"/>
    </svg>`;

    const phoneIconSvg = `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>`;

    const mailIconSvg = `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>`;

    const mapPinIconSvg = `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>`;

    const checkIconSvg = `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>`;

    // Poster 1: Accountant & Operations Executive
    const accountantHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We Are Hiring - Accountant & Operations Executive | FonzKart & NR Waste Management</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            width: 1200px;
            height: 1697px;
            background: #ffffff;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #0f172a;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Luxury Background Accents */
        .bg-pattern {
            position: absolute;
            inset: 0;
            background: 
                radial-gradient(circle at 10% 15%, rgba(16, 185, 129, 0.08) 0%, transparent 45%),
                radial-gradient(circle at 90% 85%, rgba(217, 119, 6, 0.06) 0%, transparent 50%),
                linear-gradient(180deg, #f8fafc 0%, #ffffff 30%, #ffffff 70%, #f0fdf4 100%);
            z-index: 0;
        }

        .border-frame {
            position: absolute;
            inset: 24px;
            border: 2px solid #e2e8f0;
            border-radius: 36px;
            pointer-events: none;
            z-index: 1;
        }

        .content-container {
            position: relative;
            z-index: 2;
            padding: 50px 60px 40px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Top Brand Bar */
        .top-brand-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 24px;
            border-bottom: 1.5px solid #e2e8f0;
        }

        .parent-company-brand {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .nr-logo-img {
            height: 70px;
            width: auto;
            object-fit: contain;
        }

        .parent-title-group h3 {
            font-family: 'Cinzel', serif;
            font-size: 19px;
            font-weight: 700;
            letter-spacing: 1.2px;
            color: #0f172a;
            line-height: 1.2;
        }

        .parent-title-group p {
            font-size: 11px;
            letter-spacing: 2px;
            color: #b45309;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 3px;
        }

        .brand-divider {
            height: 50px;
            width: 1.5px;
            background: #cbd5e1;
        }

        .fonzkart-logo-img {
            height: 58px;
            width: auto;
            object-fit: contain;
        }

        /* Main Hero Badge & Title */
        .hero-section {
            text-align: center;
            margin-top: 24px;
        }

        .hiring-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 24px;
            border-radius: 50px;
            background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            box-shadow: 0 10px 25px rgba(5, 150, 105, 0.25);
            margin-bottom: 16px;
        }

        .role-title {
            font-size: 48px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.15;
            letter-spacing: -0.5px;
            margin-bottom: 10px;
        }

        .role-title span {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .role-subtitle {
            font-size: 17px;
            color: #475569;
            font-weight: 500;
        }

        /* Key Metrics Row */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin: 24px 0 28px;
        }

        .metric-card {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 20px;
            padding: 16px 14px;
            text-align: center;
        }

        .metric-label {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .metric-value {
            font-size: 16px;
            font-weight: 800;
            color: #064e3b;
        }

        /* Main 2-Column Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }

        .info-card {
            background: #ffffff;
            border: 1.5px solid #e2e8f0;
            border-radius: 24px;
            padding: 26px 28px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .card-header-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #047857;
            background: #ecfdf5;
            padding: 4px 12px;
            border-radius: 8px;
            margin-bottom: 14px;
            border: 1px solid #a7f3d0;
        }

        .info-card h3 {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 16px;
        }

        .points-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .points-list li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 14.5px;
            color: #334155;
            line-height: 1.45;
        }

        .points-list li strong {
            color: #0f172a;
        }

        .check-icon {
            flex-shrink: 0;
            margin-top: 2px;
            background: #ecfdf5;
            border-radius: 50%;
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Special Highlights Callout */
        .special-callout {
            background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
            border-radius: 24px;
            padding: 20px 28px;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .callout-text h4 {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 4px;
        }

        .callout-text p {
            font-size: 13.5px;
            color: #a7f3d0;
        }

        .callout-badge {
            background: #ffffff;
            color: #064e3b;
            font-weight: 800;
            font-size: 14px;
            padding: 8px 18px;
            border-radius: 12px;
            letter-spacing: 0.5px;
            white-space: nowrap;
        }

        /* Bottom Application & Contact Footer */
        .footer-cta-container {
            background: #f8fafc;
            border: 2px solid #059669;
            border-radius: 30px;
            padding: 24px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
        }

        .contact-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .contact-row-primary {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #ffffff;
            padding: 10px 18px;
            border-radius: 16px;
            border: 1.5px solid #25d366;
            width: fit-content;
        }

        .whatsapp-icon-wrapper {
            color: #25d366;
            display: flex;
            align-items: center;
        }

        .primary-phone-number {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 0.5px;
        }

        .whatsapp-tag {
            background: #25d366;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: 6px;
            margin-left: 6px;
        }

        .contact-grid-secondary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 13px;
            color: #334155;
        }

        .secondary-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
        }

        .address-item {
            grid-column: span 2;
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 12px;
            color: #64748b;
            line-height: 1.35;
        }

        /* QR Code Card */
        .qr-card {
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 22px;
            padding: 14px 18px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
            flex-shrink: 0;
        }

        .qr-card-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #064e3b;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .qr-img {
            width: 120px;
            height: 120px;
            border-radius: 12px;
        }

        .qr-subtext {
            font-size: 10px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="bg-pattern"></div>
    <div class="border-frame"></div>

    <div class="content-container">
        <!-- Top Brand Bar -->
        <header class="top-brand-bar">
            <div class="parent-company-brand">
                <img src="${nrLogoBase64}" alt="NR Waste Management Private Limited" class="nr-logo-img">
                <div class="parent-title-group">
                    <h3>NR WASTE MANAGEMENT</h3>
                    <p>Private Limited</p>
                </div>
            </div>

            <div class="brand-divider"></div>

            <div class="retail-brand">
                <img src="${fonzkartLogoBase64}" alt="FonzKart" class="fonzkart-logo-img">
            </div>
        </header>

        <!-- Main Hero Title -->
        <section class="hero-section">
            <div class="hiring-badge">★ We Are Hiring ★</div>
            <h1 class="role-title">Accountant &amp; <span>Operations Executive</span></h1>
            <p class="role-subtitle">Lead Financial Bookkeeping, Order Audits &amp; FonzKart Admin Panel Operations</p>
        </section>

        <!-- Key Metrics Strip -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Job Type</div>
                <div class="metric-value">Full-Time | On-Site</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Location</div>
                <div class="metric-value">Bangalore HQ</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Experience</div>
                <div class="metric-value">1 – 3 Years</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Remuneration</div>
                <div class="metric-value">Competitive + Bonus</div>
            </div>
        </div>

        <!-- 2-Column Details Grid -->
        <div class="info-grid">
            <!-- Left: Key Responsibilities -->
            <div class="info-card">
                <span class="card-header-badge">Key Responsibilities</span>
                <h3>What You Will Do</h3>
                <ul class="points-list">
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>FonzKart Admin Panel:</strong> Verify completed pickup orders, validate device grades, and approve instant customer payouts.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Daily Cash &amp; UPI Reconciliation:</strong> Reconcile field cash collections and IMPS/UPI handovers from Field Executives (Riders) against system logs.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Bookkeeping &amp; Ledgers:</strong> Maintain daybooks, accounts payable, accounts receivable, and banking records in Tally Prime &amp; Excel.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Invoicing &amp; Billing:</strong> Generate GST-compliant invoices for corporate bulk gadget purchases and scrap recycling settlements.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Office Administration:</strong> Manage petty cash, utility expenses, courier logistics payments, and maintain documentation.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Compliance &amp; Reporting:</strong> Coordinate with Chartered Accountants for monthly GST, TDS computations, and P&amp;L reports.</span>
                    </li>
                </ul>
            </div>

            <!-- Right: Requirements & Skills -->
            <div class="info-card">
                <span class="card-header-badge">Candidate Profile</span>
                <h3>What We Are Looking For</h3>
                <ul class="points-list">
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Educational Background:</strong> Degree in Commerce / Accounting (B.Com, M.Com, BBA Finance or equivalent).</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Work Experience:</strong> 1 to 3 years of hands-on experience in accounting, cash handling, and reconciliation.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Software Proficiency:</strong> Solid working knowledge of <strong>Tally Prime / ERP 9</strong> and <strong>MS Excel</strong> (VLOOKUP, Pivot Tables, SUMIFS).</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Tech-Savviness:</strong> Comfort navigating modern web SaaS admin portals and digital transaction records.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Integrity &amp; Accuracy:</strong> High numerical accuracy, trustworthiness, and prompt coordination with operations teams.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Work Timings:</strong> Monday to Saturday | 9:30 AM – 6:30 PM (Immediate Joiners Preferred).</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Special Highlights Banner -->
        <div class="special-callout">
            <div class="callout-text">
                <h4>Join the Circular Tech &amp; Re-Commerce Revolution</h4>
                <p>Work directly with founders and leadership team in a fast-paced, technology-driven environment with clear growth paths.</p>
            </div>
            <div class="callout-badge">Immediate Joining</div>
        </div>

        <!-- Bottom Contact & Application Footer -->
        <footer class="footer-cta-container">
            <div class="contact-details">
                <div class="contact-row-primary">
                    <span class="whatsapp-icon-wrapper">${whatsappIconSvg}</span>
                    <span class="primary-phone-number">+91 90603 36060</span>
                    <span class="whatsapp-tag">WhatsApp &amp; Call</span>
                </div>

                <div class="contact-grid-secondary">
                    <div class="secondary-item">
                        <span style="color: #059669;">${mailIconSvg}</span>
                        <span>careers@fonzkart.in</span>
                    </div>
                    <div class="secondary-item">
                        <span style="color: #059669;">${phoneIconSvg}</span>
                        <span>Official Recruitment Desk</span>
                    </div>
                    <div class="address-item">
                        <span style="color: #059669; margin-top: 1px;">${mapPinIconSvg}</span>
                        <span><strong>Office Address:</strong> #69 8th cross Hegde Nagar, SRK Nagar Post, Bangalore - 560077</span>
                    </div>
                </div>
            </div>

            <!-- QR Code Box -->
            <div class="qr-card">
                <div class="qr-card-title">
                    <span style="color: #25d366;">${whatsappIconSvg}</span>
                    <span>Scan to Apply</span>
                </div>
                <img src="${accountantQrBase64}" alt="Scan QR code to apply on WhatsApp" class="qr-img">
                <div class="qr-subtext">Direct HR WhatsApp</div>
            </div>
        </footer>
    </div>
</body>
</html>`;

    // Poster 2: Field Executive / Device Evaluation Specialist
    const fieldExecHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We Are Hiring - Field Executive | FonzKart & NR Waste Management</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            width: 1200px;
            height: 1697px;
            background: #ffffff;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #0f172a;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Background Accents */
        .bg-pattern {
            position: absolute;
            inset: 0;
            background: 
                radial-gradient(circle at 15% 20%, rgba(16, 185, 129, 0.09) 0%, transparent 45%),
                radial-gradient(circle at 85% 75%, rgba(6, 78, 59, 0.08) 0%, transparent 50%),
                linear-gradient(180deg, #f8fafc 0%, #ffffff 30%, #ffffff 70%, #f0fdf4 100%);
            z-index: 0;
        }

        .border-frame {
            position: absolute;
            inset: 24px;
            border: 2px solid #e2e8f0;
            border-radius: 36px;
            pointer-events: none;
            z-index: 1;
        }

        .content-container {
            position: relative;
            z-index: 2;
            padding: 50px 60px 40px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Top Brand Bar */
        .top-brand-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 24px;
            border-bottom: 1.5px solid #e2e8f0;
        }

        .parent-company-brand {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .nr-logo-img {
            height: 70px;
            width: auto;
            object-fit: contain;
        }

        .parent-title-group h3 {
            font-family: 'Cinzel', serif;
            font-size: 19px;
            font-weight: 700;
            letter-spacing: 1.2px;
            color: #0f172a;
            line-height: 1.2;
        }

        .parent-title-group p {
            font-size: 11px;
            letter-spacing: 2px;
            color: #b45309;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 3px;
        }

        .brand-divider {
            height: 50px;
            width: 1.5px;
            background: #cbd5e1;
        }

        .fonzkart-logo-img {
            height: 58px;
            width: auto;
            object-fit: contain;
        }

        /* Hero Section */
        .hero-section {
            text-align: center;
            margin-top: 24px;
        }

        .hiring-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 24px;
            border-radius: 50px;
            background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            box-shadow: 0 10px 25px rgba(5, 150, 105, 0.25);
            margin-bottom: 16px;
        }

        .role-title {
            font-size: 46px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.15;
            letter-spacing: -0.5px;
            margin-bottom: 10px;
        }

        .role-title span {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .role-subtitle {
            font-size: 17px;
            color: #475569;
            font-weight: 500;
        }

        /* Key Metrics Row */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin: 24px 0 28px;
        }

        .metric-card {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 20px;
            padding: 16px 14px;
            text-align: center;
        }

        .metric-label {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .metric-value {
            font-size: 16px;
            font-weight: 800;
            color: #064e3b;
        }

        /* Main 2-Column Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
        }

        .info-card {
            background: #ffffff;
            border: 1.5px solid #e2e8f0;
            border-radius: 24px;
            padding: 26px 28px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .card-header-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #047857;
            background: #ecfdf5;
            padding: 4px 12px;
            border-radius: 8px;
            margin-bottom: 14px;
            border: 1px solid #a7f3d0;
        }

        .info-card h3 {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 16px;
        }

        .points-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .points-list li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 14.5px;
            color: #334155;
            line-height: 1.45;
        }

        .points-list li strong {
            color: #0f172a;
        }

        .check-icon {
            flex-shrink: 0;
            margin-top: 2px;
            background: #ecfdf5;
            border-radius: 50%;
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Mandatory Highlight Strip */
        .mandatory-strip {
            background: #fef3c7;
            border: 1.5px solid #f59e0b;
            border-radius: 20px;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
        }

        .mandatory-icon {
            font-size: 28px;
        }

        .mandatory-text h4 {
            font-size: 15px;
            font-weight: 800;
            color: #92400e;
        }

        .mandatory-text p {
            font-size: 13px;
            color: #78350f;
            margin-top: 2px;
        }

        /* Compensation Callout */
        .special-callout {
            background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
            border-radius: 24px;
            padding: 20px 28px;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .callout-text h4 {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 4px;
        }

        .callout-text p {
            font-size: 13.5px;
            color: #a7f3d0;
        }

        .callout-badge {
            background: #ffffff;
            color: #064e3b;
            font-weight: 800;
            font-size: 14px;
            padding: 8px 18px;
            border-radius: 12px;
            letter-spacing: 0.5px;
            white-space: nowrap;
        }

        /* Bottom Application & Contact Footer */
        .footer-cta-container {
            background: #f8fafc;
            border: 2px solid #059669;
            border-radius: 30px;
            padding: 24px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
        }

        .contact-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .contact-row-primary {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #ffffff;
            padding: 10px 18px;
            border-radius: 16px;
            border: 1.5px solid #25d366;
            width: fit-content;
        }

        .whatsapp-icon-wrapper {
            color: #25d366;
            display: flex;
            align-items: center;
        }

        .primary-phone-number {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 0.5px;
        }

        .whatsapp-tag {
            background: #25d366;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 3px 8px;
            border-radius: 6px;
            margin-left: 6px;
        }

        .contact-grid-secondary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 13px;
            color: #334155;
        }

        .secondary-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
        }

        .address-item {
            grid-column: span 2;
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 12px;
            color: #64748b;
            line-height: 1.35;
        }

        /* QR Code Card */
        .qr-card {
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 22px;
            padding: 14px 18px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
            flex-shrink: 0;
        }

        .qr-card-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #064e3b;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .qr-img {
            width: 120px;
            height: 120px;
            border-radius: 12px;
        }

        .qr-subtext {
            font-size: 10px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="bg-pattern"></div>
    <div class="border-frame"></div>

    <div class="content-container">
        <!-- Top Brand Bar -->
        <header class="top-brand-bar">
            <div class="parent-company-brand">
                <img src="${nrLogoBase64}" alt="NR Waste Management Private Limited" class="nr-logo-img">
                <div class="parent-title-group">
                    <h3>NR WASTE MANAGEMENT</h3>
                    <p>Private Limited</p>
                </div>
            </div>

            <div class="brand-divider"></div>

            <div class="retail-brand">
                <img src="${fonzkartLogoBase64}" alt="FonzKart" class="fonzkart-logo-img">
            </div>
        </header>

        <!-- Main Hero Title -->
        <section class="hero-section">
            <div class="hiring-badge">★ We Are Hiring ★</div>
            <h1 class="role-title">Field Executive / <span>Evaluation Specialist</span></h1>
            <p class="role-subtitle">Conduct Doorstep Smartphone Testing, Instant Price Quotes &amp; Spot Payouts</p>
        </section>

        <!-- Key Metrics Strip -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Role Type</div>
                <div class="metric-value">Full-Time | Field</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Location</div>
                <div class="metric-value">Bangalore Routes</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Experience</div>
                <div class="metric-value">0 – 2 Yrs (Freshers OK)</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Monthly Earning</div>
                <div class="metric-value">Fixed + Daily Fuel + Incentive</div>
            </div>
        </div>

        <!-- Mandatory Requirement Highlight Strip -->
        <div class="mandatory-strip">
            <div class="mandatory-icon">🛵</div>
            <div class="mandatory-text">
                <h4>Mandatory Requirements: Personal Two-Wheeler &amp; Valid Driving License</h4>
                <p>Must possess your own bike/scooter with a valid DL and an Android/iOS smartphone with mobile data connection.</p>
            </div>
        </div>

        <!-- 2-Column Details Grid -->
        <div class="info-grid">
            <!-- Left: Key Responsibilities -->
            <div class="info-card">
                <span class="card-header-badge">Key Responsibilities</span>
                <h3>What You Will Do</h3>
                <ul class="points-list">
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Doorstep Visits:</strong> Visit customer locations across Bangalore according to pickup slots assigned on the FonzKart Rider App.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Diagnostic Checks:</strong> Test smartphone screens, camera lenses, battery health, mic/speakers, ports, and verify IMEI.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Spot Quote Valuation:</strong> Assess physical body condition (scratches/dents) against standard grading parameters.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Instant Digital Payout:</strong> Guide customers through instant spot payment (UPI/IMPS) and generate digital pickup receipts.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Safe Device Transit:</strong> Securely package, barcode-tag, and transport collected devices to the central hub every evening.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Customer Delight:</strong> Provide a transparent, polite, and trustworthy doorstep experience.</span>
                    </li>
                </ul>
            </div>

            <!-- Right: Requirements & Skills -->
            <div class="info-card">
                <span class="card-header-badge">Candidate Profile</span>
                <h3>What We Are Looking For</h3>
                <ul class="points-list">
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Education:</strong> 10+2 (High School) or Any Graduate. Enthusiastic freshers with interest in tech/gadgets welcome!</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Vehicle &amp; License:</strong> Own Two-Wheeler (Bike/Scooter) with active Driving License is mandatory.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Smartphone:</strong> Android or iPhone with active 4G/5G mobile data for route navigation and device diagnostics.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Gadget Curiosity:</strong> Basic familiarity with mobile brands (iPhone, Samsung, OnePlus, Xiaomi) and settings.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Languages:</strong> Conversational communication in Kannada, English, or Hindi.</span>
                    </li>
                    <li>
                        <span class="check-icon">${checkIconSvg}</span>
                        <span><strong>Punctuality &amp; Integrity:</strong> Disciplined route adherence, honesty, and professional customer attitude.</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- High Earnings Callout -->
        <div class="special-callout">
            <div class="callout-text">
                <h4>Fixed Base Salary + Daily Fuel Allowance + High Per-Pickup Commission</h4>
                <p>Earn high weekly incentives on every completed pickup! Fast-track promotions to Hub Lead &amp; City Supervisor.</p>
            </div>
            <div class="callout-badge">Immediate Joining</div>
        </div>

        <!-- Bottom Contact & Application Footer -->
        <footer class="footer-cta-container">
            <div class="contact-details">
                <div class="contact-row-primary">
                    <span class="whatsapp-icon-wrapper">${whatsappIconSvg}</span>
                    <span class="primary-phone-number">+91 90603 36060</span>
                    <span class="whatsapp-tag">WhatsApp &amp; Call</span>
                </div>

                <div class="contact-grid-secondary">
                    <div class="secondary-item">
                        <span style="color: #059669;">${mailIconSvg}</span>
                        <span>careers@fonzkart.in</span>
                    </div>
                    <div class="secondary-item">
                        <span style="color: #059669;">${phoneIconSvg}</span>
                        <span>Recruitment Desk Helpline</span>
                    </div>
                    <div class="address-item">
                        <span style="color: #059669; margin-top: 1px;">${mapPinIconSvg}</span>
                        <span><strong>Central Hub:</strong> #69 8th cross Hegde Nagar, SRK Nagar Post, Bangalore - 560077</span>
                    </div>
                </div>
            </div>

            <!-- QR Code Box -->
            <div class="qr-card">
                <div class="qr-card-title">
                    <span style="color: #25d366;">${whatsappIconSvg}</span>
                    <span>Scan to Apply</span>
                </div>
                <img src="${fieldExecQrBase64}" alt="Scan QR code to apply on WhatsApp" class="qr-img">
                <div class="qr-subtext">Direct HR WhatsApp</div>
            </div>
        </footer>
    </div>
</body>
</html>`;

    // Write HTML files
    const accountantHtmlPath = path.join(htmlDir, 'poster_accountant_hiring.html');
    const fieldExecHtmlPath = path.join(htmlDir, 'poster_field_executive_hiring.html');

    fs.writeFileSync(accountantHtmlPath, accountantHtml, 'utf8');
    fs.writeFileSync(fieldExecHtmlPath, fieldExecHtml, 'utf8');
    console.log('Written HTML posters to:', htmlDir);

    // Launch Puppeteer to render High-Res PNG and PDF
    console.log('Launching Puppeteer for 300 DPI PNG and PDF export...');
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 1697,
        deviceScaleFactor: 2.5 // ~300 DPI high resolution
    });

    const posters = [
        {
            name: 'poster_accountant_hiring',
            htmlPath: accountantHtmlPath,
            title: 'Accountant'
        },
        {
            name: 'poster_field_executive_hiring',
            htmlPath: fieldExecHtmlPath,
            title: 'Field Executive'
        }
    ];

    for (const p of posters) {
        console.log(`Rendering ${p.title} poster...`);
        await page.goto(`file://${p.htmlPath}`, { waitUntil: 'networkidle0' });

        // 300 DPI Print PNG
        const pngPath = path.join(postersDir, `${p.name}_300dpi.png`);
        await page.screenshot({
            path: pngPath,
            fullPage: true,
            type: 'png'
        });
        console.log(`Generated: ${pngPath}`);

        // Web Preview PNG (scaled down)
        const previewPage = await browser.newPage();
        await previewPage.setViewport({
            width: 1200,
            height: 1697,
            deviceScaleFactor: 1.0
        });
        await previewPage.goto(`file://${p.htmlPath}`, { waitUntil: 'networkidle0' });
        const previewPath = path.join(postersDir, `${p.name}_preview.png`);
        await previewPage.screenshot({
            path: previewPath,
            fullPage: true,
            type: 'png'
        });
        await previewPage.close();
        console.log(`Generated: ${previewPath}`);

        // Print-Ready PDF (A4 format)
        const pdfPath = path.join(postersDir, `${p.name}.pdf`);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        console.log(`Generated: ${pdfPath}`);
    }

    await browser.close();
    console.log('All hiring posters generated successfully!');
}

generatePosters().catch((err) => {
    console.error('Error generating posters:', err);
    process.exit(1);
});
