import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Bitcoin,
  ArrowLeftRight, RefreshCw, Send, Shield, Loader2
} from "lucide-react";
import { CURRENCIES, type CurrencyCode } from "@/lib/constants";
import { Link } from "react-router-dom";
import { useExchangeRates, getRate } from "@/hooks/use-exchange-rates";

const balances: Record<CurrencyCode, number> = {
  NGN: 0, USD: 0, EUR: 0, GBP: 0, BTC: 0,
};

export default function Dashboard() {
  const { data: rates, isLoading, refetch, isFetching } = useExchangeRates();
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("NGN");
  const [convertAmount, setConvertAmount] = useState("");
  const [isPulling, setIsPulling] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsPulling(true);
    await refetch();
    setIsPulling(false);
  }, [refetch]);

  const rate = getRate(rates, fromCurrency, toCurrency);
  const convertedValue = convertAmount && rate ? (parseFloat(convertAmount) * rate).toFixed(toCurrency === "BTC" ? 8 : 2) : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to VaultX</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isFetching}>
          <RefreshCw className={`h-5 w-5 ${isFetching || isPulling ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Total Balance */}
      <Card className="card-gradient border-border overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-medium">Total Balance (USD)</span>
          </div>
          <p className="text-4xl font-bold text-gradient">$0.00</p>
          {isLoading ? (
            <Skeleton className="h-4 w-48 mt-2" />
          ) : (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" /> Live rates active · BTC ${rates?.["BTC-USD"]?.toLocaleString() ?? "—"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Currency Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map(code => (
          <Card key={code} className="card-gradient border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{CURRENCIES[code].flag}</span>
                <span className="text-sm font-semibold text-muted-foreground">{code}</span>
              </div>
              <p className="text-lg font-bold">
                {CURRENCIES[code].symbol}{code === "BTC" ? balances[code].toFixed(8) : balances[code].toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions + Converter */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="card-gradient border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button asChild variant="secondary" className="h-20 flex-col gap-2">
              <Link to="/send"><Send className="h-5 w-5" /> Send Money</Link>
            </Button>
            <Button asChild variant="secondary" className="h-20 flex-col gap-2">
              <Link to="/convert"><ArrowLeftRight className="h-5 w-5" /> Convert</Link>
            </Button>
            <Button asChild variant="secondary" className="h-20 flex-col gap-2">
              <Link to="/transactions"><Shield className="h-5 w-5" /> Escrow</Link>
            </Button>
            <Button asChild variant="secondary" className="h-20 flex-col gap-2">
              <Link to="/transactions"><RefreshCw className="h-5 w-5" /> History</Link>
            </Button>
          </CardContent>
        </Card>

        {/* FX Converter */}
        <Card className="card-gradient border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" /> FX Converter
              {isFetching && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Select value={fromCurrency} onValueChange={v => setFromCurrency(v as CurrencyCode)}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map(c => (
                    <SelectItem key={c} value={c}>{CURRENCIES[c].flag} {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Amount" type="number" value={convertAmount} onChange={e => setConvertAmount(e.target.value)} className="flex-1" />
            </div>
            <div className="flex items-center justify-center">
              <button onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }} className="p-2 rounded-full bg-muted hover:bg-accent transition-colors">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
              </button>
            </div>
            <div className="flex gap-2">
              <Select value={toCurrency} onValueChange={v => setToCurrency(v as CurrencyCode)}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map(c => (
                    <SelectItem key={c} value={c}>{CURRENCIES[c].flag} {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input readOnly value={convertedValue} placeholder="Converted" className="flex-1" />
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-40 mx-auto" />
            ) : (
              <p className="text-xs text-muted-foreground text-center">
                Rate: 1 {fromCurrency} = {rate.toFixed(toCurrency === "BTC" ? 8 : 2)} {toCurrency}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions - empty state */}
      <Card className="card-gradient border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link to="/transactions">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Your transaction history will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
