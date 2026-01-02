
export const brands = [
    { id: 'apple', name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', categories: ['smartphone', 'tablet', 'watch'] },
    { id: 'xiaomi', name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', categories: ['smartphone', 'tablet', 'tv', 'watch'] },
    { id: 'samsung', name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', categories: ['smartphone', 'tablet', 'watch', 'tv'] },
    { id: 'vivo', name: 'Vivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Vivo_logo_2019.svg', categories: ['smartphone'] },
    { id: 'oneplus', name: 'OnePlus', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/OnePlus_logo.svg', categories: ['smartphone', 'tablet', 'watch'] },
    { id: 'oppo', name: 'Oppo', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg', categories: ['smartphone'] },
    { id: 'realme', name: 'Realme', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box_RGB_01.svg', categories: ['smartphone', 'tablet'] },
    { id: 'motorola', name: 'Motorola', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Motorola_logo.svg', categories: ['smartphone'] },
    { id: 'lenovo', name: 'Lenovo', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg', categories: ['smartphone', 'tablet'] },
    { id: 'nokia', name: 'Nokia', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Nokia_logoblue.svg', categories: ['smartphone'] },
    { id: 'honor', name: 'Honor', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Honor_Logo.svg', categories: ['smartphone'] },
    { id: 'google', name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', categories: ['smartphone', 'watch', 'tablet'] },
    { id: 'poco', name: 'Poco', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Poco_Logo.svg', categories: ['smartphone'] },
    { id: 'infinix', name: 'Infinix', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Infinix_Mobility_logo.svg', categories: ['smartphone'] },
    { id: 'tecno', name: 'Tecno', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Tecno_Mobile_logo.svg', categories: ['smartphone'] },
    { id: 'iqoo', name: 'iQOO', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/IQOO_logo.svg', categories: ['smartphone'] },
    { id: 'nothing', name: 'Nothing', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Nothing_Technology_logo.svg', categories: ['smartphone'] },
    { id: 'sony', name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sony_logo.svg', categories: ['smartphone', 'tv', 'console'] },
    { id: 'lg', name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg', categories: ['smartphone', 'tv'] },
    { id: 'microsoft', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', categories: ['console', 'tablet'] },
    { id: 'nintendo', name: 'Nintendo', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg', categories: ['console'] },
];

export const models = {
    'xiaomi': [
        { id: 'redmi-note-6-pro', brandId: 'xiaomi', name: 'Redmi Note 6 Pro', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-6-pro.jpg', category: 'smartphone' },
        { id: 'redmi-note-10', brandId: 'xiaomi', name: 'Redmi Note 10', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note10.jpg', category: 'smartphone' },
        { id: 'mi-11x', brandId: 'xiaomi', name: 'Mi 11X', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-mi11x.jpg', category: 'smartphone' },
        { id: 'mi-tv-4a', brandId: 'xiaomi', name: 'Mi TV 4A 32"', img: 'https://i01.appmifile.com/v1/MIBC/s/width/1000/height/1000/priority/1/2dd6fc82390a3de077b966cf13a96739.jpg', category: 'tv' },
    ],
    'apple': [
        { id: 'iphone-13', brandId: 'apple', name: 'iPhone 13', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg', category: 'smartphone' },
        { id: 'iphone-14', brandId: 'apple', name: 'iPhone 14', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg', category: 'smartphone' },
        { id: 'ipad-pro', brandId: 'apple', name: 'iPad Pro 11"', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2022.jpg', category: 'tablet' },
        { id: 'watch-s8', brandId: 'apple', name: 'Watch Series 8', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-watch-series8-45mm.jpg', category: 'watch' },
    ],
    'samsung': [
        { id: 'galaxy-s21', brandId: 'samsung', name: 'Galaxy S21', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s21-5g-r.jpg', category: 'smartphone' },
        { id: 'galaxy-tab-s8', brandId: 'samsung', name: 'Galaxy Tab S8', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-tab-s8.jpg', category: 'tablet' },
        { id: 'galaxy-watch-5', brandId: 'samsung', name: 'Galaxy Watch 5', img: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-watch5-44mm.jpg', category: 'watch' },
        { id: 'samsung-tv-qled', brandId: 'samsung', name: 'QLED 4K Smart TV', img: 'https://images.samsung.com/is/image/samsung/p6pim/in/qa55qn90baklxl/gallery/in-neo-qled-qn90b-qa55qn90baklxl-531393673?$684_684_PNG$', category: 'tv' },
    ],
    'sony': [
        { id: 'ps5', brandId: 'sony', name: 'PlayStation 5', img: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$', category: 'console' },
        { id: 'sony-bravia', brandId: 'sony', name: 'BRAVIA XR OLED', img: 'https://www.sony.co.in/image/5dca43e49661b177d5492429672d6228?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF', category: 'tv' },
    ],
    'microsoft': [
        { id: 'xbox-series-x', brandId: 'microsoft', name: 'Xbox Series X', img: 'https://cms-assets.xboxservices.com/assets/0b/40/0b402283-0663-4bd0-830b-ca97042c13f6.png?n=Xbox-Series-X_Image-0_Console_281x378.png', category: 'console' },
    ],
    'nintendo': [
        { id: 'switch-oled', brandId: 'nintendo', name: 'Nintendo Switch OLED', img: 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/ncom/en_US/switch/site-design-update/hardware/switch/oled-model/gallery/white/01', category: 'console' },
    ],
    'lg': [
        { id: 'lg-oled-c2', brandId: 'lg', name: 'LG OLED C2', img: 'https://www.lg.com/in/images/tvs/md07554868/gallery/OLED55C2PSC-D-01.jpg', category: 'tv' },
    ],
    'oneplus': [{ id: 'op-10', brandId: 'oneplus', name: 'OnePlus 10 Pro', img: '', category: 'smartphone' }],
    'vivo': [],
    'oppo': [],
    'realme': [],
    'google': [],
    'motorola': [],
    'nothing': [],
    'lenovo': [],
    'nokia': [],
    'honor': [],
    'poco': [],
    'iqoo': [],
    'infinix': [],
    'tecno': [],
    // Add others as needed
};

// Categories of variants to select from
export const variantSets = {
    'smartphone': [
        { id: '4-64', name: '4 GB / 64 GB', basePrice: 5000 },
        { id: '6-64', name: '6 GB / 64 GB', basePrice: 6500 },
        { id: '6-128', name: '6 GB / 128 GB', basePrice: 8000 },
        { id: '8-128', name: '8 GB / 128 GB', basePrice: 10000 },
        { id: '8-256', name: '8 GB / 256 GB', basePrice: 12000 },
        { id: '12-256', name: '12 GB / 256 GB', basePrice: 15000 },
    ],
    'tablet': [
        { id: 'wifi-64', name: 'WiFi Only - 64 GB', basePrice: 15000 },
        { id: 'wifi-128', name: 'WiFi Only - 128 GB', basePrice: 20000 },
        { id: 'wifi-256', name: 'WiFi Only - 256 GB', basePrice: 25000 },
        { id: 'cell-64', name: 'WiFi + Cellular - 64 GB', basePrice: 20000 },
        { id: 'cell-128', name: 'WiFi + Cellular - 128 GB', basePrice: 25000 },
    ],
    'watch': [
        { id: 'gps-40', name: 'GPS - 40mm', basePrice: 10000 },
        { id: 'gps-44', name: 'GPS - 44mm', basePrice: 12000 },
        { id: 'lte-40', name: 'GPS + Cellular - 40mm', basePrice: 15000 },
        { id: 'lte-44', name: 'GPS + Cellular - 44mm', basePrice: 18000 },
    ],
    'console': [
        { id: 'dig', name: 'Digital Edition', basePrice: 15000 },
        { id: 'disc', name: 'Disc Edition', basePrice: 20000 },
        { id: '500gb', name: '500 GB Storage', basePrice: 10000 },
        { id: '1tb', name: '1 TB Storage', basePrice: 12000 },
    ],
    'tv': [
        { id: '32', name: '32 inch', basePrice: 5000 },
        { id: '43', name: '43 inch', basePrice: 10000 },
        { id: '50', name: '50 inch', basePrice: 15000 },
        { id: '55', name: '55 inch', basePrice: 20000 },
        { id: '65', name: '65 inch', basePrice: 30000 },
    ]
};

// Default export for backward compatibility if needed, but we should rely on variantSets
export const variants = variantSets.smartphone;

export const questionnaireSteps = {
    'smartphone': [
        {
            id: 'core_functionality',
            title: 'Tell us more about your device?',
            subtitle: 'Please answer a few questions about your device.',
            questions: [
                { id: 'calls', text: 'Are you able to make and receive calls?', subtext: 'Check your device for cellular network connectivity issues.', type: 'boolean' },
                { id: 'touch', text: 'Is your device\'s touch screen working properly?', subtext: 'Check the touch screen functionality of your phone.', type: 'boolean' },
                { id: 'screen_original', text: 'Is your phone\'s screen original?', subtext: 'Pick "Yes" if screen was never changed or was changed by Authorized Service Center.', type: 'boolean' }
            ]
        },
        {
            id: 'screen_defects',
            title: 'Select screen/body defects that are applicable!',
            subtitle: 'Please provide correct details',
            type: 'multi-select',
            options: [
                { id: 'scratch_screen', label: 'Broken/scratch on device screen', icon: 'Smartphone' },
                { id: 'dead_spot', label: 'Dead Spot/Visible line on screen', icon: 'ScanLine' },
                { id: 'dent_body', label: 'Scratch/Dent on device body', icon: 'ShieldAlert' },
                { id: 'panel_broken', label: 'Device panel missing/broken', icon: 'XCircle' },
                { id: 'loose_screen', label: 'Screen coming out/Loose', icon: 'Maximize' },
                { id: 'heavy_scratch', label: 'Heavy scratches on screen', icon: 'Scan' },
                { id: 'loose_panel', label: 'Back Panel Loose/Gap', icon: 'Minimize' },
            ]
        },
        {
            id: 'accessories',
            title: 'Do you have the following?',
            subtitle: 'Please select accessories which are available',
            type: 'multi-select',
            options: [
                { id: 'charger', label: 'Original Charger', icon: 'Plug' },
                { id: 'box', label: 'Original Box', icon: 'Box' },
            ]
        }
    ],
    'tablet': [
        {
            id: 'core_functionality',
            title: 'Tablet Condition Check',
            subtitle: 'Answer these to get the best price.',
            questions: [
                { id: 'power', text: 'Does the device turn on?', subtext: 'Ensure the tablet powers up and boots completely.', type: 'boolean' },
                { id: 'touch', text: 'Is the touch working seamlessly?', subtext: 'No dead zones or ghost touches.', type: 'boolean' },
                { id: 'wifi', text: 'Is WiFi working?', subtext: 'Can it connect to networks?', type: 'boolean' }
            ]
        },
        {
            id: 'physical_condition',
            title: 'Physical Condition',
            subtitle: 'Any physical damage?',
            type: 'multi-select',
            options: [
                { id: 'screen_crack', label: 'Cracked Screen', icon: 'Tablet' },
                { id: 'body_dent', label: 'Dents on Body', icon: 'ShieldAlert' },
                { id: 'bent', label: 'Body Bent', icon: 'Minimize2' },
            ]
        }
    ],
    'watch': [
        {
            id: 'core_functionality',
            title: 'Smartwatch Check',
            subtitle: 'How is your watch doing?',
            questions: [
                { id: 'power', text: 'Does it turn on and charge?', subtext: '', type: 'boolean' },
                { id: 'screen', text: 'Is the display clear?', subtext: 'No cracks or heavy scratches.', type: 'boolean' },
                { id: 'buttons', text: 'Do buttons/crown work?', subtext: '', type: 'boolean' }
            ]
        },
        {
            id: 'strap_condition',
            title: 'Strap & Body',
            subtitle: 'Select if applicable',
            type: 'multi-select',
            options: [
                { id: 'strap_broken', label: 'Strap Broken/Missing', icon: 'Watch' },
                { id: 'scratch_glass', label: 'Scratches on Glass', icon: 'ScanEye' },
            ]
        }
    ],
    'console': [
        {
            id: 'core_functionality',
            title: 'Console Check',
            subtitle: 'Let\'s check your gaming gear.',
            questions: [
                { id: 'power', text: 'Does it power on correctly?', subtext: 'No overheating or auto-shutdowns.', type: 'boolean' },
                { id: 'drive', text: 'Does the disc drive work?', subtext: 'Reads games without issues (if applicable).', type: 'boolean' },
                { id: 'controller', text: 'Is the controller included & working?', subtext: 'No drift issues.', type: 'boolean' }
            ]
        },
        {
            id: 'cosmetic',
            title: 'Cosmetic Condition',
            subtitle: 'Any physical issues?',
            type: 'multi-select',
            options: [
                { id: 'body_cracks', label: 'Cracks on Console Body', icon: 'Box' },
                { id: 'ports_damaged', label: 'HDMI/USB Ports Damaged', icon: 'Plug' },
            ]
        }
    ],
    'tv': [
        {
            id: 'core_functionality',
            title: 'Smart TV Check',
            subtitle: 'How is the TV condition?',
            questions: [
                { id: 'display', text: 'Is the display perfect?', subtext: 'No lines, dots, or color issues.', type: 'boolean' },
                { id: 'remote', text: 'Original Remote available?', subtext: '', type: 'boolean' },
                { id: 'wifi', text: 'Smart features (WiFi) working?', subtext: '', type: 'boolean' }
            ]
        }
    ]
};
