import React, { useState, useEffect } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/constants";
import { toast } from "sonner";
import { FormInterface } from "@/types/formType";

const NewForm: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formName, setFormName] = useState<string>("");
  const [formType, setFormType] = useState<string>("");
  // Initialize with an empty array; it will be reset when formType is selected.
  const [formDescription, setFormDescription] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Fetch the list of form templates.
  const { data: templates } = useQuery<FormInterface[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/templates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching templates");
      }
      return response.json();
    },
  });

  // Log the fetched templates (for debugging).
  useEffect(() => {
    if (templates) {
      console.log("Fetched templates:", templates);
    }
  }, [templates]);

  // When the selected formType changes, reset the formDescription array to match
  // the number of questions of the selected template.
  useEffect(() => {
    if (formType && templates) {
      const matchingTemplate = templates.find(
        (template) => template.name === formType
      );
      if (matchingTemplate) {
        // Reset the description answers to an empty string for each question.
        setFormDescription(
          new Array(matchingTemplate.initial_context_questions.length).fill("")
        );
      }
    }
  }, [formType, templates]);

  // Handler to update the answer for a specific question.
  const handleFormDescriptionChange = (index: number, value: string) => {
    setFormDescription((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Mutation to create a new form.
  const createNewForm = async (): Promise<Response> => {
    const authToken = localStorage.getItem("authToken");

    const formData = {
      name: formName,
      form_template_name: formType,
      initial_context: formDescription,
    };

    const response = await fetch(`${BASE_URL}/form-submit`, {
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

  const { mutate: createForm } = useMutation<Response, Error>({
    mutationFn: createNewForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
      setIsDialogOpen(false);
      toast("Form has been created", {
        description: `A form by the name ${formName} has been created`,
      });
    },
    onError: (error: Error) => {
      toast.error("Could not create a form", {
        description: error.message,
      });
    },
  });

  // Validate that every required field is filled before submitting.
  const handleSubmit = () => {
    // Validate form name and form type.
    if (!formName.trim()) {
      toast.error("Form name is required");
      return;
    }
    if (!formType) {
      toast.error("Form type is required");
      return;
    }

    // Validate that a matching template exists.
    const matchingTemplate = templates?.find(
      (template) => template.name === formType
    );
    if (!matchingTemplate) {
      toast.error("Selected form template is not available");
      return;
    }

    // Ensure every description input is non-empty.
    const allFieldsFilled = formDescription.every(
      (answer) => answer.trim() !== ""
    );
    if (!allFieldsFilled) {
      toast.error("All input fields are required");
      return;
    }

    // If validation passes, submit the form.
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
          {/* Form Name */}
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

          {/* Form Type */}
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="formType" className="text-right">
              Form Type
            </Label>
            <Select onValueChange={setFormType}>
              <SelectTrigger className="col-span-5">
                <SelectValue placeholder="Select a form template" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Form Templates</SelectLabel>
                  {templates &&
                    templates.map((template, index) => (
                      <SelectItem key={index} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Inputs for form description */}
          {formType && templates && (
            <div>
              {(() => {
                // Find the template with a name that matches formType.
                const matchingTemplate = templates.find(
                  (template) => template.name === formType
                );
                // If a matching template exists, render its questions.
                return matchingTemplate
                  ? matchingTemplate.initial_context_questions.map(
                      (question, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-6 items-center gap-4"
                        >
                          <Label
                            htmlFor={`input-${index + 1}`}
                            className="text-right"
                          >
                            {question}
                          </Label>
                          <Textarea
                            id={`input-${index + 1}`}
                            variant="newForm"
                            value={formDescription[index] || ""}
                            onChange={(e) =>
                              handleFormDescriptionChange(index, e.target.value)
                            }
                          />
                        </div>
                      )
                    )
                  : null;
              })()}
            </div>
          )}
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
