"use client";
import { Button } from "@/components/ui/button";
import { SignInForm } from "@/components/signin-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import { useAuth } from "@/lib/auth-context";
//import { usePathname } from "next/navigation";
import {
  GithubSignInButton,
  GoogleSignInButton,
} from "@/components/authButtons";

export default function Page() {
  const router = useRouter();
  //const pathname = usePathname();
  //const { isLoading } = useAuth();

  const handleContinueAsGuest = async () => {
    //if (isLoading) return;

    const res = await fetch("/api/auth/guest", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      console.log("Error");
      return;
    }
    window.location.href = "/dashboard";
    //router.push("/dashboard");
    console.log("Continued as guest");
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
        <GoogleSignInButton />
        <GithubSignInButton />
        <Button onClick={handleContinueAsGuest}>Continue as Guest</Button>
        <h3>Already have an account?</h3>
        <Link href="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
