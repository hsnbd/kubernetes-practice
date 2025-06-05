import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
  return (
		<div className="flex flex-col min-h-screen justify-center items-center">
			<div className="mb-2 text-center space-y-2">
				<h1 className="text-4xl font-bold">Sign Up</h1>
				<p className="text-sm text-muted-foreground">Create an account</p>
			</div>
			<form className="flex flex-col gap-4 p-4 w-80">
				<Label htmlFor="name" className="text-xs -mb-3">Full Name</Label>
				<Input type="text" placeholder="Full name" />
				<Label htmlFor="email" className="text-xs -mb-3">Email</Label>
				<Input type="email" placeholder="Email" />
				<Label htmlFor="password" className="text-xs -mb-3">Password</Label>
				<Input type="password" placeholder="Password" />
				<Button type="submit" className="w-full mt-4">
					Sign Up
				</Button>
				<Link href="/auth/signin" className="text-blue-500 text-xs text-center mt-4">
					Already have an account?
				</Link>
			</form>
		</div>
	);
}


