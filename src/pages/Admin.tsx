import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3, Users, History, Shield, FileCheck, DollarSign,
  Bitcoin, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Clock, Ban
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "0", icon: Users, change: "—" },
  { label: "Transactions", value: "0", icon: History, change: "—" },
  { label: "Escrow Active", value: "0", icon: Shield, change: "—" },
  { label: "KYC Pending", value: "0", icon: FileCheck, change: "—" },
];

const recentUsers = [
  { name: "John Doe", phone: "+2348000001", kyc: "verified", frozen: false },
  { name: "Jane Smith", phone: "+2348000002", kyc: "pending", frozen: false },
  { name: "Mike Brown", phone: "+2348000003", kyc: "none", frozen: true },
];

const recentEscrow = [
  { id: "ESC001", from: "John", to: "Mike", amount: "0.05 BTC", status: "pending" },
  { id: "ESC002", from: "Sarah", to: "Tom", amount: "0.1 BTC", status: "released" },
];

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> Admin Panel</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="card-gradient border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users */}
        <Card className="card-gradient border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.map(user => (
              <div key={user.phone} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.kyc === "verified" ? "bg-success/10 text-success" :
                    user.kyc === "pending" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>{user.kyc}</span>
                  {user.frozen && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Frozen</span>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    {user.frozen ? "Unfreeze" : "Freeze"}
                  </Button>
                </div>
              </div>
            ))}
            <p className="text-xs text-center text-muted-foreground">Connect Lovable Cloud for real user data</p>
          </CardContent>
        </Card>

        {/* Escrow Management */}
        <Card className="card-gradient border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Escrow Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEscrow.map(esc => (
              <div key={esc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{esc.from} → {esc.to}</p>
                  <p className="text-xs text-muted-foreground">{esc.id} · {esc.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    esc.status === "pending" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                  }`}>{esc.status}</span>
                  {esc.status === "pending" && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-success hover:text-success">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Release
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">
                        <XCircle className="h-3 w-3 mr-1" /> Refund
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* KYC Review */}
        <Card className="card-gradient border-border lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><FileCheck className="h-5 w-5 text-primary" /> KYC Review Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 text-muted-foreground">
              <FileCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No pending KYC submissions</p>
              <p className="text-xs mt-1">Connect Lovable Cloud to process KYC documents</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
