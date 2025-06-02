"use client";
import React, { useState } from 'react';
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
import { Settings } from "lucide-react";
import { deleteCategoryById } from "@/actions/categories";
import { toast } from "sonner";
import ConfirmOperationAlertDialog from "@/components/ConfirmOperationAlertDialog";
import { deleteUserAction } from "@/actions/users";
import { useRouter } from "next/navigation";

interface UserNavProps {
  onLogoutClick: () => void;
  userName?: string;
  userEmail?: string;
  avatarSrc?: string;
}

export function UserNav({ onLogoutClick, userName = "", userEmail = "" }: UserNavProps) {

  // Control Delete operation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const onDeleteMenuItemClick = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Settings/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            {/* Add more items like Settings, etc. */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator/>
          <DropdownMenuItem onClick={onLogoutClick}>
            Logout
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteMenuItemClick} variant='destructive'>
            Delete account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmOperationAlertDialog
        open={deleteDialogOpen}
        onOpen={setDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onOk={async () => {
          const res = await deleteUserAction()
          if (res.errorMessage) {
            toast.error(res.errorMessage);
          } else {
            toast.success('Account deleted!');
            setDeleteDialogOpen(false)
            router.push("/sign-up");
          }
        }}
        okText='Yes, delete it'
        confirmTitle='Confirm User Deletion'
        description={<span className='text-destructive'>This action cannot be undone and will permanently delete the user and all associated data. Are you sure you want to proceed?</span>}
      />
    </>
  );
}
