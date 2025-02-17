import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/constants/constants";
import { toast } from "sonner";

interface DeleteFormModalProps {
  formName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormDeleted: () => void;
}

export function DeleteFormModal({
  formName,
  open,
  onOpenChange,
  onFormDeleted,
}: DeleteFormModalProps) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/form-delete`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          form_name: formName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }
      const data = await response.json();
      console.log("Form deleted successfully:", data);
      onFormDeleted();
      toast.success("Form deleted successfully");
      onOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Error deleting form");
      console.error("Error deleting form:", error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Delete Form</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the form {formName}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
