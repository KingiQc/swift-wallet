import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings as SettingsIcon, User, Bitcoin, Lock, UserCheck, BarChart3,
  Upload, FileText, CheckCircle2, Clock, AlertCircle, Copy, RefreshCw,
  Users, History, Shield, FileCheck, XCircle, LogOut
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// ─── KYC Section ───
function KYCSection() {
  const [kycStatus] = useState<"none" | "pending" | "verified" | "rejected">("none");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const statusConfig = {
    none: { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted", label: "Not Submitted" },
    pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Under Review" },
    verified: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Verified" },
    rejected: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
  };

  const status = statusConfig[kycStatus];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      <Card className="card-gradient border-border">
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${status.bg}`}>
            <StatusIcon className={`h-6 w-6 ${status.color}`} />
          </div>
          <div>
            <p className="font-semibold">KYC Status</p>
            <p className={`text-sm font-medium ${status.color}`}>{status.label}</p>
          </div>
        </CardContent>
      </Card>

      {(kycStatus === "none" || kycStatus === "rejected") && (
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle className="text-base">Submit Documents</CardTitle>
            <CardDescription>Upload your ID and a selfie for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => { e.preventDefault(); alert("Connect Lovable Cloud for document upload & review."); }} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Government ID</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById("id-upload")?.click()}>
                  {idFile ? <p className="text-sm text-success font-medium">{idFile.name}</p> : (
                    <><Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">Click to upload passport, driver's license, or national ID</p></>
                  )}
                  <input id="id-upload" type="file" accept="image/*,.pdf" className="hidden" onChange={e => setIdFile(e.target.files?.[0] || null)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Selfie with ID</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById("selfie-upload")?.click()}>
                  {selfieFile ? <p className="text-sm text-success font-medium">{selfieFile.name}</p> : (
                    <><Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">Take a selfie holding your ID document</p></>
                  )}
                  <input id="selfie-upload" type="file" accept="image/*" capture="user" className="hidden" onChange={e => setSelfieFile(e.target.files?.[0] || null)} />
                </div>
              </div>
              <div className="space-y-2"><Label>Full Legal Name</Label><Input placeholder="As shown on your ID" required /></div>
              <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" required /></div>
              <Button type="submit" className="w-full h-12 font-semibold glow-primary" disabled={!idFile || !selfieFile}>Submit for Review</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Admin Section ───
const stats = [
  { label: "Total Users", value: "0", icon: Users },
  { label: "Transactions", value: "0", icon: History },
  { label: "Escrow Active", value: "0", icon: Shield },
  { label: "KYC Pending", value: "0", icon: FileCheck },
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

function AdminSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="card-gradient border-border">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Icon className="h-4 w-4" /><span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="card-gradient border-border">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Users</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recentUsers.map(user => (
            <div key={user.phone} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.phone}</p></div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${user.kyc === "verified" ? "bg-success/10 text-success" : user.kyc === "pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{user.kyc}</span>
                {user.frozen && <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Frozen</span>}
                <Button variant="ghost" size="sm" className="h-7 text-xs">{user.frozen ? "Unfreeze" : "Freeze"}</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="card-gradient border-border">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Escrow Queue</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recentEscrow.map(esc => (
            <div key={esc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div><p className="text-sm font-medium">{esc.from} → {esc.to}</p><p className="text-xs text-muted-foreground">{esc.id} · {esc.amount}</p></div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${esc.status === "pending" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{esc.status}</span>
                {esc.status === "pending" && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-success hover:text-success"><CheckCircle2 className="h-3 w-3 mr-1" /> Release</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive"><XCircle className="h-3 w-3 mr-1" /> Refund</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Settings Page ───
export default function Settings() {
  const navigate = useNavigate();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);

  const handlePinInput = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number, val: string) => {
    if (val.length > 1) return;
    setter(prev => { const n = [...prev]; n[idx] = val.replace(/\D/, ""); return n; });
    if (val && idx < 3) {
      const next = document.getElementById(`pin-${setter === setPin ? "old" : "new"}-${idx + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><SettingsIcon className="h-6 w-6 text-primary" /> Settings</h1>
        <p className="text-muted-foreground">Manage your account, security & verification</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          {/* Profile Info */}
          <Card className="card-gradient border-border">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Profile Info</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">First Name</Label><p className="text-sm font-medium">—</p></div>
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">Last Name</Label><p className="text-sm font-medium">—</p></div>
              </div>
              <div className="space-y-1"><Label className="text-xs text-muted-foreground">Phone Number</Label><p className="text-sm font-medium">—</p></div>
              <div className="space-y-1"><Label className="text-xs text-muted-foreground">Account Number</Label><p className="text-sm font-medium font-mono">—</p></div>
            </CardContent>
          </Card>

          {/* BTC Address */}
          <Card className="card-gradient border-border">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bitcoin className="h-5 w-5 text-primary" /> BTC Address</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-mono flex-1 truncate text-muted-foreground">Connect Lovable Cloud to generate</p>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Copy className="h-4 w-4" /></Button>
              </div>
              <Button variant="secondary" className="w-full gap-2"><RefreshCw className="h-4 w-4" /> Regenerate Address (requires PIN)</Button>
            </CardContent>
          </Card>

          {/* Change PIN */}
          <Card className="card-gradient border-border">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Change PIN</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={e => { e.preventDefault(); alert("Connect Lovable Cloud to change PIN."); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Current PIN</Label>
                  <div className="flex gap-3 justify-center">
                    {pin.map((d, i) => (
                      <Input key={i} id={`pin-old-${i}`} type="password" inputMode="numeric" maxLength={1} value={d}
                        onChange={e => handlePinInput(setPin, i, e.target.value)}
                        className="w-12 h-12 text-center text-lg font-bold" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New PIN</Label>
                  <div className="flex gap-3 justify-center">
                    {newPin.map((d, i) => (
                      <Input key={i} id={`pin-new-${i}`} type="password" inputMode="numeric" maxLength={1} value={d}
                        onChange={e => handlePinInput(setNewPin, i, e.target.value)}
                        className="w-12 h-12 text-center text-lg font-bold" />
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 glow-primary font-semibold">Update PIN</Button>
              </form>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground" onClick={() => navigate("/login")}>
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>
        </TabsContent>

        <TabsContent value="kyc"><KYCSection /></TabsContent>
        <TabsContent value="admin"><AdminSection /></TabsContent>
      </Tabs>
    </div>
  );
}
