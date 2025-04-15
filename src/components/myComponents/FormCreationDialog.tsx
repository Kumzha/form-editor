import React, { useState, useEffect, useCallback } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/constants";
import { toast } from "sonner";
import { setSelectedForm } from "@/store/forms/formSlice";
import { FormInterface } from "@/types/formType";
import { useDispatch } from "react-redux";
import { useRefreshForms } from "@/hooks/useRefreshForms";
import FormTemplateSelect from "./FormTemplateSelect";
import { useDropzone } from "react-dropzone";
import { MdClose } from "react-icons/md";
import bytes from "bytes";

const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface FormCreationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const FormCreationDialog: React.FC<FormCreationDialogProps> = ({
  isOpen,
  onOpenChange,
  trigger,
}) => {
  const dispatch = useDispatch();
  const refresh = useRefreshForms();
  const [formName, setFormName] = useState<string>("");
  const [formType, setFormType] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"questions" | "abstract">(
    "questions"
  );
  const [generatedAbstract, setGeneratedAbstract] = useState<string>("");
  const [editedAbstract, setEditedAbstract] = useState<string>("");
  const [isGeneratingAbstract, setIsGeneratingAbstract] =
    useState<boolean>(false);
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>("context");
  const [createdFormId, setCreatedFormId] = useState<string>("");

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
    setFiles([]);
    setDocumentType("context");
  };

  // Reset workflow when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Adjust textarea height when abstract is displayed
  useEffect(() => {
    if (currentStep === "abstract") {
      const textarea = document.getElementById(
        "abstract"
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "auto";
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

  const { mutate: generateAbstractMutation } = useMutation<
    { result: string },
    Error
  >({
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

    const combinedInitialContext = [...formDescription, editedAbstract];

    const formData = {
      name: formName,
      form_template_name: formType,
      initial_context: combinedInitialContext,
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

      onOpenChange(false);
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
    if (!formName.trim()) return false;
    if (!formType) return false;

    const matchingTemplate = templates?.find(
      (template) => template.name === formType
    );
    if (!matchingTemplate) return false;

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

    generateAbstractMutation();
  };

  const handleBackToQuestions = () => {
    setCurrentStep("questions");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...acceptedFiles];
      const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > MAX_TOTAL_SIZE) {
        toast.error(
          "Total file size exceeds 10MB limit. Some files were not added."
        );
        return prevFiles;
      }
      return newFiles;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: MAX_TOTAL_SIZE,
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const formResponse = await createNewForm();
      const responseData = await formResponse.json();
      setCreatedFormId(responseData.form_id);

      const forms = await refresh();
      const newForm = forms.find((form) => form.name === formName);

      if (newForm) {
        dispatch(setSelectedForm(newForm));
      }

      setShowUploadDialog(true);
      toast("Form has been created", {
        description: `A form by the name ${formName} has been created`,
      });
    } catch (error) {
      toast.error("Could not create a form", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      setShowUploadDialog(false);
      onOpenChange(false);
      return;
    }

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("form_name", formName);
        formData.append("form_id", createdFormId);
        formData.append("document_type", documentType);

        const authToken = localStorage.getItem("authToken");
        const uploadResponse = await fetch(`${BASE_URL}/upload-document`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload file: ${file.name}`);
        }
      }

      toast.success("Files uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload files", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setShowUploadDialog(false);
      onOpenChange(false);
    }
  };

  const handleSkipUpload = () => {
    setShowUploadDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              {currentStep === "questions" &&
                "Select from our provided form templates:"}
              {currentStep === "abstract" &&
                "Review and edit the generated abstract:"}
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
              <FormTemplateSelect
                value={formType}
                onChange={setFormType}
                templates={templates}
              />

              {/* Inputs for form description */}
              {formType && templates && (
                <div>
                  {(() => {
                    const matchingTemplate = templates.find(
                      (template) => template.name === formType
                    );
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
                                  handleFormDescriptionChange(
                                    index,
                                    e.target.value
                                  )
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
                style={{ height: "auto" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
              <p className="text-sm text-muted-foreground">
                Make it detailed and specific to the form, this will be used as
                context for the form generation!
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
                title={
                  !formType
                    ? "Please select a template and fill all required fields"
                    : ""
                }
              >
                {isGeneratingAbstract ? "Generating..." : "Generate Abstract"}
              </Button>
            )}

            {currentStep === "abstract" && (
              <div className="flex gap-2 w-full justify-end">
                <Button variant="outline" onClick={handleBackToQuestions}>
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Example Documents</DialogTitle>
            <DialogDescription>
              Would you like to upload example documents to help with form
              generation?
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Document Type:</h3>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="context"
                    name="documentType"
                    value="context"
                    checked={documentType === "context"}
                    onChange={(e) => setDocumentType(e.target.value)}
                  />
                  <Label htmlFor="context">Context</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="criteria"
                    name="documentType"
                    value="criteria"
                    checked={documentType === "criteria"}
                    onChange={(e) => setDocumentType(e.target.value)}
                  />
                  <Label htmlFor="criteria">Criteria</Label>
                </div>
              </div>
            </div>

            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-gray-400"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the files here ...</p>
              ) : (
                <p>Drag and drop some files here, or click to select files</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Only .pdf and .docx files are allowed
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Selected files:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {file.name} ({bytes(file.size)})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdClose size={18} />
                      </Button>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mt-2">
                  Total size:{" "}
                  {bytes(files.reduce((sum, file) => sum + file.size, 0))} /
                  10MB
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkipUpload}>
              Skip
            </Button>
            <Button variant="primary" onClick={handleUploadFiles}>
              Upload Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormCreationDialog;
