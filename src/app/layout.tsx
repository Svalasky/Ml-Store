import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Mole Store | Pusat Akun Digital Legal, Murah & Bergaransi",
    template: "%s | Mole Store",
  },
  description:
    "Beli akun digital premium resmi: Netflix, Spotify, YouTube Premium, ChatGPT Plus, Canva Pro, VPN, software dan game dengan garansi replace penuh langsung via WhatsApp.",
  keywords: [
    "akun digital",
    "beli netflix premium",
    "spotify premium murah",
    "chatgpt plus indonesia",
    "jual akun digital legal",
    "toko akun digital whatsapp",
    "canva pro",
  ],
  authors: [{ name: "Mole Store Team" }],
  creator: "Mole Store",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Mole Store | Akun Digital Legal & Bergaransi",
    description:
      "Katalog akun digital resmi harga terjangkau dengan pemrosesan instan 1-5 menit via WhatsApp.",
    siteName: "Mole Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mole Store | Akun Digital Legal & Bergaransi",
    description: "Katalog akun digital resmi langsung order via WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <StoreProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
