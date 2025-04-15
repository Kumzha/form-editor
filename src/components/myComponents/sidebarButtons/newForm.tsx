import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import SidebarItem from "@/components/myComponents/sidebarButtons/sidebarItem";
import FormCreationDialog from "../FormCreationDialog";

const NewForm: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <FormCreationDialog
      isOpen={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={
        <SidebarItem
          text="Create"
          logo={<FiPlus size={20} />}
          isOpen={isOpen}
        />
      }
    />
  );
};

export default NewForm;
