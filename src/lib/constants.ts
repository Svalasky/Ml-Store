export const MLBB_RANKS = [
  "Warrior",
  "Elite",
  "Master",
  "Grandmaster",
  "Epic",
  "Legend",
  "Mythic",
  "Mythical Honor",
  "Mythical Glory",
  "Mythical Immortal",
] as const;

export const SKIN_TYPES = [
  "collector",
  "legend",
  "epic",
  "special",
  "elite",
  "season",
  "other",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  waiting_payment: "Menunggu Pembayaran",
  paid: "Lunas (Paid)",
  processing: "Proses Serah Terima",
  completed: "Selesai (Completed)",
  cancelled: "Dibatalkan",
};
