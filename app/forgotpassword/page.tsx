"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

function ForgotPassword() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000); 

      return () => clearTimeout(timer); 
    }
    setIsLoading(false);
  }, [isLoading]);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emailInput = e.target[0].value;
    const email = emailInput.toLowerCase();

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    try {
      const res = await fetch("/api/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (res.status === 400) {
        setError("User with this email is not registered");
      }
      if (res.status === 200) {
        setError("");
        router.push("/");
      }
      setIsLoading(true);
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-svh w-full">
      <div className="relative hidden block md:block md:w-1/2 lg:w-2/3 bg-gray-200">
        <img src="/AISupportFlow360.svg" className="w-full h-full object-cover" />
      </div>

      <div className="flex w-full md:w-1/2 lg:w-1/3 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Reset Password
              </CardTitle>
              <CardDescription>
                Please enter your current email address to receive a link for
                resetting your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input type="text" placeholder="Email..." required />
                  </Field>
                  <Field>
                    <div className="flex justify-between">
                      <Link href="/">Cancel</Link>
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        type="submit"
                        onClick={() =>
                          toast("Password reset link has been sent")
                        }
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>Send</>
                        )}
                      </Button>
                    </div>
                  </Field>
                </FieldGroup>
                <p className="text-red-600 md:text-[0.9vw] text-[4vw] mt-[0.5vw]">
                  {error && error}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
