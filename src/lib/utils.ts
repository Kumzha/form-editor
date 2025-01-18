import { creaFormInterface, Form } from "@/types/formType";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BASE_URL } from "@/constants/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformToFormObject(backendObj: any): Form {
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

export const fetchForms = async (): Promise<Form[]> => {
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
