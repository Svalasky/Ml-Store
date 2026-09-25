import type { Metadata, Viewport } from "next";
import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { env } from "@/config/env";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Jual Akun Mobile Legends | ML Account Store Terpercaya",
  description:
    "Marketplace akun Mobile Legends terpercaya No. 1 di Indonesia. Menjual akun MLBB Sultan, Collector, Legend, Mythic Glory & Immortal dengan garansi 100% Anti Hack-Back.",
  applicationName: "ML Account Store",
  keywords: [
    "Jual Akun Mobile Legends",
    "Beli Akun MLBB",
    "Akun Sultan ML",
    "Collector Skin MLBB",
    "Akun Mythic Glory",
    "Akun Mythical Immortal",
    "Marketplace Akun Mobile Legends",
  ],
  authors: [{ name: "ML Account Store" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${firaSans.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScrollProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
