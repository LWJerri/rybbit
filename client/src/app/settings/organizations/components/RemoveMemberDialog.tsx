"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";
import { Member } from "../page";

interface RemoveMemberDialogProps {
  member: Member;
  organizationId: string;
  isOpenDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  onSuccess: () => void;
}

export function RemoveMemberDialog({
  member,
  organizationId,
  isOpenDialog,
  setOpenDialog,
  onSuccess,
}: RemoveMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      // Using the appropriate method and parameters based on Better Auth API
      await authClient.organization.removeMember({
        memberIdOrEmail: member.id,
        organizationId,
      });

      toast.success("Member removed successfully");
      setOpenDialog(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this member from the organization?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            You are about to remove{" "}
            <strong>{member.user.name || member.user.email}</strong> from this
            organization.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
