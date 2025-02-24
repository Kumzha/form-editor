"use client";

import type React from "react";
import { useState } from "react";
import { MdDelete, MdDriveFileRenameOutline } from "react-icons/md";
import { RenameFormModal } from "./modals/renameFormModal";
import { DeleteFormModal } from "./modals/deleteFormModal";
import { FaPenNib } from "react-icons/fa";
import Image from "next/image";
import { useRefreshForms } from "@/hooks/useRefreshForms";

interface DocumentCardProps {
  form_name: string;
  form_type: string;
  onClick?: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  form_name,
  form_type,
  onClick,
}) => {
  const LKT = "/formIcons/LKT.svg";

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleRefresh = useRefreshForms();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenameModalOpen(true);
  };

  return (
    <>
      <div
        className="w-full max-w-[13rem] h-auto aspect-[3/4] border rounded-lg shadow-md flex flex-col justify-between p-3 bg-white hover:shadow-lg hover:border-[#C96442] transition cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-center flex-grow bg-gray-100 rounded-md p-4">
          <div className="w-20 h-20 flex items-center justify-center">
            {form_type === "LKT" ? (
              <Image
                src={LKT || "/placeholder.svg"}
                alt="LKT Icon"
                width={80}
                height={80}
                className="w-2/3 h-full object-contain"
              />
            ) : (
              <FaPenNib className="w-2/3 h-full text-[#524CE7]" />
            )}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="text-sm font-semibold truncate">{form_name}</div>
          <div className="text-[10px] text-gray-500 flex items-center gap-1 h-6">
            {form_type}
          </div>
          <div className="flex justify-between mt-2">
            <button
              className="rounded-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={(e) => handleRename(e)}
            >
              <MdDriveFileRenameOutline className="w-5 h-5" />
            </button>
            <button
              className="rounded-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={(e) => handleDelete(e)}
            >
              <MdDelete className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <RenameFormModal
        formName={form_name}
        open={isRenameModalOpen}
        onOpenChange={setIsRenameModalOpen}
        onFormRenamed={() => handleRefresh()}
      />
      <DeleteFormModal
        formName={form_name}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onFormDeleted={() => handleRefresh()}
      />
    </>
  );
};

export default DocumentCard;
