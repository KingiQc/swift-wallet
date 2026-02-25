import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export interface Transaction {
  id: string;
  type: string;
  currency: string;
  amount: number;
  recipient: string | null;
  sender: string | null;
  status: string;
  description: string | null;
  created_at: string;
}

export function useTransactions() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["transactions", profile?.id],
    enabled: !!profile?.id,
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", profile!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(t => ({ ...t, amount: Number(t.amount) }));
    },
  });
}
