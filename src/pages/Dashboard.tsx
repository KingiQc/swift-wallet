import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Bitcoin,
  ArrowLeftRight, RefreshCw, Send, Shield
} from "lucide-react";
import { CURRENCIES, type CurrencyCode } from "@/lib/constants";
import { Link } from "react-router-dom";

const balances: Record<CurrencyCode, number> = {
  NGN: 0, USD: 0, EUR: 0, GBP: 0, BTC: 0,
};

const rates: Record<string, number> = {
  "USD-NGN": 1550, "EUR-NGN": 1680, "GBP-NGN": 1950,
  "BTC-USD": 67500, "USD-EUR": 0.92, "USD-GBP": 0.79,
};

function getRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1;
  const key = `${from}-${to}`;
  if (rates[key]) return rates[key];
  const rev = `${to}-${from}`;
  if (rates[rev]) return 1 / rates[rev];
  // chain through USD
  const fromUsd = from === "USD" ? 1 : (rates[`USD-${from}`] ? 1 / rates[`USD-${from}`] : rates[`${from}-USD`] || 1);
  const toUsd = to === "USD" ? 1 : (rates[`USD-${to}`] ? rates[`USD-${to}`] : 1 / (rates[`${to}-USD`] || 1));
  return fromUsd * toUsd;
}

const recentTx = [
  { id: "1", type: "receive" as const, desc: "From John Doe", amount: "+0.0025 BTC", time: "2 min ago", status: "completed" },
  { id: "2", type: "send" as const, desc: "To Jane Smith", amount: "-$150.00", time: "1 hour ago", status: "completed" },
  { id: "3", type: "convert" as const, desc: "USD → NGN", amount: "$500.00", time: "3 hours ago", status: "completed" },
  { id: "4", type: "escrow" as const, desc: "Escrow to Mike", amount: "-0.05 BTC", time: "1 day ago", status: "pending" },
];

export default function Dashboard() {
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("NGN");
  const [convertAmount, setConvertAmount] = useState("");

  const convertedValue = convertAmount ? (parseFloat(convertAmount) * getRate(fromCurrency, toCurrency)).toFixed(toCurrency === "BTC" ? 8 : 2) : "";

  const txIcon = { send: ArrowUpRight, receive: ArrowDownLeft, convert: ArrowLeftRight, escrow: Shield };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to VaultX</p>
      </div>

      {/* Total Balance */}
      <Card className="card-gradient border-border overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-medium">Total Balance (USD)</span>
          </div>
          <p className="text-4xl font-bold text-gradient">$0.00</p>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-success" /> Connect to Lovable Cloud for live data
          </p>
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
        {/* Quick Actions */}
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
              <Link to="/escrow"><Shield className="h-5 w-5" /> Escrow</Link>
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
            <p className="text-xs text-muted-foreground text-center">
              Rate: 1 {fromCurrency} = {getRate(fromCurrency, toCurrency).toFixed(toCurrency === "BTC" ? 8 : 2)} {toCurrency}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="card-gradient border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link to="/transactions">View All</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentTx.map(tx => {
            const Icon = txIcon[tx.type];
            return (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    tx.type === "receive" ? "bg-success/10 text-success" :
                    tx.type === "escrow" ? "bg-warning/10 text-warning" :
                    "bg-primary/10 text-primary"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.desc}</p>
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === "receive" ? "text-success" : ""}`}>{tx.amount}</p>
                  <p className={`text-xs ${tx.status === "pending" ? "text-warning" : "text-muted-foreground"}`}>{tx.status}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
