# Database Schema - Marketplace Akun Mobile Legends

Dokumentasi schema PostgreSQL Supabase untuk website marketplace khusus penjualan akun Mobile Legends.

---

## 1. Tabel Utama

### `products` (Akun Mobile Legends)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID PK` | Auto-generated UUID |
| `name` | `TEXT` | Nama akun (Contoh: *MLBB Sultan Account - 12 Collector*) |
| `slug` | `TEXT UNIQUE` | Slug URL (Contoh: *mlbb-sultan-account-12-collector*) |
| `description` | `TEXT` | Penjelasan detail akun |
| `price` | `NUMERIC` | Harga jual akun (IDR) |
| `original_price` | `NUMERIC` | Harga coret / original (IDR) |
| `status` | `TEXT` | `available`, `reserved`, `sold`, `inactive` |
| `featured` | `BOOLEAN` | Status rekomendasi / HOT |
| `level` | `INTEGER` | Level akun Mobile Legends (e.g. 75) |
| `rank` | `TEXT` | Rank akun (*Mythical Immortal*, *Mythic Glory*, dll) |
| `server` | `TEXT` | Server ID akun (*1234*) |
| `battle_id` | `TEXT` | Battle ID akun |
| `win_rate` | `NUMERIC` | Persentase Win Rate keseluruhan (e.g. 68.5) |
| `total_matches` | `INTEGER` | Total pertandingan |
| `hero_count` | `INTEGER` | Jumlah total hero yang dimiliki |
| `skin_count` | `INTEGER` | Jumlah total skin yang dimiliki |
| `collector_count` | `INTEGER` | Jumlah skin Collector |
| `legend_count` | `INTEGER` | Jumlah skin Legend |
| `epic_count` | `INTEGER` | Jumlah skin Epic |
| `special_count` | `INTEGER` | Jumlah skin Special |
| `elite_count` | `INTEGER` | Jumlah skin Elite |
| `season_skin_count`| `INTEGER` | Jumlah skin Season |
| `terms` | `TEXT` | Ketentuan & garansi serah terima |
| `created_at` | `TIMESTAMPTZ` | Waktu dibuat |
| `updated_at` | `TIMESTAMPTZ` | Waktu diperbarui |

---

### `product_images` (Screenshot Akun)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID PK` | Primary key |
| `product_id` | `UUID FK` | Relasi ke `products(id)` ON DELETE CASCADE |
| `image_url` | `TEXT` | URL screenshot dari Supabase Storage (`ml-account-images`) |
| `sort_order` | `INTEGER` | Urutan tampil screenshot |
| `is_primary` | `BOOLEAN` | Apakah screenshot utama / thumbnail |

---

### `product_skins` (Daftar Skin)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID PK` | Primary key |
| `product_id` | `UUID FK` | Relasi ke `products(id)` ON DELETE CASCADE |
| `skin_name` | `TEXT` | Nama skin (e.g. *Night Owl*, *Starfall Knight*) |
| `hero_name` | `TEXT` | Nama hero (e.g. *Gusion*, *Granger*) |
| `skin_type` | `TEXT` | `collector`, `legend`, `epic`, `special`, `elite`, `season`, `other` |
| `image_url` | `TEXT` | URL gambar skin (opsional) |

---

### `product_heroes` (Daftar Hero Utama)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID PK` | Primary key |
| `product_id` | `UUID FK` | Relasi ke `products(id)` ON DELETE CASCADE |
| `hero_name` | `TEXT` | Nama hero unggulan |

---

### `orders` (Pesanan WhatsApp)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID PK` | Primary key |
| `order_number` | `TEXT UNIQUE` | Nomor order (Format: `ORD-YYYYMMDD-XXXX`) |
| `product_id` | `UUID FK` | Relasi ke `products(id)` |
| `customer_id` | `UUID FK` | Relasi ke `customers(id)` |
| `product_name` | `TEXT` | Snapshot nama akun saat order dibuat |
| `price` | `NUMERIC` | Snapshot harga akun saat order dibuat |
| `status` | `TEXT` | `pending`, `waiting_payment`, `paid`, `processing`, `completed`, `cancelled` |
| `payment_status`| `TEXT` | `unpaid`, `pending`, `paid`, `refunded` |
| `customer_name` | `TEXT` | Nama pembeli |
| `customer_whatsapp`| `TEXT` | Nomor WhatsApp pembeli |
| `customer_note` | `TEXT` | Catatan pembeli |
| `admin_note` | `TEXT` | Catatan internal admin |
| `created_at` | `TIMESTAMPTZ` | Waktu order |

---

### `order_status_history` (Riwayat Perubahan Status)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID PK` | Primary key |
| `order_id` | `UUID FK` | Relasi ke `orders(id)` ON DELETE CASCADE |
| `status` | `TEXT` | Status baru |
| `notes` | `TEXT` | Catatan perubahan status |
| `created_at` | `TIMESTAMPTZ` | Waktu perubahan |

---

### `banners` & `testimonials` & `store_settings`
- `banners`: Slider banner promo di homepage.
- `testimonials`: Ulasan kepuasan pembeli terverifikasi.
- `store_settings`: Konfigurasi nama toko, nomor WhatsApp admin resmi, dan link sosial media.

---

## 2. Cara Menjalankan Migrasi ke Supabase
1. Masuk ke dashboard Supabase project Anda di [https://supabase.com](https://supabase.com).
2. Buka menu **SQL Editor**.
3. Copy isi file [supabase/migrations/20260925_init_schema.sql](file:///f:/WEB/project-template/Personal-Dashboard/supabase/migrations/20260925_init_schema.sql) dan jalankan (**Run**).
4. Copy isi file [supabase/seed.sql](file:///f:/WEB/project-template/Personal-Dashboard/supabase/seed.sql) dan jalankan (**Run**) untuk mengisi 10 akun demo Mobile Legends.
