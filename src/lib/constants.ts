export const CURRENCIES = {
  NGN: { symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬" },
  USD: { symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  EUR: { symbol: "€", name: "Euro", flag: "🇪🇺" },
  GBP: { symbol: "£", name: "British Pound", flag: "🇬🇧" },
  BTC: { symbol: "₿", name: "Bitcoin", flag: "🪙" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export interface WalletBalance {
  currency: CurrencyCode;
  amount: number;
}

export interface Transaction {
  id: string;
  type: "send" | "receive" | "convert" | "escrow";
  currency: CurrencyCode;
  amount: number;
  recipient?: string;
  sender?: string;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  accountNumber: string;
  btcAddress: string;
  kycStatus: "pending" | "verified" | "rejected" | "none";
  role: "user" | "admin";
  frozen: boolean;
}

export const NAV_ITEMS = [
  { title: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
  { title: "Send Money", path: "/send", icon: "Send" },
  { title: "Convert", path: "/convert", icon: "ArrowLeftRight" },
  { title: "Transactions", path: "/transactions", icon: "History" },
  { title: "Escrow", path: "/escrow", icon: "Shield" },
  { title: "KYC", path: "/kyc", icon: "UserCheck" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { title: "Overview", path: "/admin", icon: "BarChart3" },
  { title: "Users", path: "/admin/users", icon: "Users" },
  { title: "Transactions", path: "/admin/transactions", icon: "History" },
  { title: "Escrow", path: "/admin/escrow", icon: "Shield" },
  { title: "KYC Review", path: "/admin/kyc", icon: "FileCheck" },
] as const;
