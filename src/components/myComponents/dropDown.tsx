"use client";

import React, { useEffect } from "react";
import { Form } from "@/types/formType";
import { useDispatch } from "react-redux";
import { setSelectedForm, setUserForms } from "@/store/forms/formSlice";
import { fetchForms } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiFileList3Line } from "react-icons/ri";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const DropDown: React.FC = () => {
  const { data } = useQuery<Form[], Error>({
    queryKey: ["fetchForms"],
    queryFn: fetchForms,
  });

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  useEffect(() => {
    const handleSetUserForms = (forms: Form[]) => {
      dispatch(setUserForms(forms));
    };

    if (data) {
      handleSetUserForms(data);
    }
  }, [data, dispatch]);

  const handleSetSelectedForm = (form: Form) => {
    queryClient.invalidateQueries({ queryKey: ["fetchForms"] });
    dispatch(setSelectedForm(form));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center mx-auto gap-4 w-[90%] bg-gray-100 hover:bg-gray-200 transition-all p-2 rounded-md  duration-300 cursor-pointer">
          <RiFileList3Line size={20} /> <span className="w-full">My Forms</span>
        </div>

        {/* <Button variant={"primary"}>Open my forms</Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Forms</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {data?.map((form: Form, index: number) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleSetSelectedForm(form)}
            >
              {form.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DropDown;
