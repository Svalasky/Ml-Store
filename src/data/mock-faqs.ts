export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "pemesanan" | "akun" | "garansi" | "pembayaran";
}

export const MOCK_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Bagaimana cara melakukan pembelian akun di Mole Store?",
    answer: "Sangat mudah! Pilih produk yang Anda inginkan di katalog kami, klik tombol '🟢 Beli via WhatsApp', dan Anda akan otomatis diarahkan ke chat WhatsApp Admin dengan format pesanan yang sudah terisi rapi. Admin kami akan segera membalas instruksi pembayaran dan detail pesanan Anda.",
    category: "pemesanan",
  },
  {
    id: "faq-2",
    question: "Apakah akun yang dijual legal dan aman?",
    answer: "Ya, 100% legal dan aman. Kami menggunakan metode berlangganan resmi (official subscription) tanpa trik kartu ilegal ataupun manipulasi yang dapat membahayakan data Anda.",
    category: "akun",
  },
  {
    id: "faq-3",
    question: "Berapa lama waktu proses pengiriman akun setelah bayar?",
    answer: "Rata-rata proses hanya memakan waktu 1 hingga 5 menit setelah Anda mengirimkan bukti transfer ke WhatsApp admin kami. Kami siap melayani setiap hari dari jam 08.00 hingga 23.00 WIB.",
    category: "pemesanan",
  },
  {
    id: "faq-4",
    question: "Metode pembayaran apa saja yang diterima?",
    answer: "Admin kami mendukung seluruh bank nasional (BCA, Mandiri, BRI, BNI), QRIS instan semua e-wallet (GoPay, OVO, DANA, ShopeePay), dan transfer virtual account.",
    category: "pembayaran",
  },
  {
    id: "faq-5",
    question: "Bagaimana klaim garansi jika terjadi kendala pada akun?",
    answer: "Semua produk kami dilindungi Garansi Penggantian Penuh (Full Replace) selama masa aktif langganan. Jika ada error atau kendala, cukup hubungi WhatsApp admin dengan menyertakan bukti screenshot, dan akun Anda akan diganti baru atau dibantu perbaikan secepatnya.",
    category: "garansi",
  },
  {
    id: "faq-6",
    question: "Apakah bisa menggunakan email pribadi saya sendiri?",
    answer: "Beberapa produk seperti YouTube Premium, Spotify Family/Invite, dan Canva Pro bisa langsung diaktifkan menggunakan email Google/pribadi Anda. Untuk produk tertentu seperti Netflix & ChatGPT, admin menyediakan akun profile siap pakai yang praktis dan private.",
    category: "akun",
  },
];
