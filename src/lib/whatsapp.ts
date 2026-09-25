import { env } from "@/config/env";
import { Product } from "@/types/product";

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}${month}${day}-${randomSuffix}`;
}

export interface BuildWAMessageParams {
  orderNumber: string;
  product: Product;
  productUrl?: string;
}

export function buildWhatsAppMessage({
  orderNumber,
  product,
  productUrl,
}: BuildWAMessageParams): string {
  const url =
    productUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.slug}`
      : `https://mlbb-store.com/products/${product.slug}`);

  return `Halo Admin 👋

Saya ingin membeli akun Mobile Legends.

Order ID:
${orderNumber}

Akun:
${product.name}

Rank:
${product.rank || "Mythic"}

Skin:
${product.skin_count}

Collector:
${product.collector_count || 0}

Legend:
${product.legend_count || 0}

Harga:
${formatIDR(product.price)}

Link:
${url}

Apakah akun masih tersedia?

Terima kasih.`;
}

export function getWhatsAppUrl(message: string, customPhone?: string): string {
  const phone = (customPhone || env.whatsappNumber).replace(/[^0-9]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
