// Add this import at the top
"use client";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavBar from "@/components/navBar";

function SideBar() {
  const { user, isLoading, signOut, guestSignout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/"); 
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    if (user && user.email === "guest@cinepiks.com") {
      await guestSignout();

      router.push("/");
    } else {
      await nextAuthSignOut({ redirect: false });
      await signOut();
      router.push("/"); 
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <SidebarProvider>
        <Sidebar collapsible="offcanvas">
          <SidebarHeader className="p-0">
            <SidebarMenu>
              <SidebarMenuItem className="border-b ">
                <SidebarMenuButton asChild>
                  <a href="/dashboard" className="my-3">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-base font-semibold">
                      SupportFlow360
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <div className="space-y-6 p-2">
                <div>
                  <SidebarGroupLabel>Create New</SidebarGroupLabel>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <Link href="/tickets">Ticket</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <Link href="/workflows">Workflow</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <Link href="/insights">Insight</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
                <div>
                  <SidebarGroupLabel>View Past</SidebarGroupLabel>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <Link href="/pastTickets">Tickets</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <Link href="/pastComparisons">Workflows</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <Link href="/pastInsights">Insights</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </div>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent></SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default SideBar;
