"use client";

//import Image from "next/image";
// import googleLogo from "@/public/google.png";
// import githubLogo from "@/public/github.png";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn("google", { callbackUrl: "/dashboard" });
    //window.location.href = "/dashboard";
  };

  return (
    <Button variant="outline" onClick={handleClick} className="w-full">
      {/* <Image src={googleLogo} alt="Google Logo" width={20} height={20} /> */}
      <span className="ml-4">Continue with Google</span>
    </Button>
  );
}

export function GithubSignInButton() {
  const handleClick = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <Button variant="outline" onClick={handleClick} className="w-full">
      {/* <Image src={githubLogo} alt="Github Logo" width={20} height={20} /> */}
      <span className="ml-4">Continue with Github</span>
    </Button>
  );
}
