"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="w-full cursor-pointer"
    >
      <div className="flex space-x-4">
        <span className="ml-4">Continue with Google</span>
        <FaGoogle className="mt-0.5" />
      </div>
    </Button>
  );
}

export function GithubSignInButton() {
  const handleClick = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="w-full cursor-pointer"
    >
      <div className="flex space-x-4">
        <span className="ml-4">Continue with Github</span>
        <FaGithub className="mt-0.5" />
      </div>
    </Button>
  );
}
