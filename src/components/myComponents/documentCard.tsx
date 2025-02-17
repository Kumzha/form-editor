"use client";

import type React from "react";

import { MdDelete, MdDriveFileRenameOutline } from "react-icons/md";

import { RenameFormModal } from "./modals/renameFormModal";
import { DeleteFormModal } from "./modals/deleteFormModal";
import { FaPenNib } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import { useRefreshForms } from "@/hooks/useRefreshForms";

interface DocumentCardProps {
  form_name: string;
  form_type: string;
  onClick?: () => void;
  onDelete?: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  form_name,
  form_type,
  onClick,
}) => {
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
        className="w-52 h-72 border rounded-lg shadow-md flex flex-col justify-between p-2 bg-white hover:shadow-lg hover:border-[#C96442] transition cursor-pointer"
        onClick={onClick}
      >
        {/* Placeholder for document preview */}
        <div className="flex items-center justify-center flex-grow bg-gray-100 rounded-md">
          {form_type === "LKT" ? (
            <Image
              src={LKT || "/placeholder.svg"}
              alt="LKT Icon"
              width={50}
              height={50}
              color="#996553"
            />
          ) : (
            <FaPenNib size={40} color="#996553" />
          )}
        </div>

        {/* Document details */}
        <div className="mt-2">
          <div className="text-sm font-semibold truncate">{form_name}</div>
          <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
            {form_type}
          </div>
          <div className="flex mt-3 justify-between">
            <div
              className="rounded-lg hover:bg-gray-200 p-1"
              onClick={(e) => handleRename(e)}
            >
              <MdDriveFileRenameOutline size={20} />
            </div>
            <div
              className="rounded-lg hover:bg-gray-200 p-1"
              onClick={(e) => handleDelete(e)}
            >
              <MdDelete size={20} />
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
        ></DeleteFormModal>
      </div>
    </>
  );
};

export default DocumentCard;
