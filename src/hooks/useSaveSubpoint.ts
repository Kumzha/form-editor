import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/constants";
import { toast } from "sonner";

type SaveRequestSchema = {
  form_name: string;
  form_id: string;
  form_point: number;
  form_subpoint: number;
  text: string;
};

type SaveApiResponse = {
  result: string;
};

const saveSubpoint = async (
  data: SaveRequestSchema
): Promise<SaveApiResponse> => {
  const token = localStorage.getItem("authToken");

  // Log the payload for debugging
  // console.log("Payload sent to API:", data);

  // Note the use of template literals for both the URL and the Authorization header.
  const response = await fetch(`${BASE_URL}/form-update`, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update form");
  }
  
  return response.json();
};

export const useSaveSubpoint = () => {
  const mutation = useMutation<SaveApiResponse, Error, SaveRequestSchema>({
    mutationFn: saveSubpoint,
    onSuccess: (data) => {
      console.log("Subpoint updated successfully!", data);
      toast.success("Subpoint updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating subpoint:", error.message);
      // toast.error("Failed to update form");
    },
  });

  /**
   * Call this function with:
   * @param text - the subpoint text content.
   * @param selectedSubpoint - the index of the subpoint.
   * @param selectedPoint - the index of the point.
   * @param formId - the form's id.
   * @param formName - the form's name.
   */
  const save = (
    text: string,
    selectedSubpoint: number,
    selectedPoint: number,
    formId: string,
    formName: string
  ) => {
    if (!formId || !formName) {
      console.warn("Missing form ID or name, skipping save to backend");
      return;
    }
    
    const data: SaveRequestSchema = {
      form_name: formName,
      form_id: formId,
      text,
      form_point: selectedPoint,
      form_subpoint: selectedSubpoint,
    };
    
    mutation.mutate(data);
  };

  return { save, ...mutation };
};
