import React from "react";

interface SidebarItemProps {
  text: string;
  logo: React.ReactElement;
  isOpen: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  text,
  logo,
  onClick,
  isOpen,
}) => {
  if (!isOpen) {
    return (
      <div
        className="flex items-center justify-center mx-auto gap-4 w-[70%] bg-[#CACACA] hover:bg-[#000000] hover:text-white transition-all p-2 rounded-md duration-300 cursor-pointer"
        onClick={onClick}
      >
        {logo}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center mx-auto gap-4 w-[90%] bg-[#CACACA] hover:bg-[#000000] hover:text-white transition-all p-2 rounded-md duration-300 cursor-pointer"
      onClick={onClick}
    >
      {logo}
      <div className="w-full overflow-hidden whitespace-nowrap">{text}</div>
    </div>
  );
};

export default SidebarItem;
