// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import Link from "next/link"

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle>Login to your account</CardTitle>
//           <CardDescription>
//             Enter your email below to login to your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form>
//             <FieldGroup>
//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password">Password</FieldLabel>
//                   <a
//                     href="#"
//                     className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </a>
//                 </div>
//                 <Input id="password" type="password" required />
//               </Field>
//               <Field>
//                 <Button type="submit">Login</Button>
//                 <Button variant="outline" type="button">
//                   Login with Google
//                 </Button>
//                 <Link href="/dashboard" passHref>
//                   <Button className="w-full" variant="outline" type="button">
//                     Continue as Guest
//                   </Button>
//                 </Link>
//                 <FieldDescription className="text-center">
//                   Don&apos;t have an account? <a href="/signup">Sign up</a>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    // if(password.length === 0){
    //   return setError("An error occurred. Please try again.");
    // }

    console.log("It's working 1");
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn(email, password);
    console.log("It's working 2");

    if (result.success) {
      console.log("It's working 3");
      window.location.href = "/dashboard";
      //router.push("/dashboard")
    } else {
      setError(result.error || "An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault(); // ✅ always prevent default first
  //   setError("");

  //   if (!email.trim()) {
  //     setError("Email is required.");
  //     return;
  //   }

  //   if (!password.trim()) {
  //     setError("Password is required.");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);

  //     const result = await signIn(email, password);

  //     if (result.success) {
  //       window.location.href = "/dashboard";
  //       // or: router.push("/dashboard");
  //     } else {
  //       setError(result.error || "Invalid email or password.");
  //     }
  //   } catch (err) {
  //     setError("An unexpected error occurred. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
