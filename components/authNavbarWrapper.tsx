// components/AuthNavbarWrapper.tsx
"use client";

import { useAuth } from "@/lib/auth-context";
import NavBar from "./navBar";
import { usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/", "/login", "/register"]; // tweak for your app

export default function AuthNavbarWrapper() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (PUBLIC_ROUTES.includes(pathname)) return null;

  if (isLoading) return null;

  if (!user) return null;

  return (
    <div>
      {pathname === "/dashboard" ? (
        <div className="ml-64">
          <NavBar />{" "}
        </div>
      ) : (
        <NavBar />
      )}
    </div>
  );
}
