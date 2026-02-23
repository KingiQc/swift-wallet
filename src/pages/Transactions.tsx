import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Shield, History } from "lucide-react";
import { useState } from "react";

const transactions = [
  { id: "1", type: "send", desc: "To Jane Smith", amount: "-$150.00", currency: "USD", date: "2024-12-20", status: "completed" },
  { id: "2", type: "receive", desc: "From John Doe", amount: "+0.0025 BTC", currency: "BTC", date: "2024-12-20", status: "completed" },
  { id: "3", type: "convert", desc: "USD → NGN", amount: "$500.00", currency: "USD", date: "2024-12-19", status: "completed" },
  { id: "4", type: "escrow", desc: "Escrow to Mike", amount: "-0.05 BTC", currency: "BTC", date: "2024-12-18", status: "pending" },
  { id: "5", type: "receive", desc: "Salary deposit", amount: "+$3,200.00", currency: "USD", date: "2024-12-15", status: "completed" },
  { id: "6", type: "send", desc: "To Alice Brown", amount: "-₦50,000", currency: "NGN", date: "2024-12-14", status: "completed" },
  { id: "7", type: "convert", desc: "GBP → EUR", amount: "£200.00", currency: "GBP", date: "2024-12-13", status: "failed" },
];

const iconMap = { send: ArrowUpRight, receive: ArrowDownLeft, convert: ArrowLeftRight, escrow: Shield };

export default function Transactions() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><History className="h-6 w-6 text-primary" /> Transactions</h1>
          <p className="text-muted-foreground">Your complete transaction history</p>
        </div>
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

      <Card className="card-gradient border-border">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No transactions found</div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(tx => {
                const Icon = iconMap[tx.type as keyof typeof iconMap] || ArrowUpRight;
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === "receive" ? "bg-success/10 text-success" :
                        tx.type === "escrow" ? "bg-warning/10 text-warning" :
                        tx.status === "failed" ? "bg-destructive/10 text-destructive" :
                        "bg-primary/10 text-primary"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.desc}</p>
                        <p className="text-xs text-muted-foreground">{tx.date} · {tx.currency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.type === "receive" ? "text-success" : tx.status === "failed" ? "text-destructive" : ""}`}>
                        {tx.amount}
                      </p>
                      <p className={`text-xs capitalize ${
                        tx.status === "pending" ? "text-warning" : tx.status === "failed" ? "text-destructive" : "text-muted-foreground"
                      }`}>{tx.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
