import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="mb-4 text-center space-y-2 w-80">
        <h1 className="text-4xl font-bold mb-2">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">Enter your email address to receive a password reset link.</p>
      </div>
      <form className="flex flex-col gap-4 p-4 w-80">
        <Label htmlFor="email" className="text-xs -mb-3">Email</Label>
        <Input type="email" placeholder="Email" />
        <Button type="submit" className="w-full mt-4">Send Reset Link</Button>
      </form>
    </div>
  );
}
