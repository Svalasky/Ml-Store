-- ==============================================================================
-- MOLE STORE - SEED DATA FOR DEVELOPMENT & INITIAL LAUNCH
-- ==============================================================================

-- 1. STORE SETTINGS
INSERT INTO public.store_settings (
    id,
    store_name,
    description,
    logo_url,
    whatsapp_number,
    whatsapp_message,
    instagram_url,
    tiktok_url,
    telegram_url,
    email
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Mole Store',
    'Platform penyedia akun digital streaming, game, AI tools, dan software resmi terpercaya di Indonesia.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    '6281234567890',
    'Halo Admin Mole Store, saya ingin memesan...',
    'https://instagram.com/molestore',
    'https://tiktok.com/@molestore',
    'https://t.me/molestore',
    'support@molestore.com'
) ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    whatsapp_number = EXCLUDED.whatsapp_number;

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, active) VALUES
('c1000000-0000-0000-0000-000000000001', 'Streaming Film & TV', 'streaming', 'Akun premium Netflix, Disney+, HBO, YouTube Premium, Prime Video dengan garansi penuh.', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', true),
('c1000000-0000-0000-0000-000000000002', 'Music & Audio', 'music', 'Langganan Spotify Premium, Apple Music, Tidal, Deezer bebas iklan kualitas ultra HD.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', true),
('c1000000-0000-0000-0000-000000000003', 'AI & Productivity Tools', 'ai-tools', 'Akses ChatGPT Plus, Claude Pro, Midjourney, Canva Pro, Perplexity Pro untuk produktivitas.', 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80', true),
('c1000000-0000-0000-0000-000000000004', 'Gaming & Voucher', 'gaming', 'Akun Game Steam, Discord Nitro, Valorant Points, Roblox Robux, PlayStation Plus legal.', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80', true),
('c1000000-0000-0000-0000-000000000005', 'Software, VPN & Cloud', 'software-vpn', 'Lisensi Windows 11 Pro, Office 365, ExpressVPN, NordVPN, Google One 2TB harga murah.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 3. PRODUCTS
INSERT INTO public.products (
    id, name, slug, category_id, description, short_description, image_url, price, original_price, status, featured, duration, terms
) VALUES
(
    'p1000000-0000-0000-0000-000000000001',
    'Netflix Premium 4K Ultra HD',
    'netflix-premium-4k',
    'c1000000-0000-0000-0000-000000000001',
    'Nikmati ribuan film dan series original Netflix dengan kualitas terbaik 4K Ultra HD + HDR. Support download offline, profil private dengan PIN, anti-on hold dan garansi replace 100% selama masa aktif.',
    'Akun Netflix Premium kualitas 4K UHD Ultra HDR dengan garansi penuh.',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    35000,
    54000,
    'available',
    true,
    '1 Bulan',
    '1 User 1 Device, Jangan ganti password, Garansi replace 100%'
),
(
    'p1000000-0000-0000-0000-000000000002',
    'Spotify Premium Individual & Family Plan',
    'spotify-premium',
    'c1000000-0000-0000-0000-000000000002',
    'Dengarkan jutaan lagu tanpa iklan dengan audio lossless kualitas tertinggi. Bisa download lagu offline dan putar di mana saja. Bisa menggunakan akun lama Anda atau akun baru dari kami.',
    'Langganan Spotify Premium bebas iklan kualitas audio master.',
    'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&auto=format&fit=crop&q=80',
    18000,
    30000,
    'available',
    true,
    '1 Bulan',
    'Bisa akun sendiri, Bebas iklan, Garansi full durasi'
),
(
    'p1000000-0000-0000-0000-000000000003',
    'ChatGPT Plus (GPT-4o & Canvas Access)',
    'chatgpt-plus',
    'c1000000-0000-0000-0000-000000000003',
    'Akses kecerdasan buatan paling canggih dari OpenAI. Termasuk GPT-4o, DALL-E 3 image generator, Advanced Voice Mode, Web Browsing, dan Custom GPTs tanpa antrean.',
    'Akun ChatGPT Plus resmi dengan GPT-4o, Canvas, dan Voice Mode.',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    65000,
    315000,
    'available',
    true,
    '1 Bulan',
    'Private Profile / Shared slot, Bebas login, Full Warranty'
),
(
    'p1000000-0000-0000-0000-000000000004',
    'YouTube Premium + YouTube Music',
    'youtube-premium',
    'c1000000-0000-0000-0000-000000000001',
    'Nonton video YouTube tanpa interupsi iklan, bisa background play saat layar mati, dan bonus gratis YouTube Music Premium. Langsung via email pribadi Anda.',
    'Nonton video tanpa iklan, picture-in-picture, dan YouTube Music gratis.',
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    15000,
    25000,
    'available',
    true,
    '1 Bulan',
    'Menggunakan email pribadi pembeli, Tidak butuh password email'
),
(
    'p1000000-0000-0000-0000-000000000005',
    'Canva Pro Lifetime / Edu Plan',
    'canva-pro',
    'c1000000-0000-0000-0000-000000000003',
    'Akses 100+ juta template grafis premium, foto stock, font berlisensi, magic AI eraser, background remover, dan export resolusi tinggi format SVG/PDF.',
    'Akses Canva Pro dengan jutaan template premium dan AI Magic Studio.',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    25000,
    150000,
    'available',
    true,
    '1 Tahun / Lifetime',
    'Invite via email pribadi, Cloud storage 100GB, Full Garansi'
),
(
    'p1000000-0000-0000-0000-000000000006',
    'Discord Nitro 3 Months Full Boost',
    'discord-nitro',
    'c1000000-0000-0000-0000-000000000004',
    'Dapatkan 2 Server Boosts, custom avatar GIF, custom emoji & stickers global, streaming HD 1080p 60FPS, dan badge profile eksklusif.',
    'Discord Nitro lengkap dengan Server Boosts dan fitur custom profil.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    45000,
    140000,
    'available',
    false,
    '3 Bulan',
    'Via link claim resmi, Hanya untuk akun yang belum pernah langganan Nitro'
),
(
    'p1000000-0000-0000-0000-000000000007',
    'Disney+ Hotstar Premium',
    'disney-hotstar',
    'c1000000-0000-0000-0000-000000000001',
    'Nonton film blockbuster Marvel, Disney, Pixar, Star Wars, National Geographic, dan serial lokal Indonesia kualitas 4K UHD.',
    'Streaming film blockbuster Marvel, Disney, dan serial eksklusif.',
    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
    25000,
    45000,
    'available',
    false,
    '1 Bulan',
    'Login via nomor HP / OTP, Garansi replace 100%'
),
(
    'p1000000-0000-0000-0000-000000000008',
    'Midjourney Pro Fast Hours AI Image',
    'midjourney-pro',
    'c1000000-0000-0000-0000-000000000003',
    'Generator gambar AI terbaik di dunia. Dapatkan akses ke Fast GPU hours, stealth mode, relax mode unlimited, dan hak komersial penuh atas gambar.',
    'AI generator visual hyper-realistic paling populer di dunia.',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    85000,
    450000,
    'available',
    false,
    '1 Bulan',
    'Shared server slot / private, Fast Generation, Garansi replace'
),
(
    'p1000000-0000-0000-0000-000000000009',
    'NordVPN & ExpressVPN Premium',
    'nordvpn-premium',
    'c1000000-0000-0000-0000-000000000005',
    'VPN keamanan tinggi dengan 5000+ server di seluruh dunia. Kecepatan ultra tinggi, proteksi malware, anti-tracking, dan bypass blocking konten internasional.',
    'Koneksi internet aman, anonim, dan bypass restriction konten global.',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    30000,
    120000,
    'available',
    false,
    '1 Tahun',
    'Multi device support, High Speed servers, Garansi 1 tahun penuh'
),
(
    'p1000000-0000-0000-0000-000000000010',
    'GitHub Copilot Developer Plan',
    'github-copilot',
    'c1000000-0000-0000-0000-000000000003',
    'AI coding assistant pintar dari GitHub & OpenAI. Autocomplete baris kode otomatis di VS Code, JetBrains, Neovim, dan debugging cepat.',
    'AI pair programmer cerdas untuk developer software.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    50000,
    150000,
    'available',
    false,
    '3 Bulan',
    'Invite ke akun GitHub pribadi, Support VS Code, IntelliJ, etc.'
)
ON CONFLICT (id) DO NOTHING;

-- 4. PRODUCT VARIANTS
INSERT INTO public.product_variants (
    id, product_id, name, description, price, original_price, duration, stock, status
) VALUES
-- Netflix Variants
('v1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', '1 Bulan (1 Profile Private)', '1 User 1 Device, 4K UHD, Bebas pasang PIN', 35000, 54000, '1 Bulan', 50, 'available'),
('v1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', '3 Bulan (1 Profile Private)', 'Hemat 15%, garansi replace 3 bulan penuh', 95000, 162000, '3 Bulan', 30, 'available'),
('v1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000001', '1 Bulan (Full 1 Akun 5 Profile)', 'Bisa dipakai sekeluarga/teman (5 Profile bebas)', 160000, 186000, '1 Bulan', 15, 'available'),

-- Spotify Variants
('v1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000002', '1 Bulan Plan', 'Bisa akun lama atau akun baru, garansi full', 18000, 30000, '1 Bulan', 80, 'available'),
('v1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000002', '3 Bulan Plan', 'Durasi panjang tanpa ribet perpanjang', 45000, 90000, '3 Bulan', 40, 'available'),
('v1000000-0000-0000-0000-000000000006', 'p1000000-0000-0000-0000-000000000002', '1 Tahun Individual Plan', 'Paket hemat 1 tahun penuh tanpa gangguan', 150000, 360000, '1 Tahun', 20, 'available'),

-- ChatGPT Plus Variants
('v1000000-0000-0000-0000-000000000007', 'p1000000-0000-0000-0000-000000000003', '1 Bulan Shared User', 'Slot terkelola, akses GPT-4o & DALL-E', 65000, 315000, '1 Bulan', 25, 'available'),
('v1000000-0000-0000-0000-000000000008', 'p1000000-0000-0000-0000-000000000003', '1 Bulan Private Akun', 'Full akses 1 akun milik sendiri, ganti password bebas', 280000, 340000, '1 Bulan', 10, 'available'),

-- YouTube Premium Variants
('v1000000-0000-0000-0000-000000000009', 'p1000000-0000-0000-0000-000000000004', '1 Bulan Family Invite', 'Invite ke email pribadi tanpa password', 15000, 25000, '1 Bulan', 100, 'available'),
('v1000000-0000-0000-0000-000000000010', 'p1000000-0000-0000-0000-000000000004', '3 Bulan Family Invite', 'Invite 3 bulan langsung hemat waktu', 38000, 75000, '3 Bulan', 50, 'available'),

-- Canva Pro Variants
('v1000000-0000-0000-0000-000000000011', 'p1000000-0000-0000-0000-000000000005', '1 Tahun Edu Invite', 'Akses fitur Pro lengkap 1 tahun penuh', 25000, 150000, '1 Tahun', 99, 'available'),
('v1000000-0000-0000-0000-000000000012', 'p1000000-0000-0000-0000-000000000005', 'Lifetime Pro Access', 'Akses seumur hidup garansi 1 tahun', 45000, 300000, 'Lifetime', 50, 'available')
ON CONFLICT (id) DO NOTHING;

-- 5. INVENTORY
INSERT INTO public.inventory (variant_id, quantity, reserved_quantity)
SELECT id, stock, 0 FROM public.product_variants
ON CONFLICT (variant_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- 6. BANNERS
INSERT INTO public.banners (id, title, description, image_url, button_text, button_url, active, sort_order) VALUES
(
    'b1000000-0000-0000-0000-000000000001',
    'Mega Promo Akun Premium Streaming & AI',
    'Dapatkan diskon hingga 70% untuk Netflix, Spotify, ChatGPT Plus, dan Canva Pro resmi bergaransi.',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&auto=format&fit=crop&q=80',
    'Lihat Promo',
    '/products',
    true,
    1
),
(
    'b1000000-0000-0000-0000-000000000002',
    'Akun AI & Produktivitas Siap Pakai',
    'Upgrade cara kerja kamu dengan ChatGPT-4o, Midjourney Pro, dan GitHub Copilot tanpa ribet.',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
    'Jelajahi AI Tools',
    '/products?category=ai-tools',
    true,
    2
),
(
    'b1000000-0000-0000-0000-000000000003',
    '100% Legal, Aman & Bergaransi Replace',
    'Layanan ramah 24/7 dan proses pengiriman cepat kurang dari 5 menit via WhatsApp.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    'Pesan Sekarang',
    '/products',
    true,
    3
)
ON CONFLICT (id) DO NOTHING;

-- 7. TESTIMONIALS
INSERT INTO public.testimonials (id, customer_name, rating, message, image_url, active) VALUES
('t1000000-0000-0000-0000-000000000001', 'Dimas Pratama', 5, 'Prosesnya super kilat! Beli Netflix 1 bulan langsung aktif dalam 3 menit. Profil bersih dan 4K jalan lancar di Smart TV.', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80', true),
('t1000000-0000-0000-0000-000000000002', 'Siti Rahmawati', 5, 'Canva Pro-nya langsung masuk ke email pribadi saya. Semua template kebuka dan magic eraser-nya ngebantu banget kerjaan desain.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', true),
('t1000000-0000-0000-0000-000000000003', 'Rian Hidayat', 5, 'ChatGPT Plus mantap, GPT-4o kencang tanpa limit antrean. Admin ramah dan responsif saat tanya-tanya panduan login.', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80', true),
('t1000000-0000-0000-0000-000000000004', 'Nadya Putri', 5, 'Langganan Spotify 1 tahun di Mole Store jauh lebih hemat dibanding bayar bulanan. Sudah 4 bulan jalan aman tanpa kendala.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80', true),
('t1000000-0000-0000-0000-000000000005', 'Faisal Akbar', 5, 'Recommended seller untuk akun digital legal. Fast response, ada invoice jelas, dan garansi benar-benar dipertanggungjawabkan.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 8. PROMOTIONS
INSERT INTO public.promotions (name, code, discount_type, discount_value, minimum_purchase, active) VALUES
('Promo Launching', 'MOLELAUNCH', 'percentage', 10, 30000, true),
('Diskon Pengguna Baru', 'HEMAT10K', 'fixed', 10000, 50000, true)
ON CONFLICT (id) DO NOTHING;

-- 9. SAMPLE CUSTOMERS & ORDERS
INSERT INTO public.customers (id, name, whatsapp_number, email) VALUES
('u1000000-0000-0000-0000-000000000001', 'Budi Santoso', '6281298765432', 'budi.santoso@gmail.com'),
('u1000000-0000-0000-0000-000000000002', 'Ayu Lestari', '6285712345678', 'ayu.lestari@gmail.com'),
('u1000000-0000-0000-0000-000000000003', 'Hendra Wijaya', '6287890123456', 'hendra.w@yahoo.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (
    id, order_number, customer_id, subtotal, discount, total, status, payment_status, payment_method, customer_note, admin_note, created_at
) VALUES
(
    'o1000000-0000-0000-0000-000000000001',
    'ORD-20260925-0001',
    'u1000000-0000-0000-0000-000000000001',
    35000,
    0,
    35000,
    'completed',
    'paid',
    'whatsapp',
    'Tolong kirimkan akun untuk TV ya kak',
    'Akun Netflix Profile #3 terkirim via WhatsApp',
    NOW() - INTERVAL '3 hours'
),
(
    'o1000000-0000-0000-0000-000000000002',
    'ORD-20260925-0002',
    'u1000000-0000-0000-0000-000000000002',
    65000,
    0,
    65000,
    'processing',
    'paid',
    'manual_transfer',
    'ChatGPT Plus untuk skripsi',
    'Sudah diverifikasi pembayaran BCA Rp65.000',
    NOW() - INTERVAL '1 hour'
),
(
    'o1000000-0000-0000-0000-000000000003',
    'ORD-20260925-0003',
    'u1000000-0000-0000-0000-000000000003',
    25000,
    0,
    25000,
    'pending',
    'unpaid',
    'whatsapp',
    'Mohon diproses via QRIS',
    NULL,
    NOW() - INTERVAL '15 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (
    id, order_id, product_id, variant_id, product_name, variant_name, price, quantity, subtotal
) VALUES
('i1000000-0000-0000-0000-000000000001', 'o1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001', 'Netflix Premium 4K Ultra HD', '1 Bulan (1 Profile Private)', 35000, 1, 35000),
('i1000000-0000-0000-0000-000000000002', 'o1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000007', 'ChatGPT Plus (GPT-4o & Canvas Access)', '1 Bulan Shared User', 65000, 1, 65000),
('i1000000-0000-0000-0000-000000000003', 'o1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000005', 'v1000000-0000-0000-0000-000000000011', 'Canva Pro Lifetime / Edu Plan', '1 Tahun Edu Invite', 25000, 1, 25000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_status_history (
    order_id, old_status, new_status, note, created_at
) VALUES
('o1000000-0000-0000-0000-000000000001', NULL, 'pending', 'Pesanan dibuat via WhatsApp', NOW() - INTERVAL '3 hours'),
('o1000000-0000-0000-0000-000000000001', 'pending', 'paid', 'Pembayaran diterima via QRIS', NOW() - INTERVAL '2 hours 55 minutes'),
('o1000000-0000-0000-0000-000000000001', 'paid', 'completed', 'Akun Netflix dan PIN berhasil dikirim ke pelanggan', NOW() - INTERVAL '2 hours 50 minutes'),
('o1000000-0000-0000-0000-000000000002', NULL, 'pending', 'Pesanan dibuat via WhatsApp', NOW() - INTERVAL '1 hour'),
('o1000000-0000-0000-0000-000000000002', 'pending', 'paid', 'Pembayaran terverifikasi', NOW() - INTERVAL '50 minutes'),
('o1000000-0000-0000-0000-000000000002', 'paid', 'processing', 'Menyiapkan akun ChatGPT Plus', NOW() - INTERVAL '40 minutes'),
('o1000000-0000-0000-0000-000000000003', NULL, 'pending', 'Pesanan dibuat via WhatsApp', NOW() - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;
