import React from "react";
import { FaFileAlt, FaEdit } from "react-icons/fa";
import { MdDelete, MdDriveFileRenameOutline } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaPenNib } from "react-icons/fa";
import Image from "next/image";

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

  return (
    <div
      className="w-52 h-72 border rounded-lg shadow-md flex flex-col justify-between p-2 bg-white hover:shadow-lg hover:border-[#C96442] transition cursor-pointer"
      onClick={onClick} // Attach onClick handler
    >
      {/* Placeholder for document preview */}
      <div className="flex items-center justify-center flex-grow bg-gray-100 rounded-md">
        {form_type === "LKT" ? (
          <Image
            src={LKT}
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
        <div className="flex justify-between">
          <FaFileAlt className=" mt-3" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="mt-2 rounded-full hover:bg-gray-200 p-1"
                onClick={(event) => event.stopPropagation()}
              >
                <FaEdit />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  console.log("DELETE");
                }}
              >
                <MdDelete />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  console.log("RENAME");
                }}
              >
                <MdDriveFileRenameOutline />
                Rename
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
