import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constants/constants";
import { toast } from "sonner";

interface RenameFormModalProps {
  formName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormRenamed: (newName: string) => void;
}

export function RenameFormModal({
  formName,
  open,
  onOpenChange,
  onFormRenamed,
}: RenameFormModalProps) {
  const [newName, setNewName] = useState(formName);

  const handleRenameSubmit = async () => {
    try {
      console.log("Renaming form:", formName, "to", newName);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/form-rename`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          form_name: formName,
          new_name: newName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename form");
      }

      const data = await response.json();
      console.log("Form renamed successfully:", data);
      onFormRenamed(newName);
      toast.success("Form renamed successfully");
      onOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Error renaming form");
      console.error("Error renaming form:", error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Rename Form</DialogTitle>
          <DialogDescription>
            Enter the new name for your form below.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New form name"
          className="mb-4"
        />
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
            onClick={(e) => {
              e.stopPropagation();
              handleRenameSubmit();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
