"use client";

import React from "react";
import { MessageCircle, HelpCircle } from "lucide-react";
import { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { buildWhatsAppUrl, generateProductWhatsAppMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  product?: Product;
  productUrl?: string;
  isAskingAvailability?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg";
  label?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export function WhatsAppButton({
  product,
  productUrl,
  isAskingAvailability = false,
  className,
  size = "default",
  label,
  showIcon = true,
  fullWidth = false,
}: WhatsAppButtonProps) {
  const { settings } = useStore();

  const isOutOfStock = product?.status === "out_of_stock";
  const shouldAskAvailability = isAskingAvailability || isOutOfStock;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const currentUrl =
      typeof window !== "undefined"
        ? productUrl || (product ? `${window.location.origin}/products/${product.slug}` : window.location.href)
        : "";

    let message = "";
    if (product) {
      message = generateProductWhatsAppMessage({
        product,
        productUrl: currentUrl,
        isAskingAvailability: shouldAskAvailability,
      });
    } else {
      message = settings.whatsappMessage || "Halo Admin, saya ingin menanyakan produk akun digital.";
    }

    const whatsappUrl = buildWhatsAppUrl(settings.whatsappNumber, message);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Button text
  let buttonText = label;
  if (!buttonText) {
    if (shouldAskAvailability) {
      buttonText = "Tanya Ketersediaan";
    } else {
      buttonText = "Beli via WhatsApp";
    }
  }

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={shouldAskAvailability ? "outline" : "whatsapp"}
      className={cn(
        fullWidth && "w-full",
        shouldAskAvailability &&
          "border-amber-300 bg-amber-50/80 text-amber-900 hover:bg-amber-100 hover:border-amber-400 font-semibold",
        className
      )}
    >
      {showIcon && (
        shouldAskAvailability ? (
          <HelpCircle className="mr-2 h-4 w-4 text-amber-700" />
        ) : (
          <MessageCircle className="mr-2 h-4 w-4 fill-white text-white" />
        )
      )}
      <span>{buttonText}</span>
    </Button>
  );
}
