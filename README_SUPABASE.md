# 🚀 Panduan Integrasi Supabase & Deployment Vercel — Mole Store

Dokumen ini berisi panduan lengkap untuk setup database Supabase PostgreSQL, Authentication, Supabase Storage, Row Level Security (RLS), dan deployment ke Vercel.

---

## 1. 📋 Ringkasan Arsitektur

```
Next.js 15 (App Router + React 19)
       │
       ├──► Supabase PostgreSQL (Categories, Products, Variants, Inventory, Orders, Customers, Banners, Testimonials, Settings)
       ├──► Supabase Auth (Admin & Staff Role-Based Access)
       ├──► Supabase Storage (Bucket: product-images)
       └──► WhatsApp Order Checkout Flow (ORD-YYYYMMDD-XXXX)
```

---

## 2. 🗄️ Setup Database & Schema Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat project baru.
2. Buka menu **SQL Editor** di sidebar kiri.
3. Jalankan script migrasi awal yang berada di file:
   📂 `supabase/migrations/20260925_init_schema.sql`
4. Jalankan script seed data awal (opsional untuk data awal 10+ produk, kategori, banner, testimoni):
   📂 `supabase/seed.sql`

---

## 3. 📦 Setup Supabase Storage (Bucket Gambar)

Bucket gambar `product-images` dibuat secara otomatis saat menjalankan file migrasi SQL.

Jika ingin memastikan atau membuat secara manual:
1. Masuk ke menu **Storage** di Supabase Dashboard.
2. Pastikan terdapat bucket bernama **`product-images`** dengan setting **Public Bucket** diaktifkan (`Public = ON`).
3. Kebijakan RLS (Storage Policies) sudah terkonfigurasi:
   - **SELECT**: Publik (Semua orang dapat melihat gambar).
   - **INSERT / UPDATE / DELETE**: Hanya staff/admin terotentikasi (`authenticated`).

---

## 4. 🔐 Setup Admin Authentication

1. Masuk ke menu **Authentication -> Users** di Supabase Dashboard.
2. Klik **Add User** -> **Create User**:
   - **Email**: `admin@molestore.com` (atau email pilihan Anda)
   - **Password**: Password aman pilihan Anda
   - **Auto Confirm User**: Aktifkan (Centang).
3. Setelah user dibuat, buat/pastikan profilnya memiliki role `admin` dengan menjalankan SQL berikut di SQL Editor:
   ```sql
   INSERT INTO public.profiles (id, email, full_name, role)
   VALUES ('<USER_UUID_DARI_SUPABASE_AUTH>', 'admin@molestore.com', 'Master Admin', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

---

## 5. ⚙️ Konfigurasi Environment Variables

Salin `.env.example` menjadi `.env.local` pada root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Catatan**: Dapatkan URL dan anon key di Supabase Dashboard -> **Project Settings -> API**.

---

## 6. 🌐 Deployment ke Vercel

1. Push commit ke repository GitHub:
   ```bash
   git add .
   git commit -m "feat: integrate Supabase PostgreSQL, Storage, and Auth"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com) dan pilih **Add New Project** -> **Import Git Repository**.
3. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOi...`
   - `NEXT_PUBLIC_APP_URL` = `https://your-domain.vercel.app`
4. Klik **Deploy**.

---

## 7. 🛍️ Alur Checkout WhatsApp & Manajemen Pesanan

### Alur Pelanggan:
1. Pelanggan memilih produk di katalog dan memilih **Paket/Varian** (misal: *Netflix 1 Bulan* atau *3 Bulan*).
2. Pelanggan mengklik tombol **"Beli via WhatsApp"**.
3. Modal formulir muncul untuk mengisi Nama dan Nomor WhatsApp.
4. Sistem memanggil RPC `create_whatsapp_order`:
   - Membuat record pesanan dengan kode format `ORD-YYYYMMDD-XXXX`.
   - Status pesanan diset menjadi `pending`.
5. Pelanggan otomatis dialihkan ke aplikasi WhatsApp dengan pesan terformat rapi.

### Alur Admin:
1. Admin membuka menu **/admin/orders**.
2. Melihat rincian pesanan, item, catatan pembeli, dan timeline riwayat.
3. Setelah pembayaran diterima, admin menekan **"Tandai Lunas"** & **"Proses Pesanan"**.
4. Admin mengirimkan akun/kredensial ke pelanggan via WhatsApp lalu menekan **"Selesaikan Pesanan"**.
