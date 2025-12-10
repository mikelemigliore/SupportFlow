"use client";

import { SignInForm } from "@/components/signin-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full">
      <div className="relative hidden block md:block md:w-1/2 lg:w-2/3 bg-black-200">
        <img src="/AISupportFlow360.svg" className="w-full h-full object-cover" />
      </div>

      <div className="flex w-full md:w-1/2 lg:w-1/3 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
