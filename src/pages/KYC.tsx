import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Upload, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function KYC() {
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
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><UserCheck className="h-6 w-6 text-primary" /> KYC Verification</h1>
        <p className="text-muted-foreground">Verify your identity to unlock full features</p>
      </div>

      {/* Status Card */}
      <Card className="card-gradient border-border">
        <CardContent className="p-6 flex items-center gap-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${status.bg}`}>
            <StatusIcon className={`h-6 w-6 ${status.color}`} />
          </div>
          <div>
            <p className="font-semibold">KYC Status</p>
            <p className={`text-sm font-medium ${status.color}`}>{status.label}</p>
          </div>
        </CardContent>
      </Card>

      {kycStatus === "none" || kycStatus === "rejected" ? (
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle>Submit Documents</CardTitle>
            <CardDescription>Upload your ID and a selfie for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => { e.preventDefault(); alert("Connect Lovable Cloud for document upload & review."); }} className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Government ID</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById("id-upload")?.click()}>
                  {idFile ? (
                    <p className="text-sm text-success font-medium">{idFile.name}</p>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload passport, driver's license, or national ID</p>
                    </>
                  )}
                  <input id="id-upload" type="file" accept="image/*,.pdf" className="hidden" onChange={e => setIdFile(e.target.files?.[0] || null)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Selfie with ID</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => document.getElementById("selfie-upload")?.click()}>
                  {selfieFile ? (
                    <p className="text-sm text-success font-medium">{selfieFile.name}</p>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Take a selfie holding your ID document</p>
                    </>
                  )}
                  <input id="selfie-upload" type="file" accept="image/*" capture="user" className="hidden" onChange={e => setSelfieFile(e.target.files?.[0] || null)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Full Legal Name</Label>
                <Input placeholder="As shown on your ID" required />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" required />
              </div>
              <Button type="submit" className="w-full h-12 font-semibold glow-primary" disabled={!idFile || !selfieFile}>
                Submit for Review
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-gradient border-border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {kycStatus === "pending" ? "Your documents are being reviewed. This usually takes 1-2 business days." : "Your identity has been verified."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
