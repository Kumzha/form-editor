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
    uploaded_files: backendObject.uploaded_files || [],
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



interface MongoObjectId {
  $oid: string;
}
interface ObjectWithId {
  [key: string]: any;
}

function isMongoObjectId(obj: any): obj is MongoObjectId {
  return obj && typeof obj === 'object' && '$oid' in obj && typeof obj.$oid === 'string';
}

/**
 * Extracts the string ID from a MongoDB ObjectId
 * @param {any} obj - The object containing an ObjectId
 * @param {string} field - The field name containing the ObjectId (optional)
 * @param {string} defaultValue - Value to return if no ObjectId is found (default: '')
 * @returns {string} The extracted ID string or defaultValue if not found
 */

export function extractObjectId(obj: any, field?: string, defaultValue: string = ''): string {
  try {
    // If a specific field is provided, extract from that field
    if (field && obj && typeof obj === 'object') {
      const fieldValue = obj[field];
      if (isMongoObjectId(fieldValue)) {
        return fieldValue.$oid;
      }
      return defaultValue;
    }
    
    // If the object itself is an ObjectId
    if (isMongoObjectId(obj)) {
      return obj.$oid;
    }
    
    return defaultValue;
  } catch (error) {
    console.error('Error extracting ObjectId:', error);
    return defaultValue;
  }
}

// Examples of usage:

// Example 1: Extract from a direct ObjectId
const objectId = { $oid: '67e2826c731bc10be41c23af' };
const idString1 = extractObjectId(objectId);
console.log(idString1); // '67e2826c731bc10be41c23af'

// Example 2: Extract from an object with an ObjectId field
const document = { 
  form_id: { $oid: '67e2826c731bc10be41c23af' },
  name: 'Sample Form'
};
const idString2 = extractObjectId(document, 'form_id');
console.log(idString2); // '67e2826c731bc10be41c23af'