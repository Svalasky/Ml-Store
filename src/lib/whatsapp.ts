import { Product } from "@/types/product";
import { formatRupiah } from "./utils";

export interface GenerateWhatsAppMessageOptions {
  product: Product;
  productUrl?: string;
  isAskingAvailability?: boolean;
  customNote?: string;
}

export function cleanWhatsAppNumber(phoneNumber: string): string {
  // Remove non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, "");
  // If starts with 08, change to 628
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return cleaned;
}

export function generateProductWhatsAppMessage({
  product,
  productUrl,
  isAskingAvailability = false,
  customNote,
}: GenerateWhatsAppMessageOptions): string {
  const formattedPrice = formatRupiah(product.price);
  const packageDuration = product.duration || "Standar";

  if (isAskingAvailability || product.status === "out_of_stock") {
    return `Halo Admin 👋

Saya tertarik dengan produk:

Produk: ${product.name}
Paket: ${packageDuration}
Harga: ${formattedPrice}

Status di website saat ini sedang kosong/habis. Apakah stok untuk produk ini masih bisa diorder atau kapan ready kembali?

${productUrl ? `Link produk:\n${productUrl}\n\n` : ""}Terima kasih banyak.`;
  }

  return `Halo Admin 👋

Saya ingin membeli produk:

Produk: ${product.name}
Paket: ${packageDuration}
Harga: ${formattedPrice}
${customNote ? `Catatan: ${customNote}\n` : ""}
${productUrl ? `Link produk:\n${productUrl}\n\n` : ""}Mohon informasinya apakah produk masih tersedia & langkah pembayaran selanjutnya.

Terima kasih.`;
}

export function buildWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  const cleanNumber = cleanWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
