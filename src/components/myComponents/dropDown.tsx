"use client";

import React, { useEffect } from "react";
import { Form } from "@/types/formType";
import { useDispatch } from "react-redux";
import { setSelectedForm, setUserForms } from "@/store/forms/formSlice";
import { Button } from "../ui/button";
import { fetchForms } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const DropDown: React.FC = () => {
  const { data } = useQuery<Form[], Error>({
    queryKey: ["fetchForms"],
    queryFn: fetchForms,
  });

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
    console.log(form);
    dispatch(setSelectedForm(form));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"primary"}>Open my forms</Button>
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
