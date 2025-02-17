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
import SidebarItem from "./sidebarItem";
import { toast } from "sonner";

const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const UploadExamples: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...acceptedFiles];
      const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > MAX_TOTAL_SIZE) {
        alert("Total file size exceeds 10MB limit. Some files were not added.");
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

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    console.log("Submitting files:", files);
    // Add your file upload logic here
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarItem
          text="Upload Examples"
          logo={<MdOutlineDriveFolderUpload size={20} />}
          isOpen={isOpen}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Examples</DialogTitle>
          <DialogDescription>
            <div>
              Upload selected .pdf or .docx files to increase the accuracy and
              the style of content generation.
            </div>
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <Button variant="primary" onClick={handleSubmit}>
            Upload Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadExamples;
