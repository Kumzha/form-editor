import React from "react";

import { IoRefreshCircleOutline } from "react-icons/io5";
import SidebarItem from "./sidebarItem";
import { useRefreshForms } from "@/hooks/useRefreshForms";

const RefreshForms: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const RefreshForms = useRefreshForms();

  return (
    <SidebarItem
      text="Refresh Forms"
      logo={<IoRefreshCircleOutline size={20} />}
      onClick={() => RefreshForms()}
      isOpen={isOpen}
    />
  );
};
export default RefreshForms;
