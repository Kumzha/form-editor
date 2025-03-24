import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../../ui/textarea";
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
import { useMutation, useQuery, UseMutationResult } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/constants";
import { toast } from "sonner";
import { setSelectedForm } from "@/store/forms/formSlice";
import { FormInterface } from "@/types/formType";
import { useDispatch } from "react-redux";
import { FiPlus } from "react-icons/fi";
import SidebarItem from "@/components/myComponents/sidebarButtons/sidebarItem";
import { useRefreshForms } from "@/hooks/useRefreshForms";

const NewForm: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const dispatch = useDispatch();
  const refresh = useRefreshForms();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formName, setFormName] = useState<string>("");
  const [formType, setFormType] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"questions" | "abstract" | "review">("questions");
  const [generatedAbstract, setGeneratedAbstract] = useState<string>("");
  const [editedAbstract, setEditedAbstract] = useState<string>("");
  const [isGeneratingAbstract, setIsGeneratingAbstract] = useState<boolean>(false);

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

  useEffect(() => {
    if (formType && templates) {
      const matchingTemplate = templates.find(
        (template) => template.name === formType
      );
      if (matchingTemplate) {
        setFormDescription(
          new Array(matchingTemplate.initial_context_questions.length).fill("")
        );
      }
    }
  }, [formType, templates]);

  // Reset form state
  const resetForm = () => {
    setFormName("");
    setFormType("");
    setFormDescription([]);
    setGeneratedAbstract("");
    setEditedAbstract("");
    setCurrentStep("questions");
  };

  // Reset workflow when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      resetForm();
    }
  }, [isDialogOpen]);

  // Adjust textarea height when abstract is displayed
  useEffect(() => {
    if (currentStep === "abstract") {
      const textarea = document.getElementById("abstract") as HTMLTextAreaElement;
      if (textarea) {
        // Set height to auto first to get the correct scrollHeight
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, [currentStep, editedAbstract]);

  const handleFormDescriptionChange = (index: number, value: string) => {
    setFormDescription((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const generateAbstract = async (): Promise<{ result: string }> => {
    setIsGeneratingAbstract(true);
    try {
      const authToken = localStorage.getItem("authToken");
      
      const response = await fetch(`${BASE_URL}/generate-abstract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formDescription),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail);
      }

      const data = await response.json();
      return data;
    } finally {
      setIsGeneratingAbstract(false);
    }
  };

  const { mutate: generateAbstractMutation } = useMutation<{ result: string }, Error>({
    mutationFn: generateAbstract,
    onSuccess: (data) => {
      setGeneratedAbstract(data.result);
      setEditedAbstract(data.result);
      setCurrentStep("abstract");
    },
    onError: (error: Error) => {
      toast.error("Could not generate abstract", {
        description: error.message,
      });
    },
  });

  const createNewForm = async (): Promise<Response> => {
    const authToken = localStorage.getItem("authToken");

    // Combine initial context answers with the abstract
    const combinedInitialContext = [...formDescription, editedAbstract];

    const formData = {
      name: formName,
      form_template_name: formType,
      initial_context: combinedInitialContext
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

  const { mutate: createForm, isPending } = useMutation<Response, Error>({
    mutationFn: createNewForm,
    onSuccess: async () => {
      const forms = await refresh();

      const newForm = forms.find((form) => form.name === formName);

      if (newForm) {
        dispatch(setSelectedForm(newForm));
      }

      setIsDialogOpen(false);
      resetForm();
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

  const areRequiredFieldsFilled = (): boolean => {
    // Check if name is filled
    if (!formName.trim()) return false;
    
    // Check if a template is selected
    if (!formType) return false;
    
    // Check if a matching template exists
    const matchingTemplate = templates?.find(
      (template) => template.name === formType
    );
    if (!matchingTemplate) return false;
    
    // Check if all questions are answered
    const allFieldsFilled = formDescription.every(
      (answer) => answer.trim() !== ""
    );
    return allFieldsFilled;
  };

  const handleContinueToAbstract = () => {
    if (!formName.trim()) {
      toast.error("Form name is required");
      return;
    }
    if (!formType) {
      toast.error("Form type is required");
      return;
    }

    const matchingTemplate = templates?.find(
      (template) => template.name === formType
    );
    if (!matchingTemplate) {
      toast.error("Selected form template is not available");
      return;
    }

    const allFieldsFilled = formDescription.every(
      (answer) => answer.trim() !== ""
    );
    if (!allFieldsFilled) {
      toast.error("All input fields are required");
      return;
    }

    // Generate abstract
    generateAbstractMutation();
  };

  const handleBackToQuestions = () => {
    setCurrentStep("questions");
  };

  const handleSubmit = () => {
    createForm();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <SidebarItem
          text="Create"
          logo={<FiPlus size={20} />}
          isOpen={isOpen}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            {currentStep === "questions" && "Select from our provided form templates:"}
            {currentStep === "abstract" && "Review and edit the generated abstract:"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === "questions" && (
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
                            className="grid grid-cols-6 items-center gap-4 mt-5"
                          >
                            <Label
                              htmlFor={`input-${index + 1}`}
                              className="text-left"
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
        )}

        {currentStep === "abstract" && (
          <div className="grid gap-4 py-4">
            <Label htmlFor="abstract" className="text-left font-medium">
              Abstract
            </Label>
            <Textarea
              id="abstract"
              className="min-h-[200px] border border-gray-300 p-3 rounded-md resize-none overflow-hidden"
              value={editedAbstract}
              onChange={(e) => setEditedAbstract(e.target.value)}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <p className="text-sm text-muted-foreground">
              Make it detailed and specific to the form, this will be used as context for the form generation!
            </p>
          </div>
        )}

        <DialogFooter>
          {currentStep === "questions" && (
            <Button 
              variant="primary" 
              onClick={handleContinueToAbstract} 
              disabled={!areRequiredFieldsFilled()} 
              isLoading={isGeneratingAbstract}
              title={!formType ? "Please select a template and fill all required fields" : ""}
            >
              {isGeneratingAbstract ? "Generating..." : "Generate Abstract"}
            </Button>
          )}
          
          {currentStep === "abstract" && (
            <div className="flex gap-2 w-full justify-end">
              <Button 
                variant="outline" 
                onClick={handleBackToQuestions}
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit} 
                isLoading={isPending}
              >
                {isPending ? "Creating..." : "Create Form"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewForm;
