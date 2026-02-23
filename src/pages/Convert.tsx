import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES, type CurrencyCode } from "@/lib/constants";
import { ArrowLeftRight, Lock } from "lucide-react";

const rates: Record<string, number> = {
  "USD-NGN": 1550, "EUR-NGN": 1680, "GBP-NGN": 1950,
  "BTC-USD": 67500, "USD-EUR": 0.92, "USD-GBP": 0.79,
};

function getRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1;
  if (rates[`${from}-${to}`]) return rates[`${from}-${to}`];
  if (rates[`${to}-${from}`]) return 1 / rates[`${to}-${from}`];
  return 1;
}

export default function Convert() {
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [to, setTo] = useState<CurrencyCode>("NGN");
  const [amount, setAmount] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");

  const converted = amount ? (parseFloat(amount) * getRate(from, to)).toFixed(to === "BTC" ? 8 : 2) : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPin) { setShowPin(true); return; }
    alert("Conversion submitted — connect Lovable Cloud to process.");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Convert Currency</h1>
        <p className="text-muted-foreground">Convert between fiat and crypto</p>
      </div>
      <Card className="card-gradient border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ArrowLeftRight className="h-5 w-5 text-primary" /> Currency Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex gap-2">
                <Select value={from} onValueChange={v => setFrom(v as CurrencyCode)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map(c => (
                      <SelectItem key={c} value={c}>{CURRENCIES[c].flag} {c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1" required />
              </div>
            </div>
            <div className="flex justify-center">
              <button type="button" onClick={() => { setFrom(to); setTo(from); }} className="p-2 rounded-full bg-muted hover:bg-accent transition-colors">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
              </button>
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex gap-2">
                <Select value={to} onValueChange={v => setTo(v as CurrencyCode)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map(c => (
                      <SelectItem key={c} value={c}>{CURRENCIES[c].flag} {c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input readOnly value={converted} placeholder="Result" className="flex-1" />
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              1 {from} = {getRate(from, to).toFixed(to === "BTC" ? 8 : 2)} {to}
            </div>
            {showPin && (
              <div className="space-y-2 animate-fade-in">
                <Label className="flex items-center gap-2"><Lock className="h-4 w-4" /> Enter PIN</Label>
                <Input type="password" maxLength={4} inputMode="numeric" value={pin} onChange={e => setPin(e.target.value.replace(/\D/, ""))} placeholder="••••" required />
              </div>
            )}
            <Button type="submit" className="w-full h-12 font-semibold glow-primary">
              {showPin ? "Confirm Conversion" : "Convert"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
