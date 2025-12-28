
export const brands = [
    { id: 'apple', name: 'Apple', logo: 'https://cdn.simpleicons.org/apple/black' },
    { id: 'samsung', name: 'Samsung', logo: 'https://cdn.simpleicons.org/samsung/1428A0' },
    { id: 'xiaomi', name: 'Xiaomi', logo: 'https://cdn.simpleicons.org/xiaomi/FF6900' },
    { id: 'oneplus', name: 'OnePlus', logo: 'https://cdn.simpleicons.org/oneplus/F5010C' },
    { id: 'vivo', name: 'Vivo', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png' },
    { id: 'oppo', name: 'Oppo', logo: '/brands/oppo.svg' },
    { id: 'realme', name: 'Realme', logo: '/brands/realme.svg' },
    { id: 'google', name: 'Google', logo: 'https://cdn.simpleicons.org/google/4285F4' },
    { id: 'motorola', name: 'Motorola', logo: '/brands/motorola_black.svg' },
    { id: 'nothing', name: 'Nothing', logo: '/brands/nothing_large.svg' },
    { id: 'asus', name: 'Asus', logo: 'https://cdn.simpleicons.org/asus/006CE1' },
    { id: 'sony', name: 'Sony', logo: 'https://cdn.simpleicons.org/sony/000000' },
    { id: 'poco', name: 'Poco', logo: '/brands/poco.svg' },
    { id: 'iqoo', name: 'iQOO', logo: '/brands/iqoo.svg' },
    { id: 'infinix', name: 'Infinix', logo: '/brands/infinix.svg' },
];

export const models = {
    'xiaomi': [
        { id: 'redmi-note-6-pro', name: 'Redmi Note 6 Pro', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-6-pro.jpg' },
        { id: 'redmi-note-10', name: 'Redmi Note 10', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note10.jpg' },
        { id: 'mi-11x', name: 'Mi 11X', img: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-mi11x.jpg' },
    ],
    'apple': [
        { id: 'iphone-13', name: 'iPhone 13', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg' },
        { id: 'iphone-14', name: 'iPhone 14', img: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg' },
    ],
    'samsung': [],
    'oneplus': [],
    'vivo': [],
    'oppo': [],
    'realme': [],
    'google': [],
    'motorola': [],
    'nothing': [],
    'asus': [],
    'sony': [],
    'poco': [],
    'iqoo': [],
    'infinix': [],
    // Add others as needed
};

export const variants = [
    { id: '4-64', name: '4 GB / 64 GB', basePrice: 5000 },
    { id: '6-64', name: '6 GB / 64 GB', basePrice: 5500 },
    { id: '6-128', name: '6 GB / 128 GB', basePrice: 6000 },
    { id: '8-128', name: '8 GB / 128 GB', basePrice: 7000 },
];

export const questionnaireSteps = [
    {
        id: 'core_functionality',
        title: 'Tell us more about your device?',
        subtitle: 'Please answer a few questions about your device.',
        questions: [
            {
                id: 'calls',
                text: 'Are you able to make and receive calls?',
                subtext: 'Check your device for cellular network connectivity issues.',
                type: 'boolean',
            },
            {
                id: 'touch',
                text: 'Is your device\'s touch screen working properly?',
                subtext: 'Check the touch screen functionality of your phone.',
                type: 'boolean',
            },
            {
                id: 'screen_original',
                text: 'Is your phone\'s screen original?',
                subtext: 'Pick "Yes" if screen was never changed or was changed by Authorized Service Center. Pick "No" if screen was changed at local shop.',
                type: 'boolean',
            }
        ]
    },
    {
        id: 'screen_defects',
        title: 'Select screen/body defects that are applicable!',
        subtitle: 'Please provide correct details',
        type: 'multi-select',
        options: [
            { id: 'scratch_screen', label: 'Broken/scratch on device screen', icon: 'smartphone' },
            { id: 'dead_spot', label: 'Dead Spot/Visible line and Discoloration on screen', icon: 'smartphone_line' }, // Custom icon needed or generic
            { id: 'dent_body', label: 'Scratch/Dent on device body', icon: 'smartphone_vibration' },
            { id: 'panel_broken', label: 'Device panel missing/broken', icon: 'smartphone_broken' },
        ]
    },
    {
        id: 'functional_problems',
        title: 'Functional or Physical Problems',
        subtitle: 'Please choose appropriate condition to get accurate quote',
        type: 'multi-select-grid',
        options: [
            { id: 'front_camera', label: 'Front Camera not working', icon: 'camera_front' },
            { id: 'back_camera', label: 'Back Camera not working', icon: 'camera' },
            { id: 'volume_legacy', label: 'Volume Button not working', icon: 'volume_x' },
            { id: 'finger_touch', label: 'Finger Touch not working', icon: 'fingerprint' },
            { id: 'wifi', label: 'WiFi not working', icon: 'wifi_off' },
            { id: 'battery', label: 'Battery Faulty', icon: 'battery_warning' },
            { id: 'speaker', label: 'Speaker Faulty', icon: 'speaker_off' },
            { id: 'power_button', label: 'Power Button not working', icon: 'power_off' },
            { id: 'charging_port', label: 'Charging Port not working', icon: 'plug_zap' },
            { id: 'face_sensor', label: 'Face Sensor not working', icon: 'scan_face' },
            { id: 'silent_button', label: 'Silent Button not working', icon: 'bell_off' },
            { id: 'audio_receiver', label: 'Audio Receiver not working', icon: 'ear_off' },
            { id: 'camera_glass', label: 'Camera Glass Broken', icon: 'camera_off' },
            { id: 'bluetooth', label: 'Bluetooth not working', icon: 'bluetooth_off' },
            { id: 'vibrator', label: 'Vibrator is not working', icon: 'vibrate_off' },
            { id: 'mic', label: 'Microphone not working', icon: 'mic_off' },
            { id: 'proximity', label: 'Proximity Sensor not working', icon: 'hand_off' },
        ]
    },
    {
        id: 'accessories',
        title: 'Do you have the following?',
        subtitle: 'Please select accessories which are available',
        type: 'multi-select',
        options: [
            { id: 'charger', label: 'Original Charger of Device', icon: 'plug' },
            { id: 'box', label: 'Original Box with same IMEI', icon: 'box' },
            // { id: 'bill', label: 'Bill', icon: 'receipt' },
        ]
    }
];
