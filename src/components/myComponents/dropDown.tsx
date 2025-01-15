"use client";

import React, { useEffect } from "react";
import { Form, creaFormInterface } from "@/types/formType";
import { useDispatch } from "react-redux";
import { setSelectedForm, setUserForms } from "@/store/forms/formSlice";
import { BASE_URL } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformToFormObject(backendObj: any): Form {
  const form: Form = {
    form_id: backendObj._id,
    form_type: creaFormInterface,
    name: backendObj.name,
    initial_context: backendObj.initial_context,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    points: backendObj.data.map((pointData: any[]) => ({
      subpoints: pointData.map((item: string) => ({
        content: item,
      })),
    })),
  };

  return form;
}

const fetchForms = async (): Promise<Form[]> => {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    throw new Error("No authorization token found");
  }

  const response = await fetch(BASE_URL + "/form/get/me/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch forms");
  }

  const data = await response.json();

  const forms: Form[] = data.map((data: Form) => transformToFormObject(data));

  return forms;
};

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
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1  font-sans">
        Your Forms List
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {data?.map((form: Form, index: number) => (
          <li key={index} onClick={() => handleSetSelectedForm(form)}>
            <a>{form.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DropDown;
