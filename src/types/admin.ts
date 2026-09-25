export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "superadmin";
}

export interface InquiryLog {
  id: string;
  productId: string;
  productName: string;
  timestamp: string;
  status: "pending" | "contacted" | "completed";
}
