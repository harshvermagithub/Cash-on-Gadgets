'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Convert image to base64 Data URI
function getBase64Image(relativePath) {
    const fullPath = path.join(__dirname, '..', relativePath);
    if (!fs.existsSync(fullPath)) return '';
    const ext = path.extname(fullPath).toLowerCase().replace('.', '');
    const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    return `data:${mime};base64,${fs.readFileSync(fullPath).toString('base64')}`;
}

const nrLogoB64 = getBase64Image('public/logos/nr/nr_logo_letterhead.png') || getBase64Image('public/logos/nr/nr_logo_white_bg.jpg');
const fonzkartLogoB64 = getBase64Image('public/fonzkart_cart_brand_logo_transparent.png');

const today = new Date();
const dateStr = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
const year = today.getFullYear();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Employment Agreement & Letter of Appointment – Hiten Verma | NR Waste Management Pvt. Ltd.</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&display=swap" rel="stylesheet">
<style>
  /* ── GLOBAL RESET & PRINT SETUP ── */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  body {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #e2e8f0;
    color: #1e293b;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── 4-PAGE SYSTEM WITH GENEROUS BREATHING ROOM ── */
  .page {
    width: 210mm;
    height: 297mm;
    margin: 0 auto 30px auto;
    background: #ffffff;
    box-sizing: border-box;
    padding: 15mm 22mm 15mm 22mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  }

  @media print {
    body {
      background: #ffffff;
    }
    .page {
      margin: 0;
      box-shadow: none;
      height: 297mm;
      max-height: 297mm;
      page-break-after: always;
    }
  }

  .page:last-child {
    page-break-after: auto;
  }

  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* ── ELEGANT CORPORATE LETTERHEAD (PAGE 1) ── */
  .masthead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 2px solid #0f172a;
    position: relative;
    margin-bottom: 14px;
  }

  .masthead::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 1.5px;
    background: #16a34a;
  }

  .masthead-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .masthead-crest {
    width: 60px;
    height: 60px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .masthead-company-info {
    display: flex;
    flex-direction: column;
  }

  .company-legal-title {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: 0.5px;
    line-height: 1.25;
    text-transform: uppercase;
  }

  .company-brand-subtitle {
    font-size: 10.5px;
    font-weight: 700;
    color: #16a34a;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 3px;
  }

  .company-statutory-info {
    font-size: 9px;
    font-weight: 500;
    color: #64748b;
    line-height: 1.5;
    margin-top: 3px;
  }

  .company-statutory-info span {
    color: #1e293b;
    font-weight: 600;
  }

  .masthead-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
  }

  .brand-logo-img {
    height: 38px;
    max-width: 175px;
    object-fit: contain;
  }

  .masthead-tagline {
    font-size: 8.5px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }

  /* ── SUBSEQUENT PAGE RUNNING HEADER (PAGES 2, 3, 4) ── */
  .running-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 9px;
    border-bottom: 1.5px solid #e2e8f0;
    font-size: 9px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .running-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #0f172a;
  }

  .running-header-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #16a34a;
    display: inline-block;
  }

  .running-header-right {
    color: #94a3b8;
  }

  /* ── RUNNING FOOTER (ALL PAGES) ── */
  .running-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 9px;
    border-top: 1px solid #e2e8f0;
    font-size: 9px;
    font-weight: 500;
    color: #64748b;
    margin-top: auto;
  }

  .footer-col-left {
    line-height: 1.5;
  }

  .footer-col-left strong {
    color: #334155;
    font-weight: 700;
  }

  .footer-col-center {
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.8px;
  }

  .footer-col-right {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #475569;
  }

  .initial-box {
    display: inline-block;
    width: 75px;
    border-bottom: 1.2px dashed #94a3b8;
    height: 14px;
  }

  /* ── DOCUMENT TITLE & METADATA ── */
  .doc-title-container {
    text-align: center;
    margin: 6px 0 14px 0;
  }

  .doc-title {
    font-size: 15.5px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    display: inline-block;
    padding-bottom: 4px;
    border-bottom: 2px solid #16a34a;
  }

  .doc-subtitle-note {
    font-size: 9px;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .meta-table-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 16px;
    margin-bottom: 14px;
  }

  .meta-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .meta-row-item {
    font-size: 10.2px;
    line-height: 1.45;
    color: #475569;
  }

  .meta-row-item strong {
    color: #0f172a;
    font-weight: 700;
    display: inline-block;
    min-width: 118px;
  }

  /* ── FORMAL CLAUSES & TEXT TYPOGRAPHY (BUMPED +7-8%) ── */
  .salutation-line {
    font-size: 11.8px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }

  .recital-para {
    font-size: 10.7px;
    line-height: 1.72;
    color: #334155;
    text-align: justify;
    margin-bottom: 12px;
  }

  .recital-para strong {
    color: #0f172a;
    font-weight: 700;
  }

  .section-clause {
    margin-bottom: 16px;
  }

  .clause-head {
    font-size: 11.8px;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .clause-num {
    color: #16a34a;
    font-weight: 800;
  }

  .clause-text {
    font-size: 10.5px;
    line-height: 1.7;
    color: #334155;
    text-align: justify;
    margin-bottom: 7px;
  }

  .clause-text strong {
    color: #0f172a;
    font-weight: 700;
  }

  .subclause-list {
    list-style: none;
    margin-left: 14px;
    margin-bottom: 10px;
  }

  .subclause-list li {
    font-size: 10.5px;
    line-height: 1.68;
    color: #334155;
    margin-bottom: 5px;
    text-align: justify;
    position: relative;
    padding-left: 16px;
  }

  .subclause-list li::before {
    content: '•';
    position: absolute;
    left: 2px;
    top: 0;
    color: #16a34a;
    font-weight: bold;
    font-size: 12px;
  }

  /* ── PERFORMANCE MERIT CALLOUT BOX ── */
  .merit-callout-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-left: 4px solid #16a34a;
    border-radius: 4px;
    padding: 10px 14px;
    margin: 10px 0 14px 0;
  }

  .merit-callout-title {
    font-size: 10.2px;
    font-weight: 800;
    color: #15803d;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 4px;
  }

  .merit-callout-text {
    font-size: 10.3px;
    line-height: 1.68;
    color: #14532d;
    text-align: justify;
  }

  /* ── COMPENSATION HIGHLIGHT CALLOUT CARD ── */
  .salary-highlight-card {
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-left: 4.5px solid #16a34a;
    border-radius: 6px;
    padding: 14px 18px;
    margin: 12px 0 16px 0;
  }

  .salary-card-head {
    font-size: 10.2px;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    margin-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 5px;
  }

  .salary-card-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .salary-card-col {
    display: flex;
    flex-direction: column;
  }

  .salary-card-label {
    font-size: 9px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }

  .salary-card-amount {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
  }

  .salary-card-amount span {
    color: #16a34a;
    font-size: 11.5px;
    font-weight: 700;
  }

  .salary-card-badge {
    background: #e2e8f0;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 700;
    color: #334155;
    text-align: center;
  }

  /* ── FORMAL CONTRACT TABLE (ANNEXURE A) ── */
  .contract-table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 16px 0;
    font-size: 10.2px;
  }

  .contract-table thead th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 9px 12px;
    text-align: left;
    border: 1px solid #0f172a;
  }

  .contract-table tbody td {
    padding: 9px 12px;
    border: 1px solid #cbd5e1;
    color: #334155;
    vertical-align: middle;
  }

  .contract-table tbody tr:nth-child(even) {
    background: #f8fafc;
  }

  .contract-table tfoot td {
    background: #f0fdf4;
    border: 1.5px solid #16a34a;
    font-weight: 800;
    color: #15803d;
    padding: 10px 12px;
  }

  .annexure-notes-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 16px;
    margin-top: 12px;
  }

  .annexure-notes-title {
    font-size: 9.8px;
    font-weight: 700;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
  }

  .annexure-notes-text {
    font-size: 9.5px;
    line-height: 1.65;
    color: #475569;
  }

  /* ── SIGNATURE CARDS (PAGE 4) ── */
  .execution-section {
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1.5px solid #0f172a;
  }

  .execution-preamble {
    font-size: 10.2px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 14px;
    text-align: justify;
    line-height: 1.6;
  }

  .signatures-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 10px;
    margin-bottom: 22px;
  }

  .sig-card {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 16px 18px;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 155px;
  }

  .sig-card-header {
    font-size: 10.2px;
    font-weight: 700;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-bottom: 12px;
  }

  .sig-line-area {
    height: 50px;
    border-bottom: 1.2px dashed #64748b;
    margin-bottom: 8px;
    display: flex;
    align-items: flex-end;
  }

  .stamp-watermark {
    font-size: 8.5px;
    color: #94a3b8;
    font-style: italic;
  }

  .sig-entity-name {
    font-size: 11.2px;
    font-weight: 800;
    color: #0f172a;
  }

  .sig-entity-title {
    font-size: 9.6px;
    font-weight: 600;
    color: #64748b;
    margin-top: 2px;
  }

  .sig-meta-dates {
    font-size: 9px;
    color: #64748b;
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
  }

  .candidate-acceptance-statement {
    font-size: 9.5px;
    color: #475569;
    line-height: 1.5;
    font-style: italic;
    margin-bottom: 8px;
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════════════════════════════
     PAGE 1: APPOINTMENT, INTERNSHIP EARLY CONVERSION, COMMENCEMENT & POSTING
══════════════════════════════════════════════════════════════════════════════ -->
<div class="page" id="page-1">
  <div class="content-area">

    <!-- Official Corporate Letterhead -->
    <header class="masthead">
      <div class="masthead-left">
        ${nrLogoB64 ? `<img src="${nrLogoB64}" alt="NR Corporate Crest" class="masthead-crest">` : ''}
        <div class="masthead-company-info">
          <h1 class="company-legal-title">NR WASTE MANAGEMENT PRIVATE LIMITED</h1>
          <div class="company-brand-subtitle">Consumer Electronics Division · Operating Brand: FonzKart</div>
          <div class="company-statutory-info">
            <strong>CIN:</strong> U01403KA2024PTC186685 &nbsp;|&nbsp; <strong>GSTIN:</strong> 29AAICN1458Q1ZQ<br>
            <strong>Registered Office:</strong> #69, 8th Cross, Hegde Nagar, SRK Nagar Post, Bengaluru, Karnataka – 560077, India<br>
            <strong>Corporate Desk:</strong> hr@fonzkart.in &nbsp;|&nbsp; +91 90603 36060 &nbsp;|&nbsp; www.fonzkart.in
          </div>
        </div>
      </div>
      <div class="masthead-right">
        ${fonzkartLogoB64 ? `<img src="${fonzkartLogoB64}" alt="FonzKart Official Brand" class="brand-logo-img">` : ''}
        <span class="masthead-tagline">Re-Commerce · Technology · Logistics</span>
      </div>
    </header>

    <!-- Document Title -->
    <div class="doc-title-container">
      <div class="doc-title">Employment Agreement &amp; Letter of Appointment</div>
      <div class="doc-subtitle-note">Strictly Private &amp; Confidential &nbsp;·&nbsp; Software Engineering Division</div>
    </div>

    <!-- Metadata Grid -->
    <div class="meta-table-box">
      <div class="meta-col">
        <div class="meta-row-item"><strong>Document Ref No:</strong> NRWM/HR-EMP/${year}/SDE-1048</div>
        <div class="meta-row-item"><strong>Date of Issuance:</strong> ${dateStr}</div>
        <div class="meta-row-item"><strong>Employing Entity:</strong> NR Waste Management Private Limited</div>
        <div class="meta-row-item"><strong>Operating Brand:</strong> FonzKart (www.fonzkart.in)</div>
      </div>
      <div class="meta-col">
        <div class="meta-row-item"><strong>Candidate Name:</strong> Mr. Hiten Verma</div>
        <div class="meta-row-item"><strong>Designation:</strong> Software Development Engineer (SDE)</div>
        <div class="meta-row-item"><strong>Department:</strong> Engineering &amp; Platform Architecture</div>
        <div class="meta-row-item"><strong>Base Location:</strong> Bengaluru, Karnataka (Hybrid Work Model)</div>
      </div>
    </div>

    <div class="salutation-line">Dear Mr. Hiten Verma,</div>

    <p class="recital-para">
      With reference to your ongoing contributions, software engineering deliverables, and high-velocity sprint execution,
      the Board of Directors and Executive Management of <strong>NR Waste Management Private Limited</strong>
      (hereinafter referred to as the <strong>"Company"</strong> or <strong>"FonzKart"</strong>) are pleased to
      extend this formal <strong>Employment Agreement and Letter of Appointment</strong> for the full-time regular position of
      <strong>Software Development Engineer (SDE)</strong>.
    </p>

    <!-- Early Conversion Merit Box -->
    <div class="merit-callout-box">
      <div class="merit-callout-title">Notice of Early Role Conversion · Performance Merit Award</div>
      <div class="merit-callout-text">
        You were initially extended an appointment as a <strong>Software Development Engineer Intern (SDE Intern)</strong> on
        <strong>27th December 2025</strong>, which was originally instituted as an unpaid internship slated to extend for a duration
        of up to <strong>12 (twelve) months</strong>. In recognition of your outstanding engineering performance, dedication, sprint velocity,
        and high-quality architectural deliverables demonstrated well ahead of schedule, the Management is delighted to reward your merit
        by formally converting your engagement into this paid, full-time regular employment role ahead of the contemplated 12-month tenure.
      </div>
    </div>

    <!-- Clause 1 -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">1.0</span> Appointment, Designation &amp; Early Role Conversion</div>
      <p class="clause-text">
        (a) <strong>Role &amp; Reporting Structure:</strong> You are appointed to the full-time regular position of <strong>Software Development Engineer (SDE)</strong>
        within the Engineering &amp; Platform Architecture Department. In this capacity, you shall report directly to the Lead Systems Architect / Head of Engineering
        or such other designated technical authority as may be assigned by the Company.
      </p>
      <p class="clause-text">
        (b) <strong>Supersession of Previous Internship Agreement:</strong> This Agreement formally supersedes, discharges, and replaces all prior
        internship agreements, memorandums of understanding, or communications concerning your unpaid SDE Internship initiated on 27th December 2025.
        Effective as of your transition date hereunder, your engagement is elevated to a full-time, regular corporate employment relationship.
      </p>
    </div>

    <!-- Clause 2 -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">2.0</span> Commencement Date and Term</div>
      <p class="clause-text">
        Your full-time paid employment under this Agreement shall take effect from your official Date of Joining / Transition,
        mutually confirmed as <strong>[To Be Confirmed / Scheduled Date]</strong>. This Agreement shall continue in full force
        and effect until terminated in accordance with the provisions herein.
      </p>
    </div>

    <!-- Clause 3 -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">3.0</span> Place of Posting and Hybrid Working Framework</div>
      <p class="clause-text">
        Your base location of employment shall be <strong>Bengaluru, Karnataka</strong>. The Company operates a performance-driven hybrid engineering
        model combining remote sprint execution with scheduled in-person collaborative sessions at the Company’s Bengaluru corporate office.
        The Company reserves the operational right to depute or transfer you to any associated office or facility within India as business needs require.
      </p>
    </div>

  </div>

  <!-- Running Footer -->
  <footer class="running-footer">
    <div class="footer-col-left">
      <strong>NR Waste Management Private Limited</strong> &nbsp;|&nbsp; Regd. Off: Bengaluru – 560077, KA<br>
      Strictly Private &amp; Confidential &nbsp;|&nbsp; Ref: NRWM/HR-EMP/${year}/SDE-1048
    </div>
    <div class="footer-col-center">Page 1 of 4</div>
    <div class="footer-col-right">
      <span>Candidate Initials:</span>
      <div class="initial-box"></div>
    </div>
  </footer>
</div>

<!-- ══════════════════════════════════════════════════════════════════════════════
     PAGE 2: REMUNERATION (FIXED BASIC), 45-DAY PROBATION, WORKING HOURS & LEAVE
══════════════════════════════════════════════════════════════════════════════ -->
<div class="page" id="page-2">
  <div class="content-area">

    <!-- Running Header -->
    <div class="running-header">
      <div class="running-header-left">
        <span class="running-header-dot"></span>
        <span>NR Waste Management Private Limited (FonzKart) · Employment Agreement</span>
      </div>
      <div class="running-header-right">Ref: NRWM/HR-EMP/${year}/SDE-1048 &nbsp;|&nbsp; Private &amp; Confidential</div>
    </div>

    <!-- Clause 4: Remuneration -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">4.0</span> Remuneration and All-Inclusive Compensation Structure</div>
      <p class="clause-text">
        (a) <strong>Consolidated Basic Remuneration:</strong> The Company shall provide you with a fixed gross basic
        salary of <strong>₹50,000 to ₹55,000 per month</strong> (Rupees Fifty Thousand to Fifty-Five Thousand only),
        representing an annualized total gross remuneration of <strong>₹6,00,000 to ₹6,60,000 per annum</strong>
        (Rupees Six Lakh to Six Lakh Sixty Thousand only). The exact starting basic within this band shall be finalized
        upon formal onboarding.
      </p>

      <!-- Salary Card -->
      <div class="salary-highlight-card">
        <div class="salary-card-head">Executive Remuneration Summary · All-Inclusive Basic Salary</div>
        <div class="salary-card-grid">
          <div class="salary-card-col">
            <span class="salary-card-label">Monthly Gross Basic Pay</span>
            <div class="salary-card-amount">₹50,000 – ₹55,000 <span>/ month</span></div>
          </div>
          <div class="salary-card-col">
            <span class="salary-card-label">Annualized Fixed CTC</span>
            <div class="salary-card-amount">₹6,00,000 – ₹6,60,000 <span>/ annum</span></div>
          </div>
          <div class="salary-card-badge">
            100% Fixed Basic Pay<br>No Variable Deductions
          </div>
        </div>
      </div>

      <p class="clause-text">
        (b) <strong>Consolidation into Basic Salary:</strong> In alignment with Company compensation policy and mutual agreement,
        your remuneration is established strictly on a consolidated basic salary basis. All statutory components, customary allowances,
        and benefits are subsumed entirely within the basic salary. No separate heads for special allowances, house rent allowances (HRA),
        performance bonuses, or variable incentives are applicable under this contract.
      </p>
      <p class="clause-text">
        (c) <strong>Statutory Deductions &amp; Payroll Schedule:</strong> All disbursements shall be subject to applicable statutory deductions,
        including Tax Deducted at Source (TDS) under the Income Tax Act, 1961, and Professional Tax under Karnataka State regulations. Net remuneration
        will be directly remitted via electronic bank transfer on or before the final calendar day of each operating month.
      </p>
    </div>

    <!-- Clause 5: Probation -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">5.0</span> Probationary Period and Formal Confirmation</div>
      <p class="clause-text">
        (a) <strong>Probationary Term:</strong> You shall serve a probationary period of <strong>45 (Forty-Five) Days</strong> commencing
        from your effective Date of Joining. The purpose of this period is to provide both you and the Company an opportunity to assess mutual
        suitability, technical alignment, and performance standards.
      </p>
      <p class="clause-text">
        (b) <strong>Performance Assessment:</strong> During the 45-day probationary period, your engineering output, code test coverage,
        sprint velocity, problem-solving aptitude, communication, and adherence to company architectural standards will be evaluated.
      </p>
      <p class="clause-text">
        (c) <strong>Notice Period During Probation:</strong> During this 45-day probationary period, either party may terminate the employment
        relationship by serving <strong>7 (seven) calendar days' prior written notice</strong> or gross basic salary in lieu thereof,
        without assigning any cause.
      </p>
      <p class="clause-text">
        (d) <strong>Confirmation of Services:</strong> Upon satisfactory completion of the 45-day probationary term, the Company shall issue
        a formal written Confirmation Letter. Unless and until confirmed in writing by authorized executive management, you shall continue to be
        deemed on probationary status.
      </p>
    </div>

    <!-- Clause 6: Hours & Leave -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">6.0</span> Working Hours, Operating Schedule and Leave Policy</div>
      <p class="clause-text">
        (a) <strong>Operational Schedule:</strong> The standard work schedule comprises a 5-day working week (Monday through Friday),
        with standard business hours between 9:30 AM to 6:30 PM. Given the dynamic nature of software engineering, you may be called upon
        to participate in scheduled release windows or resolve critical production incidents outside normal hours.
      </p>
      <p class="clause-text">
        (b) <strong>Leave Entitlements:</strong> Upon confirmation, you shall be entitled to paid annual leaves, casual leaves, and national
        holidays in accordance with the Company’s official HR Leave Policy. All leaves must be planned in advance with sprint leads to prevent
        project bottlenecks.
      </p>
    </div>

  </div>

  <!-- Running Footer -->
  <footer class="running-footer">
    <div class="footer-col-left">
      <strong>NR Waste Management Private Limited</strong> &nbsp;|&nbsp; Regd. Off: Bengaluru – 560077, KA<br>
      Strictly Private &amp; Confidential &nbsp;|&nbsp; Ref: NRWM/HR-EMP/${year}/SDE-1048
    </div>
    <div class="footer-col-center">Page 2 of 4</div>
    <div class="footer-col-right">
      <span>Candidate Initials:</span>
      <div class="initial-box"></div>
    </div>
  </footer>
</div>

<!-- ══════════════════════════════════════════════════════════════════════════════
     PAGE 3: SCOPE OF DUTIES, CONFIDENTIALITY & IP ASSIGNMENT
══════════════════════════════════════════════════════════════════════════════ -->
<div class="page" id="page-3">
  <div class="content-area">

    <!-- Running Header -->
    <div class="running-header">
      <div class="running-header-left">
        <span class="running-header-dot"></span>
        <span>NR Waste Management Private Limited (FonzKart) · Employment Agreement</span>
      </div>
      <div class="running-header-right">Ref: NRWM/HR-EMP/${year}/SDE-1048 &nbsp;|&nbsp; Private &amp; Confidential</div>
    </div>

    <!-- Clause 7: Duties -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">7.0</span> Scope of Engineering Duties and Performance Standards</div>
      <p class="clause-text">
        As a Software Development Engineer, your mandate encompasses the architectural design, implementation, testing, maintenance,
        and deployment of scalable software applications, internal operational tooling, customer portals, automated device valuation algorithms,
        order processing pipelines, and partner APIs powering FonzKart's re-commerce ecosystem.
      </p>
      <ul class="subclause-list">
        <li>Architect, write, review, and maintain modular, clean, and testable code across full-stack applications.</li>
        <li>Participate actively in sprint planning, agile standups, system architectural designs, and automated testing cycles.</li>
        <li>Integrate secure third-party APIs, including payment gateways, SMS/WhatsApp communications, and logistics partner webhooks.</li>
        <li>Diagnose complex software bottlenecks and database performance queries to maintain 99.9% platform reliability.</li>
        <li>Implement defensive programming, rigorous input sanitization, and industry-standard security protocols across all endpoints.</li>
      </ul>
    </div>

    <!-- Clause 8: Confidentiality -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">8.0</span> Confidentiality and Protection of Proprietary Data</div>
      <p class="clause-text">
        (a) <strong>Proprietary Information Defined:</strong> You acknowledge that in the course of your duties, you will acquire
        confidential and trade secret information of the Company, including source code repositories, architecture diagrams, device
        pricing engines, database records, customer data, vendor contracts, and commercial strategies.
      </p>
      <p class="clause-text">
        (b) <strong>Perpetual Secrecy:</strong> You shall hold such Proprietary Information in strict confidence and shall not, directly
        or indirectly, copy, export, publish, or disclose any part thereof without prior written executive authorization. These obligations
        are perpetual and shall indefinitely survive the termination or cessation of your employment with the Company.
      </p>
    </div>

    <!-- Clause 9: IP Assignment -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">9.0</span> Assignment of Intellectual Property (Works Made for Hire)</div>
      <p class="clause-text">
        All software code, scripts, technical designs, user interfaces, database structures, inventions, improvements, and documentation
        authored or conceived by you (solely or jointly) in connection with your employment shall constitute "Works Made for Hire".
        You hereby irrevocably assign and transfer to <strong>NR Waste Management Private Limited</strong> all worldwide intellectual property
        rights, copyrights, patents, and trade secrets in such works, without any entitlement to additional royalties.
      </p>
      <p class="clause-text">
        You unconditionally waive any moral rights under Section 57 of the Copyright Act, 1957, or corresponding legislation in any jurisdiction.
      </p>
    </div>

    <!-- Clause 10: Non-Solicitation -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">10.0</span> Restrictive Covenants (Non-Solicitation)</div>
      <p class="clause-text">
        During your employment and for a period of <strong>12 (twelve) months</strong> immediately following the cessation of your employment
        for any reason, you shall not, directly or indirectly, solicit, induce, recruit, or endeavor to entice away any employee, consultant,
        or business partner from the Company.
      </p>
    </div>

  </div>

  <!-- Running Footer -->
  <footer class="running-footer">
    <div class="footer-col-left">
      <strong>NR Waste Management Private Limited</strong> &nbsp;|&nbsp; Regd. Off: Bengaluru – 560077, KA<br>
      Strictly Private &amp; Confidential &nbsp;|&nbsp; Ref: NRWM/HR-EMP/${year}/SDE-1048
    </div>
    <div class="footer-col-center">Page 3 of 4</div>
    <div class="footer-col-right">
      <span>Candidate Initials:</span>
      <div class="initial-box"></div>
    </div>
  </footer>
</div>

<!-- ══════════════════════════════════════════════════════════════════════════════
     PAGE 4: SEPARATION, SIGNATURES & ANNEXURE A (COMPENSATION SCHEDULE)
══════════════════════════════════════════════════════════════════════════════ -->
<div class="page" id="page-4">
  <div class="content-area">

    <!-- Running Header -->
    <div class="running-header">
      <div class="running-header-left">
        <span class="running-header-dot"></span>
        <span>NR Waste Management Private Limited (FonzKart) · Employment Agreement</span>
      </div>
      <div class="running-header-right">Ref: NRWM/HR-EMP/${year}/SDE-1048 &nbsp;|&nbsp; Private &amp; Confidential</div>
    </div>

    <!-- Clause 11: Separation & Notice Period -->
    <div class="section-clause">
      <div class="clause-head"><span class="clause-num">11.0</span> Separation, Notice Period Post-Confirmation &amp; Governing Law</div>
      <p class="clause-text">
        (a) <strong>Notice Period:</strong> Following the successful completion and confirmation of your 45-day probation, either party
        may terminate this employment agreement by serving <strong>30 (thirty) calendar days' prior written notice</strong> or gross basic
        salary in lieu thereof.
      </p>
      <p class="clause-text">
        (b) <strong>Immediate Termination for Cause:</strong> The Company reserves the right to terminate your employment summarily without notice
        or compensation in lieu thereof in the event of gross misconduct, fraud, dishonesty, or material breach of confidentiality or IP provisions.
      </p>
      <p class="clause-text">
        (c) <strong>Governing Law &amp; Jurisdiction:</strong> This Agreement shall be governed by and construed in accordance with the substantive
        laws of India. The courts of competent jurisdiction located at <strong>Bengaluru, Karnataka</strong> shall possess exclusive
        jurisdiction over any disputes or claims arising hereunder.
      </p>
    </div>

    <!-- Section 12: Execution & Acceptance Signatures -->
    <div class="execution-section">
      <div class="clause-head" style="margin-bottom: 6px;"><span class="clause-num">12.0</span> Acceptance, Execution and Counterparts</div>
      <p class="execution-preamble">
        IN WITNESS WHEREOF, the Company and the Candidate have duly executed this Employment Agreement and Appointment Letter
        in two original counterparts, each of which shall be deemed an original, as of the date indicated below.
      </p>

      <div class="signatures-grid">
        <!-- Company Signatory -->
        <div class="sig-card">
          <div>
            <div class="sig-card-header">For &amp; on Behalf of Company</div>
            <div class="stamp-watermark">Authorized Corporate Seal &amp; Signature:</div>
            <div class="sig-line-area"></div>
            <div class="sig-entity-name">NR Waste Management Private Limited</div>
            <div class="sig-entity-title">Authorized Signatory / Executive Director</div>
          </div>
          <div class="sig-meta-dates">
            <span>Date: ${dateStr}</span>
            <span>Place: Bengaluru</span>
          </div>
        </div>

        <!-- Candidate Acceptance -->
        <div class="sig-card">
          <div>
            <div class="sig-card-header">Candidate Acceptance &amp; Acknowledgment</div>
            <p class="candidate-acceptance-statement">
              "I have carefully read, fully understood, and hereby unconditionally accept the terms, obligations, and covenants set forth in this Agreement and Annexure A."
            </p>
            <div class="sig-line-area"></div>
            <div class="sig-entity-name">Hiten Verma</div>
            <div class="sig-entity-title">Software Development Engineer (Candidate)</div>
          </div>
          <div class="sig-meta-dates">
            <span>Date: ____________________</span>
            <span>Place: ____________________</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Annexure A: Compensation Table -->
    <div class="section-clause" style="margin-top: 10px;">
      <div class="clause-head"><span class="clause-num">ANNEXURE A</span> Comprehensive Compensation Structure &amp; Terms</div>
      <table class="contract-table">
        <thead>
          <tr>
            <th style="width: 34%;">Compensation Head</th>
            <th style="width: 22%;">Monthly Gross (INR)</th>
            <th style="width: 22%;">Annualized CTC (INR)</th>
            <th style="width: 22%;">Regulatory &amp; Policy Terms</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Consolidated Gross Basic Salary</strong></td>
            <td><strong>₹50,000 – ₹55,000</strong></td>
            <td><strong>₹6,00,000 – ₹6,60,000</strong></td>
            <td>Fixed all-inclusive monthly basic salary.</td>
          </tr>
          <tr>
            <td>House Rent Allowance (HRA) &amp; Allowances</td>
            <td>Included in Basic</td>
            <td>Included in Basic</td>
            <td>Subsumed entirely within basic pay.</td>
          </tr>
          <tr>
            <td>Performance Bonus &amp; Variable Incentives</td>
            <td>Not Applicable (Nil)</td>
            <td>Not Applicable (Nil)</td>
            <td>100% fixed monthly basic compensation.</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Total Cost to Company (Fixed CTC)</strong></td>
            <td><strong>₹50,000 – ₹55,000</strong></td>
            <td><strong>₹6,00,000 – ₹6,60,000</strong></td>
            <td><strong>All-Inclusive Fixed Structure</strong></td>
          </tr>
        </tfoot>
      </table>

      <div class="annexure-notes-box">
        <div class="annexure-notes-title">Explanatory Statutory &amp; Payroll Notes</div>
        <div class="annexure-notes-text">
          1. <strong>All-Inclusive Structure:</strong> The compensation detailed above represents an all-inclusive fixed basic remuneration model. No separate heads for special allowances or performance bonuses are applicable.<br>
          2. <strong>Statutory Withholdings:</strong> Monthly remuneration is subject to applicable statutory withholdings including Tax Deducted at Source (TDS) under the Income Tax Act, 1961, and Karnataka Professional Tax.<br>
          3. <strong>Disbursement:</strong> Salary is remitted electronically to the Employee’s designated Indian bank account on or before the final calendar day of each operating month.
        </div>
      </div>
    </div>

  </div>

  <!-- Running Footer -->
  <footer class="running-footer">
    <div class="footer-col-left">
      <strong>NR Waste Management Private Limited</strong> &nbsp;|&nbsp; Regd. Off: Bengaluru – 560077, KA<br>
      Strictly Private &amp; Confidential &nbsp;|&nbsp; Ref: NRWM/HR-EMP/${year}/SDE-1048
    </div>
    <div class="footer-col-center">Page 4 of 4</div>
    <div class="footer-col-right">
      <span>Candidate Initials:</span>
      <div class="initial-box"></div>
    </div>
  </footer>
</div>

</body>
</html>`;

// ── File Output Paths ──
const pubDir = path.join(__dirname, '..', 'public');
const htmlPath = path.join(pubDir, 'offer_letter_hiten_verma_sde.html');
const pdfPath = path.join(pubDir, 'offer_letter_hiten_verma_sde.pdf');
const previewPngPath = path.join(pubDir, 'offer_letter_hiten_verma_sde_preview.png');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓ Spacious 4-Page Contract HTML written to:', htmlPath);

// ── Render Multi-page PDF and Previews via Puppeteer ──
(async () => {
    console.log('Launching Puppeteer Chrome to render spacious 4-page contract (+7-8% font bump)...');
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
        headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // Render 4-Page A4 PDF
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });
    console.log('✓ Multi-page PDF successfully written to:', pdfPath);

    // Capture individual page screenshots for complete review
    const pageHandles = await page.$$('.page');
    console.log(`Found ${pageHandles.length} pages to render screenshots for.`);

    for (let i = 0; i < pageHandles.length; i++) {
        const pagePngPath = path.join(pubDir, `offer_letter_hiten_verma_page${i + 1}.png`);
        await pageHandles[i].screenshot({ path: pagePngPath });
        console.log(`✓ Page ${i + 1} screenshot saved to:`, pagePngPath);
    }

    // Capture Page 1 as the primary preview
    if (pageHandles.length > 0) {
        await pageHandles[0].screenshot({ path: previewPngPath });
        console.log('✓ Master preview screenshot saved to:', previewPngPath);
    }

    await browser.close();
    console.log('✅ Generation Complete: Contract ready for executive review.');
})();
