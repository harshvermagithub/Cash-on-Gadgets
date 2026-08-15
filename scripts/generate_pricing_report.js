const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const puppeteer = require('puppeteer');

// 2026 Newly Launched Models Catalog grouped by brand
const catalog = {
    "Samsung": [
        { name: "Galaxy S26 Ultra 5G", price: 139999 },
        { name: "Galaxy S26+ 5G", price: 99999 },
        { name: "Galaxy S26 5G", price: 79999 },
        { name: "Galaxy Z Fold 8 Ultra", price: 179999 },
        { name: "Galaxy Z Fold 8", price: 159999 },
        { name: "Galaxy Z Flip 8", price: 99999 },
        { name: "Galaxy F70 Pro 5G", price: 24999 },
        { name: "Galaxy M47 5G", price: 19999 },
        { name: "Galaxy A86 5G", price: 39999 }
    ],
    "Redmi": [
        { name: "Redmi Turbo 5", price: 41999 },
        { name: "Redmi Note 15 Pro+ 5G", price: 39999 },
        { name: "Redmi Note 15 Pro 5G", price: 34999 },
        { name: "Redmi Note 15 5G", price: 26999 },
        { name: "Redmi Note 15 SE 5G", price: 25999 },
        { name: "Redmi Note 17 5G", price: 30999 },
        { name: "Redmi 15C 5G", price: 18499 },
        { name: "Redmi 15A 5G", price: 15315 }
    ],
    "Realme": [
        { name: "Realme GT6 Pro 5G", price: 59999 },
        { name: "Realme GT6 5G", price: 40999 },
        { name: "Realme GT Neo 8 5G", price: 35999 },
        { name: "Realme 14 Pro+ 5G", price: 32999 },
        { name: "Realme 14 Pro 5G", price: 27999 },
        { name: "Realme 14 5G", price: 19999 },
        { name: "Realme Narzo 80 Pro", price: 22999 },
        { name: "Realme Narzo 80x 5G", price: 15999 },
        { name: "Realme C75 5G", price: 12999 }
    ],
    "POCO": [
        { name: "POCO F8 Pro 5G", price: 44999 },
        { name: "POCO F8 5G", price: 34999 },
        { name: "POCO F8 GT 5G", price: 39999 },
        { name: "POCO X8 Pro 5G", price: 28999 },
        { name: "POCO X8 5G", price: 21999 },
        { name: "POCO X8 Neo 5G", price: 17999 },
        { name: "POCO M8 Pro 5G", price: 14999 },
        { name: "POCO M8 5G", price: 11999 },
        { name: "POCO C8 5G", price: 9999 },
        { name: "POCO C8 Plus", price: 8999 }
    ],
    "Vivo": [
        { name: "Vivo X300 Ultra", price: 99999 },
        { name: "Vivo X300 Pro 5G", price: 79999 },
        { name: "Vivo X300 5G", price: 64999 },
        { name: "Vivo X300 FE 5G", price: 49999 },
        { name: "Vivo X200T", price: 44999 },
        { name: "Vivo X200 Pro", price: 69999 },
        { name: "Vivo V70 5G", price: 38999 },
        { name: "Vivo V70 Elite", price: 34999 },
        { name: "Vivo V70 FE", price: 29999 },
        { name: "Vivo V60 5G", price: 31999 },
        { name: "Vivo V60e 5G", price: 25999 },
        { name: "Vivo T5 Pro", price: 24999 },
        { name: "Vivo T5x 5G", price: 16999 },
        { name: "Vivo T5 Lite 5G", price: 13999 },
        { name: "Vivo T4 5G / Ultra", price: 19999 },
        { name: "Vivo S2 5G", price: 32999 },
        { name: "Vivo S50 / Mini", price: 27999 },
        { name: "Vivo Y600 Pro", price: 21999 },
        { name: "Vivo Y500 Pro", price: 17999 },
        { name: "Vivo Y500 5G", price: 14999 }
    ]
};

// Calculate Cashify Second-Hand Price (55% of Launch/Retail Price)
// Calculate Adjusted Price (Cashify Price + 2%)
const processCatalog = () => {
    const processed = {};
    for (const brand in catalog) {
        processed[brand] = catalog[brand].map(model => {
            const rawCashify = Math.round(model.price * 0.55);
            const adjusted = Math.round(rawCashify * 1.02);
            return {
                name: model.name,
                launchPrice: model.price,
                cashifyPrice: rawCashify,
                adjustedPrice: adjusted,
                status: "Not Present (Newly Launched 2026 Model)"
            };
        });
    }
    return processed;
};

const processedData = processCatalog();

// 1. Generate Excel File
const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const rows = [
        ["Brand", "Model Name", "Launch Price (INR)", "Cashify 2nd Hand Price (55%) (INR)", "Adjusted Price (+2%) (INR)", "Fonzkart Database Status"]
    ];

    for (const brand in processedData) {
        for (const item of processedData[brand]) {
            rows.push([
                brand,
                item.name,
                item.launchPrice,
                item.cashifyPrice,
                item.adjustedPrice,
                item.status
            ]);
        }
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    
    // Set column widths
    const wscols = [
        { wch: 15 }, // Brand
        { wch: 25 }, // Model Name
        { wch: 20 }, // Launch Price
        { wch: 30 }, // Cashify 2nd Hand
        { wch: 25 }, // Adjusted Price
        { wch: 45 }  // Status
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "2026 Model Resale Prices");
    XLSX.writeFile(wb, path.join(__dirname, '../public/fonzkart_resale_prices.xlsx'));
    console.log("Excel file generated at public/fonzkart_resale_prices.xlsx");
};

