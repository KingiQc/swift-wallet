import type { CurrencyCode } from "./constants";

// Map phone prefixes to default currency
const PHONE_PREFIX_CURRENCY: [string, CurrencyCode][] = [
  ["+234", "NGN"], // Nigeria
  ["+1", "USD"],   // US/Canada
  ["+44", "GBP"],  // UK
  ["+353", "EUR"], // Ireland
  ["+49", "EUR"],  // Germany
  ["+33", "EUR"],  // France
  ["+39", "EUR"],  // Italy
  ["+34", "EUR"],  // Spain
  ["+31", "EUR"],  // Netherlands
  ["+32", "EUR"],  // Belgium
  ["+43", "EUR"],  // Austria
  ["+351", "EUR"], // Portugal
  ["+358", "EUR"], // Finland
  ["+30", "EUR"],  // Greece
  ["+27", "USD"],  // South Africa (uses USD as proxy)
  ["+254", "USD"], // Kenya
  ["+233", "USD"], // Ghana
  ["+91", "USD"],  // India
  ["+86", "USD"],  // China
  ["+81", "USD"],  // Japan
  ["+61", "USD"],  // Australia
  ["+55", "USD"],  // Brazil
];

export function detectCurrencyFromPhone(phone: string): CurrencyCode {
  const cleaned = phone.replace(/\s/g, "");
  // Sort by prefix length descending for best match
  const sorted = [...PHONE_PREFIX_CURRENCY].sort((a, b) => b[0].length - a[0].length);
  for (const [prefix, currency] of sorted) {
    if (cleaned.startsWith(prefix)) return currency;
  }
  return "USD"; // fallback
}
