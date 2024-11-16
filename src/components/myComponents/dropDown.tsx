"use client";

import React, { useEffect } from "react";
import { Form, creaFormInterface } from "@/types/formType";
import { useDispatch } from "react-redux";
import { setSelectedForm, setUserForms } from "@/store/forms/formSlice";
import { BASE_URL } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";

interface DropDownProps {
  forms: Form[];
}

function transformToFormObject(backendObj: any): Form {
  const form: Form = {
    form_id: backendObj._id, // Map _id to form_id
    form_type: creaFormInterface, // Map form_template_name to form_type
    name: backendObj.name,
    initial_context: backendObj.initial_context,
    points: backendObj.data.map((pointData: any[]) => ({
      subpoints: pointData.map((item: string) => ({
        content: item, // Every element in the pointData is a subpoint
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
      Authorization: `Bearer ${authToken}`, // Add Authorization header
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch forms");
  }

  const data = await response.json();

  const forms: Form[] = data.map((data: any) => transformToFormObject(data));

  return forms;
};

const DropDown: React.FC<DropDownProps> = ({ forms }) => {
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
    alert("Selected form: " + form.name);
    console.log(form);
    dispatch(setSelectedForm(form));
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <details className="dropdown">
      <summary className="btn w-40 m-1 font-sans">Form List</summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        {forms.map((form: Form, index: number) => (
          <li key={index} onClick={() => handleSetSelectedForm(form)}>
            <a>{form.name}</a>
          </li>
        ))}
      </ul>
    </details>
  );
};
export default DropDown;
