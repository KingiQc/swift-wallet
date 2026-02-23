import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES, type CurrencyCode } from "@/lib/constants";
import { Send as SendIcon, User, Hash, Lock } from "lucide-react";

export default function SendMoney() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPin) { setShowPin(true); return; }
    alert("Transfer submitted — connect Lovable Cloud to process real transactions.");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Send Money</h1>
        <p className="text-muted-foreground">Transfer funds to another wallet</p>
      </div>
      <Card className="card-gradient border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><SendIcon className="h-5 w-5 text-primary" /> New Transfer</CardTitle>
          <CardDescription>Enter recipient details and amount</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Recipient Account</Label>
              <Input placeholder="Account number or BTC address" required />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={v => setCurrency(v as CurrencyCode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map(c => (
                    <SelectItem key={c} value={c}>{CURRENCIES[c].flag} {c} – {CURRENCIES[c].name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Hash className="h-4 w-4" /> Amount</Label>
              <Input type="number" placeholder="0.00" step="any" min="0" required />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input placeholder="Payment for..." />
            </div>
            {showPin && (
              <div className="space-y-2 animate-fade-in">
                <Label className="flex items-center gap-2"><Lock className="h-4 w-4" /> Enter PIN</Label>
                <Input type="password" maxLength={4} inputMode="numeric" value={pin} onChange={e => setPin(e.target.value.replace(/\D/, ""))} placeholder="••••" required />
              </div>
            )}
            <Button type="submit" className="w-full h-12 font-semibold glow-primary">
              {showPin ? "Confirm Transfer" : "Send Money"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
