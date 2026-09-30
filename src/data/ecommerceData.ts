import { Product, CustomerOrder, Address, CustomerProfile, CustomerNotification, DeliveryOption } from '../types/ecommerce';

export const POPULAR_CATEGORIES = [
  { name: 'All', icon: 'Sparkles', count: 32 },
  { name: 'Electronics', icon: 'Laptop', count: 6, image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300&q=80' },
  { name: 'Mobiles', icon: 'Smartphone', count: 4, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
  { name: 'Audio', icon: 'Headphones', count: 4, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { name: 'Fashion', icon: 'Shirt', count: 4, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80' },
  { name: 'Home & Kitchen', icon: 'Home', count: 4, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&q=80' },
  { name: 'Beauty & Care', icon: 'Sparkle', count: 3, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80' },
  { name: 'Sports & Fitness', icon: 'Activity', count: 3, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&q=80' },
  { name: 'Books', icon: 'BookOpen', count: 2, image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80' },
  { name: 'Accessories', icon: 'Watch', count: 3, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
  { name: 'Grocery', icon: 'ShoppingBag', count: 3, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80' },
];

export const PRODUCTS_DATABASE: Product[] = [
  {
    id: 'prod-1',
    name: 'Sony WH-1000XM5 Noise Canceling Wireless Headphones',
    brand: 'Sony',
    category: 'Audio',
    description: 'Industry-leading noise canceling with two processors and 8 microphones. Ultra-comfortable lightweight design with soft fit leather and up to 30 hours battery life.',
    price: 26990,
    originalPrice: 34990,
    discountPercent: 23,
    rating: 4.8,
    reviewsCount: 4218,
    inStock: true,
    stockCount: 14,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Tomorrow, 2 PM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
    ],
    features: [
      'Auto NC Optimizer dynamically adjusts to conditions',
      'Speak-to-Chat technology automatically stops music when you speak',
      'Crystal clear hands-free calling with 4 beamforming microphones',
      'Multipoint connection allows pairing with two Bluetooth devices simultaneously'
    ],
    specifications: {
      'Driver Unit': '30 mm',
      'Battery Life': 'Up to 30 Hours',
      'Bluetooth': 'Version 5.2',
      'Weight': '250 grams',
      'Charging Time': 'Approx. 3.5 hrs (3 min quick charge for 3 hrs play)'
    },
    warranty: '1 Year Manufacturer Warranty across India',
    boxContents: ['Headphones', 'Carrying Case', 'Connection Cable', 'USB-C Cable'],
    weightKg: 0.25,
    isWishlisted: true,
  },
  {
    id: 'prod-2',
    name: 'Apple MacBook Air 15" M3 Chip (16GB RAM, 512GB SSD) - Starlight',
    brand: 'Apple',
    category: 'Electronics',
    description: 'Strikingly thin design with the lightning-fast M3 chip. Liquid Retina display supports 1 billion colors. Up to 18 hours of battery life with silent, fanless operation.',
    price: 134900,
    originalPrice: 144900,
    discountPercent: 7,
    rating: 4.9,
    reviewsCount: 1845,
    inStock: true,
    stockCount: 5,
    badge: 'Trending',
    deliveryEstimate: 'FREE Delivery Today by 7 PM',
    fastDeliveryHours: 6,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
    ],
    features: [
      'Apple M3 8-core CPU and 10-core GPU',
      '15.3-inch Liquid Retina display with True Tone',
      '1080p FaceTime HD camera with three-mic array',
      'MagSafe 3 charging port with two Thunderbolt ports'
    ],
    specifications: {
      'Processor': 'Apple M3 chip',
      'Unified Memory': '16 GB',
      'Storage': '512 GB SSD',
      'Display': '15.3-inch Liquid Retina (2880x1864)',
      'Weight': '1.51 kg'
    },
    warranty: '1 Year Apple India Hardware Coverage',
    boxContents: ['MacBook Air 15-inch', '35W Dual USB-C Port Power Adapter', 'USB-C to MagSafe 3 Cable'],
    weightKg: 1.51,
  },
  {
    id: 'prod-3',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
    brand: 'Samsung',
    category: 'Mobiles',
    description: 'Welcome to the era of mobile AI. Built with a durable titanium shield and integrated S Pen. 200MP camera system with ProVisual AI image engine.',
    price: 119999,
    originalPrice: 134999,
    discountPercent: 11,
    rating: 4.7,
    reviewsCount: 3120,
    inStock: true,
    stockCount: 8,
    badge: 'Deal of the Day',
    deliveryEstimate: 'FREE Delivery Tomorrow, 11 AM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80'
    ],
    features: [
      'Galaxy AI: Circle to Search, Live Translate, Note Assist',
      '200MP Main sensor with 5x optical zoom 50MP telephoto',
      'Snapdragon 8 Gen 3 for Galaxy processor',
      'Dynamic AMOLED 2X 120Hz display with Corning Gorilla Armor'
    ],
    specifications: {
      'Screen Size': '6.8 inches QHD+',
      'RAM': '12 GB',
      'Storage': '256 GB',
      'Battery': '5000 mAh with 45W Fast Charge'
    },
    warranty: '1 Year Brand Warranty for Phone and 6 Months for In-Box Accessories',
    boxContents: ['Handset', 'S Pen', 'Data Cable (Type C-to-C)', 'SIM Ejector Pin'],
    weightKg: 0.23,
  },
  {
    id: 'prod-4',
    name: 'Logitech MX Master 3S Wireless Ergonomic Mouse',
    brand: 'Logitech',
    category: 'Electronics',
    description: 'Feel every moment of your workflow with even more precision and tactile feel thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.',
    price: 8995,
    originalPrice: 10995,
    discountPercent: 18,
    rating: 4.8,
    reviewsCount: 6810,
    inStock: true,
    stockCount: 22,
    badge: 'Fast Delivery',
    deliveryEstimate: 'FREE Delivery Today by 6 PM',
    fastDeliveryHours: 5,
    thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'
    ],
    features: [
      'Quiet Clicks with 90% less click noise',
      'MagSpeed Electromagnetic scrolling scrolls 1,000 lines per second',
      'Any-surface tracking - even on glass',
      'Pair up to 3 devices via Bluetooth or Logi Bolt'
    ],
    specifications: {
      'Sensor': 'Darkfield high precision (8000 DPI)',
      'Buttons': '7 buttons (Left/Right, Back/Forward, App-Switch, Wheel mode-shift, Middle click)',
      'Battery': 'Rechargeable Li-Po (500 mAh) up to 70 days',
      'Weight': '141 g'
    },
    warranty: '1 Year Limited Hardware Warranty',
    boxContents: ['Mouse', 'Logi Bolt USB Receiver', 'USB-C Charging Cable', 'User Documentation'],
    weightKg: 0.14,
  },
  {
    id: 'prod-5',
    name: 'boAt Airdopes 141 ANC TWS Earbuds with 42H Playtime',
    brand: 'boAt',
    category: 'Audio',
    description: 'Tune into tranquil sound with active noise cancellation up to 32dB. Features ENx tech for crystal clear calls and BEAST mode 50ms low latency gaming.',
    price: 1499,
    originalPrice: 4490,
    discountPercent: 67,
    rating: 4.3,
    reviewsCount: 14890,
    inStock: true,
    stockCount: 45,
    badge: 'Deal of the Day',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'
    ],
    features: [
      'Up to 32dB Active Noise Cancellation',
      '42 Hours Total Playback with ASAP Charge',
      'Dual Mics with ENx Environmental Noise Cancellation',
      'IPX5 Water and Sweat Resistance'
    ],
    specifications: {
      'Driver Size': '10 mm x 2',
      'Bluetooth': 'v5.3',
      'Charging Time': '1 Hour',
      'Latency': '50ms BEAST Mode'
    },
    warranty: '1 Year Replacement Warranty',
    boxContents: ['Pair of Earbuds', 'Charging Case', 'Type-C Cable', 'Extra Ear Tips', 'User Manual'],
    weightKg: 0.05,
  },
  {
    id: 'prod-6',
    name: 'Nike Air Zoom Pegasus 40 Running Shoes - Deep Royal',
    brand: 'Nike',
    category: 'Sports & Fitness',
    description: 'A springy ride for any run, the Pegasus familiar, just-for-you feel returns to help you accomplish your goals. React foam and dual Zoom Air units.',
    price: 7995,
    originalPrice: 11895,
    discountPercent: 33,
    rating: 4.6,
    reviewsCount: 940,
    inStock: true,
    stockCount: 6,
    badge: 'Trending',
    deliveryEstimate: 'FREE Delivery Tomorrow, 4 PM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'
    ],
    features: [
      'Nike React technology provides a smooth, responsive ride',
      'Dual Zoom Air units at the forefoot and heel provide energized feel',
      'Engineered mesh upper optimizes airflow and comfort',
      'Waffle-inspired outsole pattern provides dependable traction'
    ],
    specifications: {
      'Closure': 'Lace-Up',
      'Sole Material': 'Rubber',
      'Upper Material': 'Engineered Mesh',
      'Weight': '288 grams'
    },
    warranty: '6 Months Brand Warranty against manufacturing defects',
    boxContents: ['1 Pair of Nike Pegasus 40 Shoes'],
    weightKg: 0.85,
  },
  {
    id: 'prod-7',
    name: 'Apple Watch Series 9 GPS 45mm Midnight Aluminum Case',
    brand: 'Apple',
    category: 'Accessories',
    description: 'Smarter, brighter, mightier. With the S9 SiP, Double Tap gesture, Blood Oxygen app, and temperature sensing for deeper insights into your health.',
    price: 41900,
    originalPrice: 44900,
    discountPercent: 7,
    rating: 4.8,
    reviewsCount: 1650,
    inStock: true,
    stockCount: 11,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Today by 8 PM',
    fastDeliveryHours: 8,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    ],
    features: [
      'Double Tap gesture to answer calls and pause music effortlessly',
      'Always-On Retina display up to 2000 nits brightness',
      'Advanced sensor array for ECG, heart rate, and temperature tracking',
      'Crash Detection and Fall Detection emergency SOS'
    ],
    specifications: {
      'Case Size': '45 mm',
      'Display': 'OLED Always-On Retina',
      'Water Resistance': '50 meters swimproof',
      'Battery': 'Up to 18 hours (36 hours Low Power Mode)'
    },
    warranty: '1 Year Apple India Warranty',
    boxContents: ['Midnight Aluminum Case', 'Midnight Sport Band', 'Apple Watch Magnetic Fast Charger to USB-C Cable (1 m)'],
    weightKg: 0.18,
  },
  {
    id: 'prod-8',
    name: 'Nespresso Vertuo Pop Coffee Machine by Krups',
    brand: 'Nespresso',
    category: 'Home & Kitchen',
    description: 'Add a touch of style with compact design and vibrant colors. Centrifusion extraction technology brews five cup sizes from Espresso to Alto.',
    price: 14999,
    originalPrice: 19999,
    discountPercent: 25,
    rating: 4.6,
    reviewsCount: 810,
    inStock: true,
    stockCount: 9,
    badge: 'Limited Deal',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80'
    ],
    features: [
      'Patented Centrifusion technology spins capsule up to 4,000 RPM',
      'Barcode reading automatically adjusts brewing parameters per coffee pod',
      'Heats up in just 30 seconds',
      'Bluetooth smart connected for firmware updates'
    ],
    specifications: {
      'Water Tank Capacity': '0.6 Litres',
      'Cup Sizes': 'Espresso (40ml), Double Espresso (80ml), Gran Lungo (150ml), Mug (230ml)',
      'Dimensions': '13.6 x 42.6 x 25 cm',
      'Power': '1260 W'
    },
    warranty: '2 Years Manufacturer Warranty',
    boxContents: ['Coffee Machine', 'Welcome pack of 12 Vertuo capsules', 'Water Tank', 'Manual'],
    weightKg: 3.5,
  },
  {
    id: 'prod-9',
    name: 'Dyson V12 Detect Slim Total Clean Cordless Vacuum',
    brand: 'Dyson',
    category: 'Home & Kitchen',
    description: 'Dyson’s lightest intelligent cordless vacuum with laser illumination. Reveals invisible dust on hard floors and counts and measures the size of dust particles.',
    price: 52900,
    originalPrice: 65900,
    discountPercent: 20,
    rating: 4.9,
    reviewsCount: 1420,
    inStock: true,
    stockCount: 4,
    badge: 'Trending',
    deliveryEstimate: 'FREE Delivery Tomorrow, 10 AM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80'
    ],
    features: [
      'Precisely-angled beam reveals hidden microscopic dust',
      'Piezo sensor automatically increases suction power on heavy dirt',
      'LCD screen shows real-time particle count report',
      'Up to 60 minutes run time with fade-free suction'
    ],
    specifications: {
      'Suction Power': '150 Air Watts',
      'Bin Volume': '0.35 L',
      'Weight': '2.2 kg',
      'Charge Time': '4 hours'
    },
    warranty: '2 Years Comprehensive On-Site Warranty',
    boxContents: ['Dyson V12 Slim', 'Fluffy Optic cleaner head', 'Motorbar cleaner head', 'Hair screw tool', 'Combination tool', 'Crevice tool', 'Wall dok', 'Charger'],
    weightKg: 2.2,
  },
  {
    id: 'prod-10',
    name: 'Ray-Ban Classic Wayfarer Polarized Sunglasses',
    brand: 'Ray-Ban',
    category: 'Fashion',
    description: 'The iconic Wayfarer style loved by musicians, artists, and celebrities. 100% UV protection with polarized green G-15 crystal glass lenses.',
    price: 9890,
    originalPrice: 12290,
    discountPercent: 20,
    rating: 4.7,
    reviewsCount: 2310,
    inStock: true,
    stockCount: 17,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'
    ],
    features: [
      'Polarized lenses block 99% of reflected light glare',
      'Durable acetate frame handcrafted in Italy',
      'Scratch-resistant crystal mineral lenses',
      'Signature Ray-Ban metallic rivets on temples'
    ],
    specifications: {
      'Frame Material': 'Acetate (Glossy Black)',
      'Lens Color': 'G-15 Green Polarized',
      'Bridge Width': '18 mm',
      'Lens Width': '50 mm'
    },
    warranty: '2 Years Manufacturer Warranty',
    boxContents: ['Sunglasses', 'Original Leather Case', 'Microfiber Cleaning Cloth', 'Authenticity Booklet'],
    weightKg: 0.15,
  },
  {
    id: 'prod-11',
    name: 'Forest Essentials Ayurvedic Soundarya Radiance Cream',
    brand: 'Forest Essentials',
    category: 'Beauty & Care',
    description: 'An exceptionally rich night balm infused with 24K pure gold bhasma, saffron, and cold-pressed organic oils. Restores skin elasticity and natural glow.',
    price: 5475,
    originalPrice: 6200,
    discountPercent: 12,
    rating: 4.8,
    reviewsCount: 1730,
    inStock: true,
    stockCount: 25,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'
    ],
    features: [
      'Pure 24 Karat Gold Bhasma absorbs deep into skin layers',
      'Kashmiri Saffron extract lightens blemishes and pigmentation',
      'Sweet Almond oil and Shea Butter provide deep nourishment',
      '100% natural and free from petrochemicals and parabens'
    ],
    specifications: {
      'Volume': '50 grams',
      'Skin Type': 'All Skin Types',
      'Application': 'Night Cream',
      'Formulation': 'Ayurvedic Herb & Gold Emulsion'
    },
    warranty: 'Best before 24 months from manufacture date',
    boxContents: ['50g Jar with applicator spatula'],
    weightKg: 0.2,
  },
  {
    id: 'prod-12',
    name: 'Atomic Habits by James Clear (Hardcover Collector Edition)',
    brand: 'Penguin Random House',
    category: 'Books',
    description: 'An easy and proven way to build good habits and break bad ones. Over 15 million copies sold globally. World-class frameworks for tiny changes and remarkable results.',
    price: 699,
    originalPrice: 999,
    discountPercent: 30,
    rating: 4.9,
    reviewsCount: 38400,
    inStock: true,
    stockCount: 120,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'
    ],
    features: [
      'The Four Laws of Behavior Change guide',
      'Habit stacking and environment design blueprints',
      'Deluxe gold-foil stamped hardcover edition with ribbon bookmark',
      'Exclusive bonus habit tracker templates'
    ],
    specifications: {
      'Format': 'Hardcover',
      'Pages': '320 pages',
      'Language': 'English',
      'ISBN-13': '978-0735211292'
    },
    warranty: 'Brand New Original Publisher Sealed Copy',
    boxContents: ['1 Hardcover Book with book jacket'],
    weightKg: 0.45,
  },
  {
    id: 'prod-13',
    name: 'OnePlus 12 5G (Flowy Emerald, 16GB RAM, 512GB Storage)',
    brand: 'OnePlus',
    category: 'Mobiles',
    description: 'Powered by Snapdragon 8 Gen 3 with 4th Gen Hasselblad Camera system. Dual Cryo-velocity VC cooling and 5400 mAh battery with 100W SUPERVOOC charging.',
    price: 69999,
    originalPrice: 74999,
    discountPercent: 7,
    rating: 4.7,
    reviewsCount: 4120,
    inStock: true,
    stockCount: 15,
    badge: 'Trending',
    deliveryEstimate: 'FREE Delivery Tomorrow, 1 PM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
    ],
    features: [
      'Snapdragon 8 Gen 3 with Trinity Engine optimization',
      '2K 120Hz ProXDR Display with Aqua Touch technology',
      '50MP Sony LYT-808 OIS main camera + 64MP 3X Periscope telephoto',
      '100W SUPERVOOC charges 1-100% in just 26 minutes'
    ],
    specifications: {
      'Screen Size': '6.82 inches 2K AMOLED',
      'RAM': '16 GB LPDDR5X',
      'Storage': '512 GB UFS 4.0',
      'Battery': '5400 mAh with 50W AIRVOOC Wireless'
    },
    warranty: '1 Year Manufacturer Warranty',
    boxContents: ['Phone', '100W SUPERVOOC Power Adapter', 'Type-A to Type-C Cable', 'Protective Case'],
    weightKg: 0.22,
  },
  {
    id: 'prod-14',
    name: 'Kindle Paperwhite 16GB (6.8" glare-free display with warm light)',
    brand: 'Amazon',
    category: 'Electronics',
    description: 'Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
    price: 13999,
    originalPrice: 14999,
    discountPercent: 7,
    rating: 4.8,
    reviewsCount: 8900,
    inStock: true,
    stockCount: 30,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80'
    ],
    features: [
      'Flush-front 300 ppi glare-free display reads like real paper',
      'Adjustable warm light to shift screen shade from white to amber',
      'IPX8 waterproof rated to protect against accidental immersion',
      'Holds thousands of titles with 16GB storage'
    ],
    specifications: {
      'Screen': '6.8” Amazon display technology, 300 ppi',
      'Storage': '16 GB',
      'Battery Life': 'Up to 10 weeks',
      'Weight': '205 g'
    },
    warranty: '1-Year Limited Warranty and Service included',
    boxContents: ['Kindle Paperwhite', 'USB-C Charging Cable', 'Quick Start Guide'],
    weightKg: 0.21,
  },
  {
    id: 'prod-15',
    name: 'Levi’s Men’s 511 Slim Fit Stretch Denim Jeans',
    brand: 'Levi’s',
    category: 'Fashion',
    description: 'A modern slim with room to move. The 511 Slim Fit Jeans are a classic since right now. Cut close without being too tight for everyday comfort.',
    price: 2799,
    originalPrice: 4599,
    discountPercent: 39,
    rating: 4.5,
    reviewsCount: 5120,
    inStock: true,
    stockCount: 20,
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80'
    ],
    features: [
      'Premium stretch denim with Levi’s Flex technology',
      'Slim through the seat and thigh with a slim leg',
      'Classic 5-pocket styling and iconic Arcuate back pocket stitching',
      'Red Tab detail on right back pocket'
    ],
    specifications: {
      'Fit': 'Slim Fit',
      'Fabric': '99% Cotton, 1% Elastane',
      'Rise': 'Mid Rise',
      'Care': 'Machine Wash Cold'
    },
    warranty: 'Genuine Original Levi’s Brand Quality Guaranteed',
    boxContents: ['1 Pair of Levi’s 511 Jeans'],
    weightKg: 0.6,
  },
  {
    id: 'prod-16',
    name: 'Organic India Tulsi Green Tea Pomegranate (Pack of 3, 75 Tea Bags)',
    brand: 'Organic India',
    category: 'Grocery',
    description: 'Delicious blend of Rama, Krishna, and Vana Tulsi with organic Green Tea and sweet pomegranate flower essence. Rich in natural antioxidants.',
    price: 799,
    originalPrice: 990,
    discountPercent: 19,
    rating: 4.7,
    reviewsCount: 3410,
    inStock: true,
    stockCount: 50,
    badge: 'Deal of the Day',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80'
    ],
    features: [
      'Certified Organic Whole Leaf Infusion',
      'Boosts metabolism and immune defenses naturally',
      'Contains natural caffeine for alert, calm energy',
      'Staple-free unbleached tea bags'
    ],
    specifications: {
      'Quantity': '3 Tins (75 Infusion Bags Total)',
      'Flavor': 'Tulsi Green Tea Pomegranate',
      'Shelf Life': '24 Months',
      'Certifications': 'USDA Organic, India Organic'
    },
    warranty: '100% Organic certified quality assurance',
    boxContents: ['3 Boxes of 25 Tea Bags each'],
    weightKg: 0.35,
  },
  {
    id: 'prod-17',
    name: 'Decathlon Domyos Hex Dumbbell Pair (10kg each, 20kg Total)',
    brand: 'Decathlon',
    category: 'Sports & Fitness',
    description: 'Designed for cross-training and strength conditioning. Hexagonal shape prevents rolling on the floor and durable rubber coating protects flooring.',
    price: 3899,
    originalPrice: 4999,
    discountPercent: 22,
    rating: 4.8,
    reviewsCount: 2190,
    inStock: true,
    stockCount: 8,
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80'
    ],
    features: [
      'Ergonomic knurled chrome grip prevents slipping during lifts',
      'Thick rubber coating dampens sound and protects tile/wood floors',
      'Hexagon 6-sided design allows push-up rows with zero rolling',
      'Cast iron internal core for lifetime durability'
    ],
    specifications: {
      'Weight': '10 kg x 2 (20 kg total pair)',
      'Material': 'Cast Iron with Rubber Coating',
      'Grip Diameter': '30 mm',
      'Color': 'Matte Black'
    },
    warranty: '2 Years Brand Warranty against structural defects',
    boxContents: ['2 x 10kg Hex Dumbbells'],
    weightKg: 20.0,
  },
  {
    id: 'prod-18',
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker (6 Litre)',
    brand: 'Instant Pot',
    category: 'Home & Kitchen',
    description: 'America’s most-loved multi-cooker. Combines Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté pan, Yogurt Maker, and Food Warmer in one.',
    price: 9490,
    originalPrice: 13990,
    discountPercent: 32,
    rating: 4.8,
    reviewsCount: 9240,
    inStock: true,
    stockCount: 14,
    badge: 'Deal of the Day',
    deliveryEstimate: 'FREE Delivery Tomorrow, 12 PM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=80'
    ],
    features: [
      'Cooks meals up to 70% faster with smart microprocessor control',
      '13 one-touch customizable cooking programs for Indian curries, dal, and rice',
      'Fingerprint-resistant stainless-steel sides with dishwasher-safe lid',
      'Over 10 proven safety mechanisms including lid-lock and overheat protection'
    ],
    specifications: {
      'Capacity': '6 Litres',
      'Power': '1000 W (230V Indian standard plug)',
      'Inner Pot': 'Food-grade 304 (18/8) stainless steel',
      'Weight': '5.4 kg'
    },
    warranty: '2 Years Manufacturer Warranty',
    boxContents: ['Cooker base', 'Stainless steel inner pot', 'Steam rack with handles', 'Condensation collector', 'Manual'],
    weightKg: 5.4,
  },
  {
    id: 'prod-19',
    name: 'Philips Sonicare ProtectiveClean 4300 Rechargeable Electric Toothbrush',
    brand: 'Philips',
    category: 'Beauty & Care',
    description: 'Removes up to 7x more plaque than a manual toothbrush. Pressure sensor protects teeth and gums from excess brushing force with QuadPacer and Smartimer.',
    price: 3999,
    originalPrice: 5995,
    discountPercent: 33,
    rating: 4.6,
    reviewsCount: 4120,
    inStock: true,
    stockCount: 22,
    badge: 'Fast Delivery',
    deliveryEstimate: 'FREE Delivery Today by 5 PM',
    fastDeliveryHours: 5,
    thumbnail: 'https://images.unsplash.com/photo-1559591937-e1032397e59b?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1559591937-e1032397e59b?w=800&q=80'
    ],
    features: [
      'Up to 62,000 brush movements per minute sonic fluid action',
      'Pressure sensor pulses when pressing too hard',
      'BrushSync replacement reminder alerts when to replace brush head',
      '2-minute timer ensures dentist-recommended brushing time'
    ],
    specifications: {
      'Battery': 'Rechargeable Lithium-Ion (up to 2 weeks per charge)',
      'Modes': 'Clean and White',
      'Voltage': '110-220 V',
      'Color': 'Pastel Black'
    },
    warranty: '2-Year Worldwide Guarantee',
    boxContents: ['Toothbrush handle', 'Optimal Plaque Defence brush head', 'Compact charging base'],
    weightKg: 0.3,
  },
  {
    id: 'prod-20',
    name: 'Wildcraft 45L Trailblazer Adventure Rucksack Backpack',
    brand: 'Wildcraft',
    category: 'Sports & Fitness',
    description: 'Engineered for rugged mountain trails and long journeys. Features advanced ergonomic shoulder straps, padded lumbar support, and integrated rain cover.',
    price: 3499,
    originalPrice: 5999,
    discountPercent: 42,
    rating: 4.6,
    reviewsCount: 3840,
    inStock: true,
    stockCount: 18,
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
    ],
    features: [
      'Heavy-duty 420D ripstop polyester with water-resistant finish',
      'Ventilated back system with airflow mesh channels',
      'Dual walking pole attachment loops and hydration reservoir sleeve',
      'Bottom compartment for sleeping bag or muddy footwear'
    ],
    specifications: {
      'Capacity': '45 Litres',
      'Dimensions': '65 x 35 x 24 cm',
      'Weight': '1.1 kg',
      'Closure': 'Drawstring with top buckle hood'
    },
    warranty: '5 Years Domestic Warranty',
    boxContents: ['Rucksack with Waterproof High-Vis Rain Cover'],
    weightKg: 1.1,
  },
  {
    id: 'prod-21',
    name: 'Fossil Grant Chronograph Blue Dial Stainless Steel Watch',
    brand: 'Fossil',
    category: 'Accessories',
    description: 'Inspired by the simplicity of vintage timepieces. Roman numeral markers and three chronograph sub-dials give this watch a timeless formal presence.',
    price: 9495,
    originalPrice: 14995,
    discountPercent: 37,
    rating: 4.7,
    reviewsCount: 1950,
    inStock: true,
    stockCount: 12,
    badge: 'Trending',
    deliveryEstimate: 'FREE Delivery Tomorrow, 3 PM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80'
    ],
    features: [
      'Quartz Chronograph movement with 24-hour, 30-minute stopwatch',
      'Deep sunray blue dial with rose gold-tone Roman numeral indexes',
      'Stainless steel link bracelet with push-button deployant clasp',
      '5 ATM water resistant for everyday splashes'
    ],
    specifications: {
      'Case Size': '44 mm',
      'Band Width': '22 mm',
      'Glass': 'Scratch-resistant Mineral Crystal',
      'Case Material': 'Stainless Steel'
    },
    warranty: '2 Years International Warranty',
    boxContents: ['Watch', 'Fossil Collector Tin Box', 'Warranty Card'],
    weightKg: 0.28,
  },
  {
    id: 'prod-22',
    name: 'Sapiens: A Brief History of Humankind by Yuval Noah Harari',
    brand: 'Vintage Classics',
    category: 'Books',
    description: 'How did an unexceptional ape become the dominant species on planet Earth? A global phenomenon exploring 70,000 years of human evolution, cognition, and society.',
    price: 499,
    originalPrice: 899,
    discountPercent: 44,
    rating: 4.8,
    reviewsCount: 42100,
    inStock: true,
    stockCount: 85,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
    ],
    features: [
      'Over 25 million copies sold in 65 languages',
      'Recommended by Barack Obama and Bill Gates',
      'Covers Cognitive, Agricultural, and Scientific Revolutions',
      'Illustrated with 27 archival photographs and maps'
    ],
    specifications: {
      'Format': 'Paperback',
      'Pages': '512 pages',
      'Language': 'English',
      'Publisher': 'Vintage Classics'
    },
    warranty: 'Original Brand New Edition',
    boxContents: ['1 Book'],
    weightKg: 0.4,
  },
  {
    id: 'prod-23',
    name: 'Himalayan Native Raw Wild Honey (500g Jar, Unpasteurized)',
    brand: 'Himalayan Natives',
    category: 'Grocery',
    description: '100% pure and unprocessed multi-flora forest honey harvested from the pristine high-altitude valleys of the Himalayas. Retains natural enzymes and bee pollen.',
    price: 549,
    originalPrice: 750,
    discountPercent: 27,
    rating: 4.7,
    reviewsCount: 2890,
    inStock: true,
    stockCount: 35,
    badge: 'Fast Delivery',
    deliveryEstimate: 'FREE Delivery Today by 6 PM',
    fastDeliveryHours: 6,
    thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80'
    ],
    features: [
      'No added sugars, artificial syrups, or preservatives',
      'Cold-extracted to preserve active live enzymes and propolis',
      'Rich in antioxidants, natural vitamins, and minerals',
      'Glass jar packaging preserves organic freshness'
    ],
    specifications: {
      'Net Weight': '500 grams',
      'Container': 'Glass Jar',
      'Shelf Life': '18 Months',
      'Source': 'Himalayan Foothills'
    },
    warranty: 'FSSAI Certified 100% Pure Honey',
    boxContents: ['500g Glass Honey Jar'],
    weightKg: 0.75,
  },
  {
    id: 'prod-24',
    name: 'JBL Flip 6 Portable Waterproof Bluetooth Speaker (Midnight Black)',
    brand: 'JBL',
    category: 'Audio',
    description: 'Bold sound for every adventure. 2-way speaker system engineered for loud, crystal-clear, powerful sound with dual passive radiators and deep bass.',
    price: 9999,
    originalPrice: 13999,
    discountPercent: 29,
    rating: 4.7,
    reviewsCount: 7810,
    inStock: true,
    stockCount: 16,
    badge: 'Trending',
    deliveryEstimate: 'FREE Delivery Tomorrow, 11 AM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'
    ],
    features: [
      'IP67 waterproof and dustproof to pool, park, or beach',
      '12 Hours of playtime on a single charge',
      'PartyBoost allows pairing two JBL PartyBoost-compatible speakers',
      'USB-C charging protection alerts if water or salt is detected'
    ],
    specifications: {
      'Output Power': '20W RMS woofer + 10W RMS tweeter',
      'Frequency Response': '63 Hz - 20 kHz',
      'Bluetooth': 'v5.1',
      'Weight': '550 grams'
    },
    warranty: '1 Year Manufacturer Replacement Warranty',
    boxContents: ['JBL Flip 6', 'Type-C USB Cable', 'Quick Start Guide', 'Safety Sheet'],
    weightKg: 0.55,
  },
  {
    id: 'prod-25',
    name: 'Anker 737 Power Bank (PowerCore 24K, 140W 3-Port Portable Charger)',
    brand: 'Anker',
    category: 'Electronics',
    description: 'Ultra-powerful two-way charging with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the power bank or get a 140W ultra-powerful charge.',
    price: 11999,
    originalPrice: 14999,
    discountPercent: 20,
    rating: 4.9,
    reviewsCount: 3190,
    inStock: true,
    stockCount: 10,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1609592424364-94c979bf39d4?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1609592424364-94c979bf39d4?w=800&q=80'
    ],
    features: [
      '140W max output charges MacBook Pro 16" to 50% in 40 minutes',
      'Smart digital display shows output/input power and estimated time to full',
      '24,000mAh battery capacity juices iPhone 14 nearly 5 times',
      'ActiveShield 2.0 temperature monitoring safeguards connected gear'
    ],
    specifications: {
      'Capacity': '24,000 mAh',
      'Ports': '2 x USB-C + 1 x USB-A',
      'Max Output': '140 W PD 3.1',
      'Weight': '630 g'
    },
    warranty: '24 Months Hassle-Free Brand Warranty',
    boxContents: ['Power Bank', '140W USB-C to USB-C cable (2ft)', 'Welcome guide'],
    weightKg: 0.63,
  },
  {
    id: 'prod-26',
    name: 'Maybelline New York Super Stay Matte Ink Liquid Lipstick (Pioneer)',
    brand: 'Maybelline',
    category: 'Beauty & Care',
    description: 'Ink your lips in up to 16 hours of saturated liquid matte. Features a unique arrow applicator for precise application and flawless high-pigment finish.',
    price: 489,
    originalPrice: 699,
    discountPercent: 30,
    rating: 4.5,
    reviewsCount: 18200,
    inStock: true,
    stockCount: 60,
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80'
    ],
    features: [
      'Transfer-proof, smudge-proof, and waterproof wear',
      'High-impact matte pigment glides on in one stroke',
      'Arrow reservoir tip contours lips with razor accuracy',
      'Dermatologically tested and non-drying'
    ],
    specifications: {
      'Finish': 'Matte',
      'Duration': 'Up to 16 Hours',
      'Volume': '5 ml',
      'Shade': '20 Pioneer (True Red)'
    },
    warranty: '100% Genuine and Authentic Sealed Stock',
    boxContents: ['1 Liquid Lipstick Tube'],
    weightKg: 0.05,
  },
  {
    id: 'prod-27',
    name: 'Zara Men’s Textured Knit Bomber Jacket (Charcoal Gray)',
    brand: 'Zara',
    category: 'Fashion',
    description: 'Relaxed knit bomber jacket featuring a ribbed baseball collar, long sleeves with elastic cuffs, front welt pockets, and a metal zip front closure.',
    price: 4990,
    originalPrice: 6990,
    discountPercent: 29,
    rating: 4.6,
    reviewsCount: 840,
    inStock: true,
    stockCount: 7,
    badge: 'Trending',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'
    ],
    features: [
      'Soft heavy-gauge textured cotton-blend knit',
      'Antiqued gunmetal dual-way front zipper',
      'Ribbed collar and waist hem prevent cold air infiltration',
      'Minimalist tailored silhouette suitable for work and leisure'
    ],
    specifications: {
      'Material': '68% Cotton, 32% Recycled Polyester',
      'Care': 'Machine Wash Mild at 30°C',
      'Collar': 'Bomber Ribbed',
      'Color': 'Charcoal Melange'
    },
    warranty: 'Original Brand Quality Inspection Guaranteed',
    boxContents: ['1 Bomber Jacket'],
    weightKg: 0.7,
  },
  {
    id: 'prod-28',
    name: 'Bellroy Classic Leather Pocket Backpack (20L - Black)',
    brand: 'Bellroy',
    category: 'Accessories',
    description: 'An understated everyday companion crafted from water-resistant recycled fabrics and eco-tanned leather. Holds up to a 16” laptop with suspended protection.',
    price: 13900,
    originalPrice: 16900,
    discountPercent: 18,
    rating: 4.8,
    reviewsCount: 1120,
    inStock: true,
    stockCount: 5,
    deliveryEstimate: 'FREE Delivery Tomorrow, 2 PM',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&q=80'
    ],
    features: [
      'Padded laptop sleeve fits up to 16” MacBook Pro',
      'Internal zip mesh pocket with pen slip and key clip',
      'Quick-access valuables top pocket with water-resistant zipper',
      'Contoured back panel and soft padded shoulder straps'
    ],
    specifications: {
      'Capacity': '20 Litres',
      'Dimensions': '45 x 32 x 18 cm',
      'Weight': '750 g',
      'Materials': 'Durable woven polyester & premium environmentally certified leather'
    },
    warranty: '3-Year Bellroy International Warranty',
    boxContents: ['1 Bellroy Classic Backpack with dustbag'],
    weightKg: 0.75,
  },
  {
    id: 'prod-29',
    name: 'Casio G-Shock GA-2100 "CasiOak" Carbon Core Guard Watch',
    brand: 'Casio',
    category: 'Accessories',
    description: 'The ultra-popular octagonal bezel G-Shock with Carbon Core Guard structure. Unmatched 200m shock and water resistance in an impressively slim 11.8mm case.',
    price: 7995,
    originalPrice: 9495,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 6540,
    inStock: true,
    stockCount: 19,
    badge: 'Best Seller',
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'
    ],
    features: [
      'Carbon Core Guard internal frame resists extreme impacts',
      'Double LED Super Illuminator light for easy night reading',
      'World Time across 31 time zones (48 cities + UTC)',
      '1/100-second stopwatch and 5 daily alarms'
    ],
    specifications: {
      'Water Resistance': '200 Meters / 20 Bar',
      'Battery Life': 'Approx. 3 Years on SR726W x 2',
      'Case Thickness': '11.8 mm',
      'Weight': '51 g'
    },
    warranty: '2 Years Manufacturer Warranty',
    boxContents: ['Casio G-Shock Watch', 'G-Shock Hexagonal Metal Tin', 'Manual & Warranty Card'],
    weightKg: 0.25,
  },
  {
    id: 'prod-30',
    name: 'Philips Hue White & Color Ambiance Smart LED Starter Kit',
    brand: 'Philips',
    category: 'Home & Kitchen',
    description: 'Transform your living space with 16 million colors and shades of white. Includes 3 smart LED bulbs and the Philips Hue Bridge for automated whole-home sync.',
    price: 11499,
    originalPrice: 14990,
    discountPercent: 23,
    rating: 4.7,
    reviewsCount: 2410,
    inStock: true,
    stockCount: 8,
    deliveryEstimate: 'FREE Delivery Tomorrow',
    fastDeliveryHours: 24,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'
    ],
    features: [
      '16 Million colors and synced entertainment lighting with Spotify & games',
      'Control via Alexa, Google Assistant, and Apple HomeKit Siri voice commands',
      'Automate sleep and wake timers with natural circadian rhythms',
      'Hue Bridge supports up to 50 lights across your house'
    ],
    specifications: {
      'Base Fitting': 'E27 / B22 included adapters',
      'Brightness': '1100 Lumens (75W equivalent) per bulb',
      'Lifetime': '25,000 Hours',
      'Color Temperature': '2000K - 6500K + 16M Colors'
    },
    warranty: '2 Years Philips India Warranty',
    boxContents: ['3 x Hue Smart Bulbs', '1 x Hue Bridge Hub', 'Ethernet Cable', 'Power Adapter'],
    weightKg: 0.9,
  }
];

