import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, ArrowRight, CheckCircle2, Clock } from "lucide-react";

const escrowList = [
  { id: "ESC001", amount: "0.05 BTC", recipient: "Mike Johnson", status: "pending", date: "2024-12-18" },
  { id: "ESC002", amount: "0.1 BTC", recipient: "Sarah Williams", status: "released", date: "2024-12-10" },
  { id: "ESC003", amount: "0.02 BTC", recipient: "Tom Brown", status: "refunded", date: "2024-12-05" },
];

export default function Escrow() {
  const [showCreate, setShowCreate] = useState(false);
  const [pin, setPin] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> BTC Escrow</h1>
          <p className="text-muted-foreground">Secure BTC transactions with escrow protection</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="glow-primary">
          Create Escrow
        </Button>
      </div>

      {showCreate && (
        <Card className="card-gradient border-border animate-fade-in">
          <CardHeader>
            <CardTitle>New Escrow Transaction</CardTitle>
            <CardDescription>BTC will be locked until conditions are met</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => { e.preventDefault(); alert("Connect Lovable Cloud to create escrow."); }} className="space-y-4">
              <div className="space-y-2">
                <Label>Recipient BTC Address</Label>
                <Input placeholder="bc1q..." required />
              </div>
              <div className="space-y-2">
                <Label>Amount (BTC)</Label>
                <Input type="number" step="0.00000001" placeholder="0.00000000" required />
              </div>
              <div className="space-y-2">
                <Label>Release Condition</Label>
                <Input placeholder="e.g. Delivery confirmed" required />
              </div>
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
        <CardContent className="space-y-3">
          {escrowList.map(esc => (
            <div key={esc.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  esc.status === "released" ? "bg-success/10 text-success" :
                  esc.status === "refunded" ? "bg-destructive/10 text-destructive" :
                  "bg-warning/10 text-warning"
                }`}>
                  {esc.status === "released" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{esc.amount} → {esc.recipient}</p>
                  <p className="text-xs text-muted-foreground">{esc.id} · {esc.date}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                esc.status === "released" ? "bg-success/10 text-success" :
                esc.status === "refunded" ? "bg-destructive/10 text-destructive" :
                "bg-warning/10 text-warning"
              }`}>{esc.status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
