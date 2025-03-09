"use client";

import type React from "react";
import { useState } from "react";
import { VscFeedback } from "react-icons/vsc";
import SidebarItem from "./sidebarItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { BASE_URL } from "@/constants/constants";

// Define the ticket priority enum to match backend
enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Define the ticket data interface
interface TicketData {
  subject: string;
  description: string;
  priority: TicketPriority;
  category?: string;
}

const FeedbackButton: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TicketData>({
    subject: "",
    description: "",
    priority: TicketPriority.MEDIUM,
    category: "Feature Request",
  });

  // Form validation state
  const [errors, setErrors] = useState({
    subject: "",
    description: "",
  });

  // Create ticket mutation
  const { mutate: createTicket, isPending } = useMutation({
    mutationFn: async (data: TicketData) => {
      const response = await fetch(`${BASE_URL}/support/create-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create ticket");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback! We'll review it shortly.");
      setOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("Error submitting feedback");
    },
  });

  const resetForm = () => {
    setFormData({
      subject: "",
      description: "",
      priority: TicketPriority.MEDIUM,
      category: "Feature Request",
    });
    setErrors({
      subject: "",
      description: "",
    });
  };

  const validateForm = (): boolean => {
    const newErrors = {
      subject: "",
      description: "",
    };

    if (!formData.subject || formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    } else if (formData.subject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return !newErrors.subject && !newErrors.description;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      createTicket(formData);
    }
  };

  const handleInputChange = (field: keyof TicketData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user types
    if (field === "subject" || field === "description") {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarItem
          text="Send Feedback"
          logo={<VscFeedback size={20} />}
          isOpen={isOpen}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Share your thoughts, report issues, or suggest improvements.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bug Report">Bug Report</SelectItem>
                  <SelectItem value="Feature Request">
                    Feature Request
                  </SelectItem>
                  <SelectItem value="General Feedback">
                    General Feedback
                  </SelectItem>
                  <SelectItem value="Technical Support">
                    Technical Support
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={errors.subject ? "border-red-500" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={errors.description ? "border-red-500" : "border"}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackButton;
