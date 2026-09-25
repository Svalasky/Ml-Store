import { formatRupiah } from "./utils";
import { Product } from "@/types/product";

export interface GenerateOrderWhatsAppMessageOptions {
  orderNumber: string;
  productName: string;
  variantName?: string;
  price: number;
  customerName?: string;
  customerNote?: string;
}

export interface GenerateProductWhatsAppMessageOptions {
  product: Product;
  productUrl?: string;
  isAskingAvailability?: boolean;
  customNote?: string;
}

export function cleanWhatsAppNumber(phoneNumber: string): string {
  let cleaned = phoneNumber.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return cleaned;
}

export function generateOrderWhatsAppMessage({
  orderNumber,
  productName,
  variantName,
  price,
  customerName,
  customerNote,
}: GenerateOrderWhatsAppMessageOptions): string {
  const formattedPrice = formatRupiah(price);
  const packageText = variantName || "Standar";

  let msg = `Halo Admin 👋\n\nSaya ingin membeli:\n\nOrder ID: ${orderNumber}\n\nProduk:\n${productName}\n\nPaket:\n${packageText}\n\nHarga:\n${formattedPrice}\n`;

  if (customerName) {
    msg += `\nNama Pembeli: ${customerName}`;
  }
  if (customerNote) {
    msg += `\nCatatan: ${customerNote}`;
  }

  msg += `\n\nMohon konfirmasi ketersediaannya.\n\nTerima kasih.`;
  return msg;
}

export function generateProductWhatsAppMessage({
  product,
  productUrl,
  isAskingAvailability = false,
  customNote,
}: GenerateProductWhatsAppMessageOptions): string {
  const formattedPrice = formatRupiah(product.price);
  const packageDuration = product.duration || "Standar";

  if (isAskingAvailability || product.status === "out_of_stock") {
    return `Halo Admin 👋\n\nSaya tertarik dengan produk:\n\nProduk: ${product.name}\nPaket: ${packageDuration}\nHarga: ${formattedPrice}\n\nStatus di website saat ini sedang kosong/habis. Apakah stok untuk produk ini masih bisa diorder atau kapan ready kembali?\n\n${
      productUrl ? `Link produk:\n${productUrl}\n\n` : ""
    }Terima kasih banyak.`;
  }

  return `Halo Admin 👋\n\nSaya ingin membeli produk:\n\nProduk: ${product.name}\nPaket: ${packageDuration}\nHarga: ${formattedPrice}\n${
    customNote ? `Catatan: ${customNote}\n` : ""
  }${
    productUrl ? `Link produk:\n${productUrl}\n\n` : ""
  }Mohon informasinya apakah produk masih tersedia & langkah pembayaran selanjutnya.\n\nTerima kasih.`;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanNumber = cleanWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}