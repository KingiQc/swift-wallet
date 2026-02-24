import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Shield, History, Lock, CheckCircle2, Clock, RefreshCw } from "lucide-react";

const txIconMap = { send: ArrowUpRight, receive: ArrowDownLeft, convert: ArrowLeftRight, escrow: Shield };

export default function Transactions() {
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [pin, setPin] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Will reload from DB when connected
    await new Promise(r => setTimeout(r, 500));
    setIsRefreshing(false);
  }, []);

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
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Transactions will appear here once you start using your wallet</p>
          </div>
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
              <div className="space-y-2"><Label>Recipient BTC Address</Label><Input placeholder="bc1q..." required /></div>
              <div className="space-y-2"><Label>Amount (BTC)</Label><Input type="number" step="0.00000001" placeholder="0.00000000" required /></div>
              <div className="space-y-2"><Label>Release Condition</Label><Input placeholder="e.g. Delivery confirmed" required /></div>
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
