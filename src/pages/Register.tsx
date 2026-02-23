import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Bitcoin, Eye, EyeOff, Camera, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

type Step = 1 | 2 | 3;

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", password: "", confirmPassword: "" });
  const [faceSteps, setFaceSteps] = useState({ up: false, right: false, left: false, front: false });
  const [pin, setPin] = useState(["", "", "", ""]);

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const simulateFaceStep = (direction: keyof typeof faceSteps) => {
    setTimeout(() => {
      setFaceSteps(prev => ({ ...prev, [direction]: true }));
    }, 800);
  };

  const allFaceStepsDone = Object.values(faceSteps).every(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md card-gradient border-border animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bitcoin className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 ? "Create Account" : step === 2 ? "Face Verification" : "Set Your PIN"}
          </CardTitle>
          <CardDescription>
            {step === 1 ? "Step 1: Account details" : step === 2 ? "Step 2: Verify your identity" : "Step 3: Secure your wallet"}
          </CardDescription>
          <Progress value={progress} className="mt-4 h-2" />
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cell Number</Label>
                <Input type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="showPw" checked={showPassword} onCheckedChange={c => setShowPassword(!!c)} />
                <Label htmlFor="showPw" className="text-sm text-muted-foreground cursor-pointer">Show password</Label>
              </div>
              <Button type="submit" className="w-full h-12 font-semibold glow-primary">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="aspect-square max-w-[240px] mx-auto rounded-2xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-3">
                <Camera className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Camera preview</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["up", "right", "left", "front"] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => simulateFaceStep(dir)}
                    disabled={faceSteps[dir]}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-300 text-sm font-medium ${
                      faceSteps[dir]
                        ? "border-success/50 bg-success/10 text-success"
                        : "border-border bg-muted text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {faceSteps[dir] ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
                    Look {dir.charAt(0).toUpperCase() + dir.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">Tap each direction to simulate face detection</p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!allFaceStepsDone} className="flex-1 glow-primary">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className="text-center text-sm text-muted-foreground">Enter a 4-digit PIN for transfers & security</p>
              <div className="flex justify-center gap-4">
                {pin.map((digit, i) => (
                  <Input
                    key={i}
                    id={`pin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handlePinChange(i, e.target.value.replace(/\D/, ""))}
                    className="w-14 h-14 text-center text-2xl font-bold"
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={() => navigate("/dashboard")}
                  disabled={pin.some(d => !d)}
                  className="flex-1 glow-primary"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