// 2. Generate HTML file for PDF printing
const generateHTML = () => {
    let brandTables = "";
    
    for (const brand in processedData) {
        let rows = "";
        processedData[brand].forEach((item, index) => {
            rows += `
                <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-stone-50'} border-b border-stone-200">
                    <td class="px-4 py-3 text-stone-800 font-medium">${item.name}</td>
                    <td class="px-4 py-3 text-stone-600">₹${item.launchPrice.toLocaleString('en-IN')}</td>
                    <td class="px-4 py-3 text-stone-600">₹${item.cashifyPrice.toLocaleString('en-IN')}</td>
                    <td class="px-4 py-3 text-emerald-700 font-bold">₹${item.adjustedPrice.toLocaleString('en-IN')}</td>
                    <td class="px-4 py-3"><span class="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded font-medium border border-red-100">${item.status}</span></td>
                </tr>
            `;
        });

        brandTables += `
            <div class="mb-10 page-break-inside-avoid">
                <div class="flex items-center gap-3 mb-4">
                    <div class="h-8 w-1.5 bg-emerald-600 rounded"></div>
                    <h2 class="text-xl font-bold text-stone-900">${brand} Models</h2>
                </div>
                <div class="overflow-hidden rounded-lg border border-stone-200 shadow-sm">
                    <table class="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr class="bg-stone-800 text-white font-semibold">
                                <th class="px-4 py-3">Model Name</th>
                                <th class="px-4 py-3">Launch Price</th>
                                <th class="px-4 py-3">Cashify Estimate (55%)</th>
                                <th class="px-4 py-3 text-emerald-400">Fonzkart Adjusted (+2%)</th>
                                <th class="px-4 py-3">Catalog Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fonzkart 2026 Newly Launched Smartphone Valuation Report</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');
            body {
                font-family: 'Geist', sans-serif;
            }
            @media print {
                body {
                    background-color: white !important;
                    padding: 0 !important;
                }
                .container-card {
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                }
                .page-break-inside-avoid { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body class="bg-stone-100 p-8 text-stone-800">
        <div class="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-lg border border-stone-200 container-card">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-stone-200 pb-8 mb-8">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-3xl font-black tracking-tight text-stone-900">FONZ<span class="text-emerald-600">KART</span></span>
                        <span class="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">Valuation Hub</span>
                    </div>
                    <h1 class="text-2xl font-bold text-stone-800">2026 Smartphone Catalog & Resale Pricing Directory</h1>
                    <p class="text-sm text-stone-500 mt-1">Generated on: August 15, 2026 | Reference: FK-VAL-2026-V1</p>
                </div>
                <div class="mt-4 md:mt-0 text-left md:text-right text-stone-600 text-sm">
                    <p class="font-semibold">NR Waste Management Private Limited</p>
                    <p>#69 8th cross Hegde Nagar, SRK Nagar Post</p>
                    <p>Bangalore - 560077</p>
                </div>
            </div>

            <!-- Summary Card -->
            <div class="bg-stone-50 rounded-lg p-6 border border-stone-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 page-break-inside-avoid">
                <div>
                    <h3 class="font-bold text-stone-900 text-lg mb-1">Pricing Logic Overview</h3>
                    <p class="text-sm text-stone-600 leading-relaxed max-w-2xl">
                        This report compiles newly launched 2026 smartphone models across five major brands. Since these models are recently launched and not yet present in FonzKart's core catalog, they are flagged for addition. 
                        Second-hand resale prices are calculated based on Cashify's standard valuation benchmark (**55% of launch price**) and increased by **2%** to establish Fonzkart's optimized buyback base prices.
                    </p>
                </div>
                <div class="flex gap-4 min-w-[200px]">
                    <div class="bg-white px-4 py-3 rounded-lg border border-stone-200 flex-1 text-center shadow-sm">
                        <span class="block text-2xl font-black text-emerald-600">${Object.keys(processedData).length}</span>
                        <span class="text-xs text-stone-500 font-semibold uppercase">Brands</span>
                    </div>
                    <div class="bg-white px-4 py-3 rounded-lg border border-stone-200 flex-1 text-center shadow-sm">
                        <span class="block text-2xl font-black text-stone-800">56</span>
                        <span class="text-xs text-stone-500 font-semibold uppercase">Models</span>
                    </div>
                </div>
            </div>

            <!-- Tables -->
            ${brandTables}

            <!-- Footer -->
            <div class="border-t border-stone-200 pt-6 mt-10 text-center text-xs text-stone-400 page-break-inside-avoid">
                <p>© 2026 Fonzkart. Confidential internal valuation directory. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    fs.writeFileSync(path.join(__dirname, '../public/fonzkart_resale_prices.html'), htmlContent);
    console.log("HTML preview generated at public/fonzkart_resale_prices.html");
};

// 3. Print PDF using Puppeteer
async function generatePDF() {
    console.log('Launching headless browser to print Valuation PDF...');
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const htmlPath = path.join(__dirname, '../public/fonzkart_resale_prices.html');
    
    console.log('Loading valuation HTML template...');
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
    
    console.log('Printing Valuation PDF...');
    await page.pdf({
        path: path.join(__dirname, '../public/fonzkart_resale_prices.pdf'),
        format: 'A4',
        printBackground: true,
        margin: { top: '30px', bottom: '30px', left: '30px', right: '30px' }
    });
    
    console.log('Pricing PDF generated successfully at public/fonzkart_resale_prices.pdf');
    await browser.close();
}

async function run() {
    generateExcel();
    generateHTML();
    await generatePDF();
}

run().catch(err => {
    console.error('Error generating valuation report files:', err);
    process.exit(1);
});
