"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Member } from "../page";

interface RemoveMemberDialogProps {
  member: Member;
  organizationId: string;
  onSuccess: () => void;
}

export function DeleteMemberDialog({
  member,
  organizationId,
  onSuccess,
}: RemoveMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      // Using the appropriate method and parameters based on Better Auth API
      await authClient.organization.removeMember({
        memberIdOrEmail: member.id,
        organizationId,
      });

      toast.success("Member removed successfully");
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-destructive">
          <UserPlus className="h-4 w-4" />
          <span>Delete account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this member from the entire project?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            You are about to delete{" "}
            <strong>{member.user.name || member.user.email}</strong> from the
            entire project.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
