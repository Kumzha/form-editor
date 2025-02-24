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
import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/constants";
import { toast } from "sonner";
import { setSelectedForm } from "@/store/forms/formSlice";
import { FormInterface } from "@/types/formType";
import { useDispatch } from "react-redux";
import { useRefreshForms } from "@/hooks/useRefreshForms";
import { PlusCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

const NoProposalScreen: React.FC = () => {
  const dispatch = useDispatch();
  const refresh = useRefreshForms();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formName, setFormName] = useState<string>("");
  const [formType, setFormType] = useState<string>("");

  const [formDescription, setFormDescription] = useState<string[]>([]);

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

  const handleFormDescriptionChange = (index: number, value: string) => {
    setFormDescription((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

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
    onSuccess: async () => {
      const forms = await refresh();

      const newForm = forms.find((form) => form.name === formName);

      if (newForm) {
        dispatch(setSelectedForm(newForm));
      }

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

  const handleSubmit = () => {
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

    createForm();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center rounded-lg"
        >
          <div className="relative mb-6">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <FileText className="w-16 h-16 text-muted-foreground/60" />
            </motion.div>
            <motion.div
              className="absolute -right-2 -top-2"
              animate={{
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <PlusCircle className="w-6 h-6 text-primary" />
            </motion.div>
          </div>

          <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your first proposal to get started. It only takes a few
            minutes to draft your ideas.
          </p>

          <Button size="lg" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Create New Proposal
          </Button>
        </motion.div>
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

        <DialogFooter>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoProposalScreen;
