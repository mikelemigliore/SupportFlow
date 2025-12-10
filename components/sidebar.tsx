// Add this import at the top
"use client";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { CiReceipt } from "react-icons/ci";
import { GoWorkflow } from "react-icons/go";
import { CgInsights } from "react-icons/cg";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavUser } from "@/components/NavUser";

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

  // if (isLoading)
  //   return (
  //     <div className="flex items-center justify-center my-[30vh]">
  //       <Spinner className="size-25" />
  //     </div>
  //   );

  return (
    <div className="">
      <SidebarProvider>
        <SidebarInset className="">
          <div className="">
            <SidebarTrigger className="space-x-3"></SidebarTrigger>
          </div>
        </SidebarInset>
        <Sidebar collapsible="offcanvas">
          <SidebarContent>
            <SidebarHeader className="">
              <a
                href="/dashboard"
                className="pb-3 mt-1 flex items-center border-b"
              >
                <Avatar className="">
                  <AvatarImage src="/SupportflowLogo.svg" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold pl-4">
                  AI/SupportFlow360
                </span>
              </a>
            </SidebarHeader>
            <SidebarGroup>
              <SidebarGroupLabel>Create New</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="">
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <div>
                        <CiReceipt />
                        <Link href="/tickets">Ticket</Link>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="">
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <div>
                        <GoWorkflow />
                        <Link href="/workflows">Workflow</Link>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="">
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <div>
                        <CgInsights />
                        <Link href="/insights">Insight</Link>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>View Past</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="">
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <div>
                        <CiReceipt />
                        <Link href="/pastTickets">Ticket</Link>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="">
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <div>
                        <GoWorkflow />
                        <Link href="/pastComparisons">Workflow</Link>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="">
                    <SidebarMenuButton
                      asChild
                      className="data-[slot=sidebar-menu-button]:!p-1.5"
                    >
                      <div>
                        <CgInsights />
                        <Link href="/pastInsights">Insight</Link>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          {/* <SidebarFooter className="absolute md:bottom-0 bottom-77 w-full"> */}
          <SidebarFooter className="">
            <NavUser userName={user?.name} userEmail={user?.email} />
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default SideBar;

