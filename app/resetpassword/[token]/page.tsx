"use client";

// import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  email: string;
}

// type ResetPasswordProps = {
//   params: { token: string }; // ✅ no Promise here
// };

function ResetPassword() {
  const params = useParams<{ token: string }>();
  const token = params.token as string;

  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  //const { data: session, status: sessionStatus } = useSession();

  // ✅ Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verifytoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (res.status === 400) {
          setError("Invalid token or token has expired");
          setVerified(true);
          return;
        }

        if (res.status === 200) {
          const userData = await res.json(); // should contain at least { email }
          setUser(userData);
          setError("");
          setVerified(true);
        }
      } catch (err) {
        console.error(err);
        setError("Error verifying token, please try again.");
        setVerified(true);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const confirmTogglePasswordVisibility = () => {
    setConfirmShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const password = (form[0] as HTMLInputElement).value;
    const confirmPassword = (form[1] as HTMLInputElement).value;

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user?.email, // ✅ this will be returned by /api/verifytoken
          token, // (optional) we can also send the token to double-check on backend
        }),
      });

      if (res.status === 400) {
        setError("Something went wrong, please try again.");
        return;
      }

      if (res.status === 200) {
        toast("Password Reset Successful!");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Error, please try again.");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="relative w-[20vw] h-[37vh] z-10">
        <CardHeader>
          <CardTitle>Insert New Password</CardTitle>
          <CardDescription>
            After inserting a new password, you will be redirected to the log-in
            page.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="gap-3 space-y-2">
              <Label htmlFor="newPassword">
                <b>New Password</b>
              </Label>
              <div className="flex relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password..."
                  required
                />
                <div
                  className="absolute md:right-[1vw] right-[7vw] top-[50%] transform -translate-y-[50%] cursor-pointer bg-buttonColor pl-[0.5vw]"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="bg-buttonColor md:w-[1.3vw] md:h-[1.3vw] w-[6vw] h-[6vh]" />
                  ) : (
                    <AiOutlineEye className="bg-buttonColor md:w-[1.3vw] md:h-[1.3vw] w-[6vw] h-[6vh]" />
                  )}
                </div>
              </div>
            </div>
            <div className="gap-3 space-y-2">
              <Label htmlFor="name">
                <b>Confirm New Password</b>
              </Label>
              <div className="flex relative">
                <Input
                  type={confirmShowPassword ? "text" : "password"}
                  placeholder="Confirm password..."
                  required
                />
                <div
                  className="absolute md:right-[1vw] right-[7vw] top-[50%] transform -translate-y-[50%] cursor-pointer bg-buttonColor pl-[0.5vw]"
                  onClick={confirmTogglePasswordVisibility}
                >
                  {confirmShowPassword ? (
                    <AiOutlineEyeInvisible className="bg-buttonColor md:w-[1.3vw] md:h-[1.3vw] w-[6vw] h-[6vh]" />
                  ) : (
                    <AiOutlineEye className="bg-buttonColor md:w-[1.3vw] md:h-[1.3vw] w-[6vw] h-[6vh]" />
                  )}
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-between">
              <Link href="/">Cancel</Link>
              <Button className="cursor-pointer mr-[-1vw]" type="submit">
                Reset Password
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <p className="text-red-600 md:text-[0.9vw] text-[4vw] mt-[0.5vw]">
          {error}
        </p>
      </Card>
    </div>
  );
}

export default ResetPassword;
