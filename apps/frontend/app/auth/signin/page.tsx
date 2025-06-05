import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SigninPage() {
  return (
		<div className="flex flex-col min-h-screen justify-center items-center">
			<div className="mb-2 text-center space-y-2">
				<h1 className="text-4xl font-bold">Sign In</h1>
				<p className="text-sm text-muted-foreground">Sign in to your account</p>
			</div>
			<form className="flex flex-col gap-4 p-4 w-80">
				<Label htmlFor="email" className="text-xs -mb-3">Email</Label>
				<Input type="email" placeholder="Email" />
				<Label htmlFor="password" className="text-xs -mb-3">Password</Label>
				<Input type="password" placeholder="Password" />
				<Button type="submit" className="w-full mt-4">
					Sign In
				</Button>
			</form>
			<Link href="/auth/signup" className="text-blue-500 text-xs text-center mt-4">
				Don&apos;t have an account?
      </Link>
      <Link href="/auth/forgot-password" className="text-blue-500 text-xs text-center mt-2">
        Forgot Password?
      </Link>
		</div>
	);
}

