"use client";

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TbDotsVertical } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import handleDeleteAccountBtn from "@/utils/handleDeleteAccountBtn";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserProps = {
  userName?: string | null;
  userEmail?: string | null;
};

export function NavUser({ userName, userEmail }: UserProps) {
  const { user, isLoading, signOut, guestSignout } = useAuth();
  const [confirmationInput, setConfirmationInput] = useState("");
  const router = useRouter();
  const requiredPhrase = "delete-my-account";

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    try {
      await handleDeleteAccountBtn({
        user: String(user?.id),
      });
      toast("Account Deleted Successfully");

      await nextAuthSignOut({ redirect: false });
      await signOut();
      router.push("/");
    } catch (err: any) {
      console.error(err?.message || "Failed to delete Account.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 cursor-pointer"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{userName}</span>
            <span className="text-muted-foreground truncate text-xs">
              {userEmail}
            </span>
          </div>
          <div>
            <TbDotsVertical />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userName}</span>
              <span className="text-muted-foreground truncate text-xs">
                {userEmail}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        {user?.id === "guest-user" ? (
          <div></div>
        ) : (
          <div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full cursor-pointer">
                      Delete Account <MdDelete />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        Deleting your account will cause the loss of all your
                        data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">
                          Type to confirm: "delete-my-account"
                        </Label>
                        <Input
                          id="delete-1"
                          name="delete"
                          placeholder="Type here..."
                          value={confirmationInput}
                          onChange={(e) => setConfirmationInput(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => setConfirmationInput("")}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        className="bg-red-700 cursor-pointer"
                        disabled={confirmationInput !== requiredPhrase}
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </DropdownMenuGroup>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
