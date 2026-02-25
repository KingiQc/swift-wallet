import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Shield, History, Lock, RefreshCw } from "lucide-react";
import { CURRENCIES, type CurrencyCode } from "@/lib/constants";
import { useTransactions } from "@/hooks/use-transactions";

const txIconMap: Record<string, any> = { send: ArrowUpRight, receive: ArrowDownLeft, convert: ArrowLeftRight, escrow: Shield };

export default function Transactions() {
  const { data: transactions, isLoading, refetch } = useTransactions();
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [pin, setPin] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const filtered = transactions?.filter(t => filter === "all" || t.type === filter) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><History className="h-6 w-6 text-primary" /> Transactions</h1>
          <p className="text-muted-foreground">Your complete transaction history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="send">Sent</SelectItem>
              <SelectItem value="receive">Received</SelectItem>
              <SelectItem value="convert">Conversions</SelectItem>
              <SelectItem value="escrow">Escrow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="card-gradient border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs mt-1">Transactions will appear here once you start using your wallet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(tx => {
                const Icon = txIconMap[tx.type] || ArrowLeftRight;
                const curr = CURRENCIES[tx.currency as CurrencyCode];
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === "send" ? "bg-destructive/10" : "bg-success/10"}`}>
                        <Icon className={`h-5 w-5 ${tx.type === "send" ? "text-destructive" : "text-success"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{tx.type}</p>
                        <p className="text-xs text-muted-foreground">{tx.description || new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === "send" ? "text-destructive" : "text-success"}`}>
                        {tx.type === "send" ? "-" : "+"}{curr?.symbol || ""}{Number(tx.amount).toFixed(tx.currency === "BTC" ? 8 : 2)}
                      </p>
                      <p className={`text-xs capitalize ${tx.status === "completed" ? "text-success" : tx.status === "pending" ? "text-warning" : "text-destructive"}`}>{tx.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── BTC Escrow Section ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> BTC Escrow</h2>
          <p className="text-sm text-muted-foreground">Secure BTC transactions with escrow protection</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="glow-primary">Create Escrow</Button>
      </div>

      {showCreate && (
        <Card className="card-gradient border-border animate-fade-in">
          <CardHeader>
            <CardTitle>New Escrow Transaction</CardTitle>
            <CardDescription>BTC will be locked until conditions are met</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => { e.preventDefault(); }} className="space-y-4">
              <div className="space-y-2"><Label>Recipient Phone</Label><Input placeholder="+234..." required /></div>
              <div className="space-y-2"><Label>Amount (BTC)</Label><Input type="number" step="0.00000001" placeholder="0.00000000" required /></div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="e.g. Payment for services" required /></div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Lock className="h-4 w-4" /> PIN</Label>
                <Input type="password" maxLength={4} inputMode="numeric" value={pin} onChange={e => setPin(e.target.value.replace(/\D/, ""))} placeholder="••••" required />
              </div>
              <Button type="submit" className="w-full h-12 font-semibold glow-primary">Lock BTC in Escrow</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="card-gradient border-border">
        <CardHeader><CardTitle className="text-lg">Escrow History</CardTitle></CardHeader>
        <CardContent>
          <div className="py-6 text-center text-muted-foreground">
            <p className="text-sm">No escrow transactions yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
