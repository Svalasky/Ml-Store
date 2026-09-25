# Mole Store - Digital Account E-Commerce Platform

Platform website e-commerce modern dan profesional khusus untuk bisnis penjualan akun digital (streaming, game, AI tools, VPN, lisensi software) dengan sistem penjualan langsung berbasis **WhatsApp Sales Funnel**.

---

## 🌟 Fitur Utama

### 🛒 Customer Storefront
- **Modern & Responsive UI**: Desain bersih, kontras tinggi, typography modern, dan mobile-first (optimal di HP 360px–390px, tablet, hingga desktop).
- **Hero Section**: Dilengkapi call-to-action (CTA) interaktif, metric counter, dan nilai kepercayaan toko.
- **Katalog Produk & Filter Pintar**:
  - Pencarian real-time (search bar with instant clear).
  - Filter kategori dinamis.
  - Urutkan harga (termurah, termahal, terbaru, nama A-Z).
  - Filter status ketersediaan (Semua, Tersedia, Stok Habis).
  - Switch tampilan **Grid View** dan **List View**.
  - Paginasi *Load More*.
- **Halaman Detail Produk (`/products/[slug]`)**:
  - Galeri visual produk dengan stock badge.
  - Harga coret & persentase diskon otomatis.
  - Masa aktif/durasi paket (1 Bulan, 1 Tahun, Lifetime).
  - Daftar fitur keunggulan & ketentuan penggunaan.
  - Rekomendasi produk terkait.
  - Share link button (copy to clipboard).
- **🟢 WhatsApp Purchase Funnel**:
  - Tombol **"Beli via WhatsApp"** otomatis menyusun template pesan rapi berisikan nama produk, paket/durasi, harga, dan link produk.
  - Jika stok habis, tombol otomatis berubah menjadi **"Tanya Ketersediaan"** dengan pesan ramah untuk menanyakan restock ke admin.
  - Menggunakan format resmi `https://wa.me/{WHATSAPP_NUMBER}?text={ENCODED_MESSAGE}`.
  - Nomor WhatsApp tersentralisasi dalam konfigurasi sehingga mudah diubah kapan saja.
- **Edukasi & Edukatif**:
  - 5 Langkah Mudah Pemesanan (How To Order).
  - Mengapa Memilih Kami (Why Choose Us).
  - Accordion FAQ interaktif.
- **SEO Ready**:
  - Dynamic OpenGraph metadata pada tiap detail produk.
  - `robots.ts` & `sitemap.ts` otomatis.

---

### 🛡️ Admin Dashboard (`/admin`)
- **Protected Route & Authentication**:
  - Halaman login admin modern di `/admin/login`.
  - Dilengkapi fitur *1-Click Auto Fill Demo Credentials* untuk pengujian instan.
  - Default credentials: `admin@molestore.com` / `admin123`.
- **Dashboard Ringkasan**:
  - Metrik: Total Produk, Produk Tersedia, Stok Habis, Total Kategori.
  - Tabel produk terbaru.
  - Shortcut aksi cepat (Tambah Produk, Kategori Baru, Pengaturan).
- **Manajemen Produk (`/admin/products`)**:
  - Tabel data lengkap dengan thumbnail, kategori, harga, status stok, badge unggulan, dan tanggal buat.
  - **Tambah & Edit Produk**: Form modal lengkap dengan auto-generate slug, pemilihan kategori, durasi, harga normal/coret, fitur bullet-points, syarat ketentuan, dan status stok.
  - **Image Uploader**: Mock file upload (data URL preview) + pilihan preset gambar populer (Netflix, Spotify, YouTube, AI, Canva, dll) + input URL manual.
  - **Hapus Produk**: Dilengkapi konfirmasi dialog aman.
- **Manajemen Kategori (`/admin/categories`)**:
  - Tambah, edit, dan hapus kategori.
  - Pemilihan ikon kategori.
  - Toggle aktif/nonaktif kategori secara langsung.