export const SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Yash Pandey',
    phone: '+91 98290 14820',
    street: 'Flat 402, Royal Palms Heights, Tonk Road',
    landmark: 'Near Gandhi Nagar Railway Station',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302015',
    type: 'Home',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Yash Pandey (Office)',
    phone: '+91 98290 14820',
    street: 'SwiftTech Labs, 5th Floor, World Trade Park, Malviya Nagar',
    landmark: 'South Block Gate 2',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302017',
    type: 'Office',
    isDefault: false,
  },
  {
    id: 'addr-3',
    name: 'Aarav Pandey',
    phone: '+91 98112 34910',
    street: 'B-14, Connaught Place, Inner Circle',
    landmark: 'Opposite Central Park Gate 3',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    type: 'Other',
    isDefault: false,
  }
];

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'standard',
    title: 'FREE Standard Delivery',
    description: 'Delivered tomorrow between 10:00 AM – 6:00 PM',
    estimatedTime: 'Tomorrow, by 5:00 PM',
    price: 0,
    badge: 'Smart Dispatch',
  },
  {
    id: 'express',
    title: 'SwiftRush Express Delivery',
    description: 'Guaranteed priority dispatch within 4 hours today',
    estimatedTime: 'Today, within 4 hours',
    price: 99,
    badge: '⚡ Fastest Delivery',
  },
  {
    id: 'scheduled',
    title: 'Scheduled Slot Delivery',
    description: 'Choose your preferred convenient delivery window',
    estimatedTime: 'Tomorrow, Evening (6 PM – 9 PM)',
    price: 49,
    badge: 'Zero Waiting',
  }
];

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'SC-102849',
    trackingNumber: 'SWIFT-9482-JPR',
    createdAt: '2026-09-10T02:15:00.000Z',
    items: [
      { product: PRODUCTS_DATABASE[0], quantity: 1 }
    ],
    subtotal: 26990,
    deliveryFee: 0,
    discount: 1000,
    couponCode: 'SWIFTFEST1000',
    total: 25990,
    address: SAVED_ADDRESSES[0],
    deliveryOption: DELIVERY_OPTIONS[0],
    paymentDetails: {
      method: 'upi',
      upiId: 'yashpandey@oksbi'
    },
    status: 'out_for_delivery',
    expectedDelivery: 'Today, 4:45 PM',
    deliveryOtp: '4821',
    courier: {
      name: 'Rahul Kumar',
      phone: '+91 98291 55210',
      rating: 4.9,
      vehicleModel: 'Tata Ace EV Electric Van',
      vehicleNumber: 'RJ-14-AB-1024',
      vehicleType: 'Electric Van',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
    },
    currentLocation: {
      lat: 26.8851,
      lng: 75.8118,
      description: 'C-Scheme Delivery Hub → Tonk Road Sector 4 Corridor',
      distanceRemainingKm: 2.4,
      etaMinutes: 12
    },
    optimizedRouteInfo: {
      hubName: 'Jaipur Central Fulfilment Hub (JPR-01)',
      distanceKm: 8.6,
      savingsMinutes: 18,
      routeEfficiency: '96% Optimal Path'
    },
    timeline: [
      {
        status: 'processing',
        title: 'Order Confirmed',
        description: 'Payment verified and order registered at Jaipur Fulfillment Hub.',
        timestamp: '10 Sep 2026, 07:30 AM',
        completed: true,
        location: 'Jaipur Central Fulfillment Center'
      },
      {
        status: 'packed',
        title: 'Package Packed',
        description: 'Item securely boxed with eco-friendly protective cushioning and barcoded.',
        timestamp: '10 Sep 2026, 09:15 AM',
        completed: true,
        location: 'Jaipur Sorting Center (Bay 4)'
      },
      {
        status: 'shipped',
        title: 'Dispatched from Hub',
        description: 'Package routed onto express courier corridor.',
        timestamp: '10 Sep 2026, 11:45 AM',
        completed: true,
        location: 'Express Transit Bay'
      },
      {
        status: 'hub_arrival',
        title: 'Arrived at Local Station',
        description: 'Received at Tonk Road Last-Mile Delivery Hub.',
        timestamp: '10 Sep 2026, 01:20 PM',
        completed: true,
        location: 'Tonk Road Delivery Station'
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier Rahul Kumar is delivering your package in Tata Ace EV (RJ-14-AB-1024).',
        timestamp: '10 Sep 2026, 03:30 PM',
        completed: true,
        active: true,
        location: '2.4 km away from your doorstep'
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Package will be handed over upon presenting OTP 4821.',
        timestamp: 'Expected today by 4:45 PM',
        completed: false
      }
    ]
  },
  {
    id: 'SC-102715',
    trackingNumber: 'SWIFT-8831-DEL',
    createdAt: '2026-09-08T10:20:00.000Z',
    items: [
      { product: PRODUCTS_DATABASE[3], quantity: 1 },
      { product: PRODUCTS_DATABASE[4], quantity: 1 }
    ],
    subtotal: 10494,
    deliveryFee: 0,
    discount: 500,
    total: 9994,
    address: SAVED_ADDRESSES[1],
    deliveryOption: DELIVERY_OPTIONS[0],
    paymentDetails: {
      method: 'card',
      cardNumber: '•••• •••• •••• 4092',
      cardName: 'Yash Pandey'
    },
    status: 'delivered',
    expectedDelivery: 'Delivered on 09 Sep 2026, 03:15 PM',
    deliveryOtp: '8912',
    courier: {
      name: 'Vikram Singh',
      phone: '+91 98293 88129',
      rating: 4.8,
      vehicleModel: 'Mahindra Bolero Maxi Truck',
      vehicleNumber: 'RJ-14-GH-4921',
      vehicleType: 'Delivery Van',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
    },
    timeline: [
      {
        status: 'processing',
        title: 'Order Confirmed',
        description: 'Payment authorized successfully.',
        timestamp: '08 Sep 2026, 10:20 AM',
        completed: true
      },
      {
        status: 'packed',
        title: 'Package Packed',
        description: 'Items scanned and packed into tamper-proof bag.',
        timestamp: '08 Sep 2026, 02:40 PM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Shipped',
        description: 'In transit to destination city corridor.',
        timestamp: '08 Sep 2026, 06:10 PM',
        completed: true
      },
      {
        status: 'hub_arrival',
        title: 'Arrived at Delivery Station',
        description: 'Processed through automated sorting conveyor.',
        timestamp: '09 Sep 2026, 08:30 AM',
        completed: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Delivery partner Vikram Singh en route.',
        timestamp: '09 Sep 2026, 11:15 AM',
        completed: true
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Delivered to resident with digital OTP verification.',
        timestamp: '09 Sep 2026, 03:15 PM',
        completed: true
      }
    ]
  },
  {
    id: 'SC-102601',
    trackingNumber: 'SWIFT-7201-BOM',
    createdAt: '2026-09-09T18:45:00.000Z',
    items: [
      { product: PRODUCTS_DATABASE[5], quantity: 1 }
    ],
    subtotal: 7995,
    deliveryFee: 0,
    discount: 0,
    total: 7995,
    address: SAVED_ADDRESSES[0],
    deliveryOption: DELIVERY_OPTIONS[1],
    paymentDetails: {
      method: 'upi',
      upiId: 'yashpandey@oksbi'
    },
    status: 'shipped',
    expectedDelivery: 'Tomorrow by 11:00 AM',
    deliveryOtp: '7192',
    courier: {
      name: 'Amit Patel',
      phone: '+91 98450 11920',
      rating: 4.9,
      vehicleModel: 'Ather 450X Electric Scooter',
      vehicleNumber: 'RJ-14-XY-8812',
      vehicleType: 'Motorbike',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'
    },
    timeline: [
      {
        status: 'processing',
        title: 'Order Confirmed',
        description: 'Order registered and inventory reserved.',
        timestamp: '09 Sep 2026, 06:45 PM',
        completed: true
      },
      {
        status: 'packed',
        title: 'Package Packed',
        description: 'Packed at Regional Sports Fulfilment Hub.',
        timestamp: '10 Sep 2026, 01:00 AM',
        completed: true
      },
      {
        status: 'shipped',
        title: 'Dispatched on Express Highway',
        description: 'Departed via autonomous optimized highway linehaul.',
        timestamp: '10 Sep 2026, 04:30 AM',
        completed: true,
        active: true
      },
      {
        status: 'hub_arrival',
        title: 'Local Hub Arrival',
        description: 'Estimated at local station by 08:00 AM.',
        timestamp: 'Pending',
        completed: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Priority morning dispatch.',
        timestamp: 'Pending',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Delivery to your doorstep.',
        timestamp: 'Tomorrow, 11:00 AM',
        completed: false
      }
    ]
  },
  {
    id: 'SC-102550',
    trackingNumber: 'SWIFT-6411-BLR',
    createdAt: '2026-09-10T01:00:00.000Z',
    items: [
      { product: PRODUCTS_DATABASE[11], quantity: 2 },
      { product: PRODUCTS_DATABASE[15], quantity: 1 }
    ],
    subtotal: 2197,
    deliveryFee: 0,
    discount: 200,
    total: 1997,
    address: SAVED_ADDRESSES[0],
    deliveryOption: DELIVERY_OPTIONS[0],
    paymentDetails: {
      method: 'cod'
    },
    status: 'processing',
    expectedDelivery: 'Tomorrow, 5:00 PM',
    deliveryOtp: '3301',
    timeline: [
      {
        status: 'processing',
        title: 'Order Confirmed',
        description: 'Order placed via Cash on Delivery. Order allocation in progress.',
        timestamp: '10 Sep 2026, 01:00 AM',
        completed: true,
        active: true
      },
      {
        status: 'packed',
        title: 'Packing in Progress',
        description: 'Automated warehouse robot picking items.',
        timestamp: 'Expected 10 Sep 2026, 08:00 AM',
        completed: false
      },
      {
        status: 'shipped',
        title: 'Dispatch',
        description: 'Will be routed to last-mile station.',
        timestamp: 'Pending',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Pay ₹1,997 on delivery by cash or UPI QR.',
        timestamp: 'Tomorrow, 5:00 PM',
        completed: false
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif-1',
    title: 'Out for Delivery: Order #SC-102849',
    message: 'Rahul Kumar is on the way with your Sony WH-1000XM5. Share OTP 4821 upon delivery.',
    timestamp: '12 minutes ago',
    read: false,
    type: 'delivery',
    orderId: 'SC-102849'
  },
  {
    id: 'notif-2',
    title: 'Flash Sale: 40% Off Electronics',
    message: 'Exclusive 24-hour deals on premium audio and smart gadgets just unlocked!',
    timestamp: '2 hours ago',
    read: false,
    type: 'offer'
  },
  {
    id: 'notif-3',
    title: 'Order Delivered Successfully',
    message: 'Order #SC-102715 was delivered to Flat 402, Royal Palms Heights. How was your experience?',
    timestamp: 'Yesterday',
    read: true,
    type: 'order',
    orderId: 'SC-102715'
  },
  {
    id: 'notif-4',
    title: 'Package Shipped #SC-102601',
    message: 'Your Nike Pegasus 40 has been dispatched via Express corridor and is en route.',
    timestamp: '1 day ago',
    read: true,
    type: 'order',
    orderId: 'SC-102601'
  }
];

export const INITIAL_USER_PROFILE: CustomerProfile = {
  id: 'cust-yash-01',
  name: 'Yash Pandey',
  email: 'pandeyyyash2025@gmail.com',
  phone: '+91 98290 14820',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  addresses: SAVED_ADDRESSES,
  membershipTier: 'Prime Member',
  joinedDate: 'October 2024',
  savedCardsCount: 2,
  totalOrdersCount: 14
};

// Aliases for convenient importing across UI components
export const SAMPLE_PRODUCTS = PRODUCTS_DATABASE;
export const DEFAULT_ORDERS = INITIAL_ORDERS;
export const DEFAULT_PROFILE = INITIAL_USER_PROFILE;
export const DEFAULT_ADDRESSES = SAVED_ADDRESSES;
export const DEFAULT_NOTIFICATIONS = INITIAL_NOTIFICATIONS;

