// components/AuthNavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import NavBar from "./navBar";

export default function AuthNavbarWrapper() {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";

  const hideOnRoutes = ["/", "/signup", "/forgotpassword"];
  const shouldHide =
    hideOnRoutes.includes(pathname) || pathname.startsWith("/resetpassword");

  if (shouldHide) {
    return null; // no navbar at all
  }

  return (
    <div className={isDashboard ? "ml-64" : ""}>
      <NavBar />
    </div>
  );
}
