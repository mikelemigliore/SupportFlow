// Add this import at the top
"use client";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";

function DashboardPage() {
  // Add this inside your component
  const { user, isLoading, signOut, guestSignout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/"); // ⬅ if no user, kick to login
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    if (user && user.email === "guest@cinepiks.com") {
      await guestSignout();

      router.push("/");
      //router.refresh();
    } else {
      await nextAuthSignOut({ redirect: false });
      await signOut();
      router.push("/"); // ⬅ redirect after logout
      //window.location.reload();
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard Page</h1>
      <div className="space-x-4">
        <Link href="/tickets">Tickets</Link>
        <Link href="/workflows">Workflows</Link>
        <Link href="/insights">Insights</Link>
        {/* // Add this button in your header/navigation */}
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default DashboardPage;
