import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export interface Wallet {
  id: string;
  currency: string;
  balance: number;
}

export function useWallets() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["wallets", profile?.id],
    enabled: !!profile?.id,
    queryFn: async (): Promise<Wallet[]> => {
      const { data, error } = await supabase
        .from("wallets")
        .select("id, currency, balance")
        .eq("user_id", profile!.id);
      if (error) throw error;
      return (data ?? []).map(w => ({ ...w, balance: Number(w.balance) }));
    },
  });
}
