-- Clean up
DELETE FROM "Order";

DELETE FROM "Variant";

DELETE FROM "Model";

DELETE FROM "Brand";

DELETE FROM "Rider";

DELETE FROM "User";

-- Users
INSERT INTO
    "User" (
        "id",
        "email",
        "passwordHash",
        "name",
        "createdAt",
        "updatedAt"
    )
VALUES (
        'a71eff01-a29a-4aa5-b513-65ac23c36d7d',
        'test@example.com',
        '$2b$10$koBJVgVeIqUbss9PRo/MbOhVqXDLrzhbYS3nVzo8rSiVfcN3l2YmW',
        'Test User',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        '9ebbf493-36e2-441a-9795-ef10b260072a',
        'harsh@sk.com',
        '$2b$10$6GMrjcpEt2b3qUQWXu0MgOCMOYxT9USd/xFaHTdxuKfp4QlcnHThC',
        'Harsh',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- Riders
INSERT INTO
    "Rider" (
        "id",
        "name",
        "phone",
        "status",
        "password",
        "createdAt",
        "updatedAt"
    )
VALUES (
        'b2e5bd69-8e4e-4c45-9751-744d55e5791e',
        'Hari',
        '+917766775566',
        'available',
        '123123',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- Brands
INSERT INTO
    "Brand" ("id", "name", "logo")
VALUES (
        'apple',
        'Apple',
        'https://cdn.simpleicons.org/apple/black'
    ),
    (
        'samsung',
        'Samsung',
        'https://cdn.simpleicons.org/samsung/1428A0'
    ),
    (
        'xiaomi',
        'Xiaomi',
        'https://cdn.simpleicons.org/xiaomi/FF6900'
    ),
    (
        'oneplus',
        'OnePlus',
        'https://cdn.simpleicons.org/oneplus/F5010C'
    ),
    (
        'vivo',
        'Vivo',
        'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png'
    ),
    (
        'oppo',
        'Oppo',
        '/brands/oppo.svg'
    ),
    (
        'realme',
        'Realme',
        '/brands/realme.svg'
    ),
    (
        'google',
        'Google',
        'https://cdn.simpleicons.org/google/4285F4'
    ),
    (
        'motorola',
        'Motorola',
        '/brands/motorola_black.svg'
    ),
    (
        'nothing',
        'Nothing',
        '/brands/nothing_large.svg'
    ),
    (
        'asus',
        'Asus',
        'https://cdn.simpleicons.org/asus/006CE1'
    ),
    (
        'poco',
        'Poco',
        '/brands/poco.svg'
    ),
    (
        'iqoo',
        'iQOO',
        '/brands/iqoo.svg'
    ),
    (
        'infinix',
        'Infinix',
        '/brands/infinix.svg'
    ),
    ('generic', 'Generic', '');

-- Models
INSERT INTO
    "Model" (
        "id",
        "brandId",
        "name",
        "img"
    )
VALUES (
        'redmi-note-6-pro',
        'xiaomi',
        'Redmi Note 6 Pro',
        'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-6-pro.jpg'
    ),
    (
        'redmi-note-10',
        'xiaomi',
        'Redmi Note 10',
        'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note10.jpg'
    ),
    (
        'mi-11x',
        'xiaomi',
        'Mi 11X',
        'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-mi11x.jpg'
    ),
    (
        'iphone-13',
        'apple',
        'iPhone 13',
        'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg'
    ),
    (
        'iphone-14',
        'apple',
        'iPhone 14',
        'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg'
    ),
    (
        'generic',
        'generic',
        'Generic',
        ''
    );

-- Variants
INSERT INTO
    "Variant" (
        "id",
        "modelId",
        "name",
        "basePrice"
    )
VALUES (
        '4-64',
        'generic',
        '4 GB / 64 GB',
        5000
    ),
    (
        '6-64',
        'generic',
        '6 GB / 64 GB',
        5500
    ),
    (
        '6-128',
        'generic',
        '6 GB / 128 GB',
        6000
    ),
    (
        '8-128',
        'generic',
        '8 GB / 128 GB',
        7000
    );

-- Orders
INSERT INTO
    "Order" (
        "id",
        "userId",
        "device",
        "price",
        "status",
        "createdAt",
        "updatedAt",
        "address",
        "locationLat",
        "locationLng",
        "riderId",
        "answers"
    )
VALUES (
        'fd14aa56-d726-4ee3-b0b0-0744e6ee483b',
        'a71eff01-a29a-4aa5-b513-65ac23c36d7d',
        'iPhone 13 (4 GB / 64 GB)',
        5000,
        'Pending Pickup',
        1735089209597,
        1735089209597,
        'No Address Provided',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'dd1e5aef-0d62-489c-b9e1-1a8731cd7add',
        '9ebbf493-36e2-441a-9795-ef10b260072a',
        'iPhone 14 (4 GB / 64 GB)',
        2000,
        'assigned',
        1735408034969,
        1735408034969,
        '003',
        12.8986575856249,
        77.5240504331139,
        'b2e5bd69-8e4e-4c45-9751-744d55e5791e',
        NULL
    ),
    (
        'b0960565-e8a7-44d6-a6db-ff48d7579375',
        '9ebbf493-36e2-441a-9795-ef10b260072a',
        'iPhone 14 (8 GB / 128 GB)',
        3500,
        'assigned',
        1735571934393,
        1735571934393,
        '033',
        12.8986785097704,
        77.5240313483861,
        'b2e5bd69-8e4e-4c45-9751-744d55e5791e',
        '{"calls":true,"touch":false,"screen_original":true,"screen_defects":["scratch_screen","panel_broken"],"functional_problems":["back_camera","battery"],"accessories":["charger"]}'
    );