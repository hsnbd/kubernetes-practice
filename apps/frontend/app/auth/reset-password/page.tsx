import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPreview() {
	return (
		<div className="flex flex-col min-h-screen justify-center items-center">	
			<h1 className="text-4xl font-bold">Reset Password</h1>

			<form className="flex flex-col gap-4 p-4 w-80">
				<Label htmlFor="password" className="text-xs -mb-3">Password</Label>
				<Input type="password" placeholder="Password" />
				<Label htmlFor="confirmPassword" className="text-xs -mb-3">Confirm Password</Label>
				<Input type="password" placeholder="Confirm Password" />
				<Button type="submit" className="w-full mt-4">Reset Password</Button>
			</form>
		</div>
	);
}