- **Pengaturan Toko (`/admin/settings`)**:
  - Pengaturan nama toko, slogan, dan deskripsi SEO.
  - **Nomor WhatsApp Admin Utama** dan template pesan default.
  - Akun media sosial resmi (Instagram, TikTok, Telegram).
  - Email bantuan dan alamat toko.
  - Tombol **Reset Demo Data** jika ingin mengembalikan katalog ke data awal.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
* **Icons**: Lucide Icons
* **Notifications**: Sonner (Toast notifications)
* **Architecture**: Clean & Component-Based Architecture
  * Service Layer (`src/services/`): Abstraksi CRUD siap disambungkan ke FastAPI / PostgreSQL
  * Storage Layer (`src/services/storage.ts`): Sinkronisasi LocalStorage browser agar perubahan admin langsung aktif secara live pada katalog pelanggan.
  * Context Layer (`src/context/`): State management terpadu untuk `StoreContext` dan `AuthContext`.

---

## 📁 Struktur Direktori

```
Mole-store/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── categories/page.tsx # CRUD Kategori
│   │   │   ├── login/page.tsx      # Login Admin
│   │   │   ├── products/page.tsx   # CRUD Produk
│   │   │   ├── settings/page.tsx   # Pengaturan WhatsApp & Toko
│   │   │   ├── layout.tsx          # Shell & Protected Route
│   │   │   └── page.tsx            # Dashboard Admin
│   │   ├── products/
│   │   │   ├── [slug]/page.tsx     # Detail Produk (Dynamic Metadata)
│   │   │   └── page.tsx            # Katalog Produk & Filter
│   │   ├── globals.css             # Design Tokens & Styles
│   │   ├── layout.tsx              # Root Layout & Providers
│   │   ├── not-found.tsx           # Halaman 404
│   │   ├── page.tsx                # Homepage
│   │   ├── robots.ts               # SEO robots.txt
│   │   └── sitemap.ts              # SEO sitemap.xml
│   ├── components/
│   │   ├── admin/                  # Sidebar, Header, Modals, Uploader
│   │   ├── common/                 # Navbar, Footer, WhatsAppButton, Badges
│   │   ├── home/                   # Hero, Featured, Categories, FAQ, etc.
│   │   ├── products/               # ProductCard, Grid, Filter, Detail
│   │   └── ui/                     # Button, Badge, Modal, Input, etc.
│   ├── context/                    # StoreContext & AuthContext
│   ├── data/                       # Mock Products (12 items), Categories, FAQs
│   ├── lib/                        # WhatsApp URL generator, currency, utils
│   ├── services/                   # ProductService, CategoryService, Storage
│   └── types/                      # TypeScript Interfaces
├── .env.example
├── .env.local
└── package.json
```

---

## 🚀 Cara Menjalankan

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Konfigurasi Lingkungan**:
   Salin file `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Atur nomor WhatsApp admin di `.env.local`:
   ```env
   NEXT_PUBLIC_STORE_NAME="Mole Store"
   NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

4. **Akses Admin Dashboard**:
   Buka [http://localhost:3000/admin](http://localhost:3000/admin)
   - Email: `admin@molestore.com`
   - Password: `admin123`

---

## 🔮 Roadmap Pengembangan Backend (Future Ready)

Struktur kode telah dirancang mengikuti pola Repository/Service Pattern:
- **FastAPI / Express / NestJS**: Cukup ganti implementasi method pada `src/services/productService.ts` dan `src/services/categoryService.ts` untuk memanggil endpoint REST API `fetch('/api/v1/products')`.
- **PostgreSQL / Supabase**: Model TypeScript di `src/types/product.ts` dan `src/types/category.ts` identik dengan schema relasional PostgreSQL.
- **S3 / Cloudinary / MinIO**: Komponen `ImageUploader` di `src/components/admin/ImageUploader.tsx` telah disiapkan untuk menerima URL kembalian dari presigned URL upload.
