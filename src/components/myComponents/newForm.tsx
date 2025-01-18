import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/constants";
import { toast } from "sonner";

const NewForm: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formName, setFormName] = useState<string>("");
  const [formType, setFormType] = useState<string>("");
  const [formDescription, setFormDescription] = React.useState<string[]>([
    "",
    "",
    "",
    "",
  ]);

  const handleFormDescriptionChange = (index: number, value: string) => {
    setFormDescription((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  const queryClient = useQueryClient();

  // TODO DEFINE TYPE
  const createNewForm = async (): Promise<unknown> => {
    const authToken = localStorage.getItem("authToken");

    const formData = {
      name: formName,
      form_template_name: formType,
      initial_context: formDescription,
    };

    const response = await fetch(BASE_URL + "/form-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail);
    }

    return response;
  };

  const { mutate: createForm } = useMutation({
    mutationFn: createNewForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
      setIsDialogOpen(false);
      toast("form has been created", {
        description: "A form by the name " + formName + " has been created",
      });
    },
    onError: (error) => {
      toast.error("Could not create a form", {
        description: error.message,
      });
    },
  });

  const handleSubmit = () => {
    createForm();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Create New Form</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Select from our provided form templates:
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Form Name
            </Label>
            <Input
              id="name"
              value={formName}
              className="col-span-5"
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Form Type
            </Label>
            <Select
              onValueChange={(value) => {
                setFormType(value);
              }}
            >
              <SelectTrigger className="col-span-5">
                <SelectValue placeholder="Select a form template" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Form Templates</SelectLabel>
                  <SelectItem value="CREA-MEDIA-2025-INNOVBUSMOD">
                    CREA-MEDIA-2025-INNOVBUSMOD
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Input nr.1
            </Label>
            <Textarea
              id="input-1"
              variant="newForm"
              value={formDescription[0]}
              onChange={(e) => handleFormDescriptionChange(0, e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Input nr.2
            </Label>
            <Textarea
              id="input-2"
              variant="newForm"
              value={formDescription[1]}
              onChange={(e) => handleFormDescriptionChange(1, e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Input nr.3
            </Label>
            <Textarea
              id="input-3"
              variant="newForm"
              value={formDescription[2]}
              onChange={(e) => handleFormDescriptionChange(2, e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Input nr.4
            </Label>
            <Textarea
              id="input-4"
              variant="newForm"
              value={formDescription[3]}
              onChange={(e) => handleFormDescriptionChange(3, e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default NewForm;
