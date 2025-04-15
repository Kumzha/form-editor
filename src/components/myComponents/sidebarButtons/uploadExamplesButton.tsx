"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdOutlineDriveFolderUpload, MdClose } from "react-icons/md";
import bytes from "bytes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import SidebarItem from "./sidebarItem";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/constants";
import { extractObjectId } from "@/lib/utils";

const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const UploadExamples: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>("context");
  const queryClient = useQueryClient();

  const { selectedForm } = useSelector((state: RootState) => state.userForms);

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

  // Single file upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!selectedForm) {
        throw new Error("No form selected. Please select a form first.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("form_name", selectedForm.name);
      formData.append("form_id", extractObjectId(selectedForm.form_id));
      formData.append("document_type", documentType);

      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/upload-document`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload file");
      }

      return await response.json();
    },
    onSuccess: (data, variables) => {
      // You can add specific success handling for each file here if needed
    },
    onError: (error, variables) => {
      toast.error(
        `Failed to upload ${variables.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });

  // Add this mutation after the uploadFileMutation
  const deleteFileMutation = useMutation({
    mutationFn: async ({
      formName,
      formId,
      fileName,
    }: {
      formName: string;
      formId: string;
      fileName: string;
    }) => {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/delete-document`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          form_name: formName,
          form_id: formId,
          file_name: fileName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete file");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents", selectedForm?.form_id],
      });
      toast.success("File deleted successfully");
    },
    onError: (error) => {
      toast.error(
        `Failed to delete file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });

  const handleDeleteFile = (fileName: string) => {
    if (!selectedForm) {
      toast.error("No form selected");
      return;
    }

    deleteFileMutation.mutate({
      formName: selectedForm.name,
      formId: extractObjectId(selectedForm.form_id),
      fileName: fileName,
    });
  };

  // Batch upload mutation
  const batchUploadMutation = useMutation({
    mutationFn: async () => {
      if (files.length === 0) {
        throw new Error("Please select at least one file.");
      }

      if (!selectedForm) {
        throw new Error("No form selected. Please select a form first.");
      }

      const results = [];
      const successfulFiles = [];

      for (const file of files) {
        try {
          const result = await uploadFileMutation.mutateAsync(file);
          results.push(result);
          successfulFiles.push(file);
        } catch (error) {
          // Individual file errors are handled in the single file mutation
        }
      }

      return { results, successfulFiles };
    },
    onSuccess: (data) => {
      const { successfulFiles } = data;
      if (successfulFiles.length === files.length) {
        toast.success(
          `All ${files.length} files uploaded successfully as ${documentType} documents.`
        );
        setFiles([]);
      } else if (successfulFiles.length > 0) {
        toast.success(
          `${successfulFiles.length} of ${files.length} files uploaded successfully.`
        );
        // Keep only the failed files
        const successFileNames = new Set(
          successfulFiles.map((file) => file.name)
        );
        setFiles((prevFiles) =>
          prevFiles.filter((file) => !successFileNames.has(file.name))
        );
      }

      // Invalidate relevant queries to refresh any data that depends on the uploads

      queryClient.invalidateQueries({
        queryKey: ["documents", selectedForm?.form_id],
      });
    },
    onError: (error) => {
      toast.error(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });

  const handleSubmit = () => {
    batchUploadMutation.mutate();
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const isUploading =
    batchUploadMutation.isPending || uploadFileMutation.isPending;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarItem
          text="Upload Documentation"
          logo={<MdOutlineDriveFolderUpload size={20} />}
          isOpen={isOpen}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Documentation</DialogTitle>
          <DialogDescription>
            Upload selected .pdf or .docx files to increase the accuracy and the
            style of content generation.
          </DialogDescription>
        </DialogHeader>

        {/* Document Type Selection */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Document Type:</h3>
          <RadioGroup
            value={documentType}
            onValueChange={setDocumentType}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="context" id="context" />
              <Label htmlFor="context">Context</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="criteria" id="criteria" />
              <Label htmlFor="criteria">Criteria</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Selected Form Display */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Selected Form:</h3>
          {selectedForm ? (
            <p className="text-sm">{selectedForm.name}</p>
          ) : (
            <p className="text-sm text-red-500">
              No form selected. Please select a form first.
            </p>
          )}
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
              Total size: {bytes(totalSize)} / 10MB
            </p>
          </div>
        )}
        {selectedForm?.uploaded_files &&
          selectedForm.uploaded_files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Already uploaded files:</h3>
              <ul className="space-y-2">
                {selectedForm.uploaded_files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {file.name} ({file.type})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.name)}
                      disabled={deleteFileMutation.isPending}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdClose size={18} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        <DialogFooter>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isUploading || files.length === 0 || !selectedForm}
          >
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadExamples;
