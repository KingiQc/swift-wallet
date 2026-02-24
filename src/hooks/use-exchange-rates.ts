import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CurrencyCode } from "@/lib/constants";

export interface ExchangeRates {
  "USD-NGN": number;
  "USD-EUR": number;
  "USD-GBP": number;
  "BTC-USD": number;
  "BTC-NGN": number;
  "BTC-EUR": number;
  "BTC-GBP": number;
  timestamp: number;
}

async function fetchRates(): Promise<ExchangeRates> {
  const { data, error } = await supabase.functions.invoke("exchange-rates");
  if (error) throw error;
  return data as ExchangeRates;
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchRates,
    refetchInterval: 60_000, // refresh every 60s
    staleTime: 30_000,
  });
}

export function getRate(rates: ExchangeRates | undefined, from: CurrencyCode, to: CurrencyCode): number {
  if (!rates) return 0;
  if (from === to) return 1;
  const key = `${from}-${to}` as keyof ExchangeRates;
  if (typeof rates[key] === "number") return rates[key] as number;
  const rev = `${to}-${from}` as keyof ExchangeRates;
  if (typeof rates[rev] === "number") return 1 / (rates[rev] as number);
  // Chain through USD
  const fromToUsd = from === "USD" ? 1 : from === "BTC" ? (rates["BTC-USD"] || 1) : 1 / ((rates[`USD-${from}` as keyof ExchangeRates] as number) || 1);
  const usdToTo = to === "USD" ? 1 : to === "BTC" ? 1 / (rates["BTC-USD"] || 1) : ((rates[`USD-${to}` as keyof ExchangeRates] as number) || 1);
  return fromToUsd * usdToTo;
}
