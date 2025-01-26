/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Form,
  FormInterface,
  FormPoint,
  FormQuestion,
  Point,
} from "@/types/formType";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BASE_URL } from "@/constants/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function transformToFormObject(backendObject: any): Form {
  // Transform subpoints into FormQuestion
  const transformSubpoints = (subpoints: any[]): FormQuestion[] => {
    return subpoints.map((subpoint) => ({
      sub_title: subpoint.sub_title || "",
      prompt: subpoint.prompt || undefined,
    }));
  };

  // Transform questions into FormPoint
  const transformQuestions = (questions: any[]): FormPoint[] => {
    return questions.map((question) => ({
      title: question.title || "",
      subpoints: transformSubpoints(question.subpoints || []),
    }));
  };

  // Transform points into Point with SubPoint
  const transformPoints = (data: any[][]): Point[] => {
    return data.map((pointData) => ({
      subpoints: pointData.map((content: string) => ({
        content: content || "",
      })),
    }));
  };

  // Build the FormInterface structure
  const formType: FormInterface = {
    name: backendObject.form_type.name || "",
    initial_context_questions:
      backendObject.form_type.initial_context_questions || [],
    questions: transformQuestions(backendObject.form_type.questions || []),
  };

  // Build and return the final Form object
  return {
    form_id: backendObject._id || "",
    form_type: formType,
    name: backendObject.name || "",
    initial_context: backendObject.initial_context || [],
    points: transformPoints(backendObject.data || []),
  };
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

  // console.log(data[11].form_type.questions[0].subpoints[0].prompt);

  const forms: Form[] = data.map((data: Form) => transformToFormObject(data));

  // console.log(forms[11].form_type.questions[0].subpoints[0].prompt);

  return forms;
};
