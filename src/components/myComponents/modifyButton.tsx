"use client";

import type React from "react";
import { useRef, useState } from "react";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/constants/constants";
import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";
import { useMutation } from "@tanstack/react-query";
import type { RootState } from "@/store/store";
import { FaMagic } from "react-icons/fa";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface ModifyProps {
  selectedText: string;
  subpointText: string;
  query: string;
  formName: string;
  subpointIndex: number;
  index: number;
  onInputFocus?: (focused: boolean) => void;
  onApply?: () => void;
}

type UpdateFieldRequest = {
  user_query: string;
  prompt_text: string;
  form_name: string;
  subpoint_text: string;
  selected_text: string;
};

type ApiResponse = {
  result: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFormIdObject(value: any): value is { $oid: string } {
  return value && typeof value === "object" && "$oid" in value;
}

// Track active modify operations
const activeModifyOperations = new Set<string>();

// API function to update the field
const updateField = async (data: UpdateFieldRequest): Promise<ApiResponse> => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${BASE_URL}/retrieval/update-field`, {
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

const ModifyButton: React.FC<ModifyProps> = ({
  selectedText,
  subpointText,
  query,
  formName,
  subpointIndex,
  onInputFocus,
  onApply,
}) => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const [userPrompt, setUserPrompt] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Stop event propagation
    setUserPrompt(e.target.value);
  };

  const { save } = useSaveSubpoint();

  // Store the target point and subpoint
  const targetPoint = useRef(selectedPoint);
  const targetSubpoint = useRef(subpointIndex);

  // Create a key for this specific modification
  const modifyKey = `${selectedPoint}-${subpointIndex}`;
  const isModifyActive = activeModifyOperations.has(modifyKey);

  const modifyMutation = useMutation<ApiResponse, Error, UpdateFieldRequest>({
    mutationFn: updateField,
    onMutate: () => {
      // Mark this operation as active
      activeModifyOperations.add(modifyKey);
      // Store the current targets
      targetPoint.current = selectedPoint;
      targetSubpoint.current = subpointIndex;
    },
    onSuccess: (data) => {
      // Find any highlighted text span in the document
      const highlightedSpan = document.querySelector('.bg-blue-600.text-white');
      
      if (highlightedSpan) {
        // Replace only the highlighted text with the API result
        highlightedSpan.textContent = data.result;
        
        // After replacing the text, get the updated full content
        const parentElement = highlightedSpan.parentElement;
        const updatedContent = parentElement?.textContent || subpointText;
        
        // Update Redux with the full updated content
        dispatch(
          updateSelectedSubpoint({
            point: targetPoint.current,
            subpoint: targetSubpoint.current,
            content: updatedContent,
          })
        );

        // Save the updated content to backend
        save(
          updatedContent,
          targetSubpoint.current,
          targetPoint.current,
          isFormIdObject(selectedForm?.form_id)
            ? selectedForm.form_id.$oid
            : selectedForm?.form_id || "",
          selectedForm?.name || ""
        );
        
        // Remove the highlight styling after applying
        const spanParent = highlightedSpan.parentNode;
        if (spanParent) {
          const textNode = document.createTextNode(data.result);
          spanParent.replaceChild(textNode, highlightedSpan);
        }
      } else {
        // Fallback to original behavior if no highlight span is found
        dispatch(
          updateSelectedSubpoint({
            point: targetPoint.current,
            subpoint: targetSubpoint.current,
            content: data.result,
          })
        );

        save(
          data.result,
          targetSubpoint.current,
          targetPoint.current,
          isFormIdObject(selectedForm?.form_id)
            ? selectedForm.form_id.$oid
            : selectedForm?.form_id || "",
          selectedForm?.name || ""
        );
      }
    },
    onError: (error) => {
      console.error("Error updating form:", error.message);
      toast.error(`Error: ${error.message}`);
    },
    onSettled: () => {
      // Remove from active operations
      activeModifyOperations.delete(modifyKey);
    },
  });

  const handleSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up

    if (!userPrompt || !query || !formName || !subpointText) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (isModifyActive) return;

    const data: UpdateFieldRequest = {
      user_query: userPrompt,
      prompt_text: query,
      form_name: formName,
      subpoint_text: subpointText,
      selected_text: selectedText || subpointText,
    };

    // Trigger the mutation
    modifyMutation.mutate(data);
    
    // Clear input after submitting
    setUserPrompt("");
    
    // Call onApply callback if it exists
    if (onApply) {
      onApply();
    }
  };

  // Handle input focus events
  // const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  //   e.stopPropagation();
  //   console.log("Input focus");
  //   if (onInputFocus) onInputFocus(true);
  // };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onInputFocus) onInputFocus(false);
  };

  // Focus the input automatically when it mounts
  // useEffect(() => {
  //   if (inputRef.current) {
  //     // Small delay to ensure the popup is fully rendered
  //     setTimeout(() => {
  //       if (inputRef.current) {
  //         inputRef.current.focus();
  //       }
  //     }, 100);
  //   }
  // }, []);

  const isPending = modifyMutation.isPending || isModifyActive;

  return (
    <div
      className="flex flex-row w-full h-8 items-center bg-transparent"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Input
        ref={inputRef}
        onChange={handlePromptChange}
        placeholder="Enter your prompt"
        className="bg-[#FCFAF4] mx-1 w-full rounded-2xl border-none"
        value={userPrompt}
        disabled={isPending || !subpointText}
        onBlur={handleInputBlur}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (onApply) onApply();
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              // Force the input to be editable if needed
              inputRef.current.readOnly = false;

              // If the above doesn't work, try this trick to force focus
              inputRef.current.blur();
              inputRef.current.focus();
            }
          }, 50);
        }}
      />
      <div
        className={`
        relative inline-block text-left bg-[#524CE7] rounded-xl text-[#FCFAF4] p-2 
        transform transition duration-150 ease-in-out 
        ${
          isPending
            ? "cursor-wait"
            : "hover:scale-105 active:scale-95 cursor-pointer"
        }
        ${
          isPending
            ? "shadow-inner shadow-[#3a36a3]"
            : "shadow-sm hover:shadow-md"
        }
      `}
        onClick={isPending ? undefined : handleSubmit}
        onMouseDown={(e) => e.stopPropagation()}
        aria-disabled={isPending}
      >
        <div className="relative">
          {isPending ? (
            <div className="flex items-center justify-center">
              <FaMagic className="animate-pulse opacity-70" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-[#FCFAF4] animate-spin"></span>
              </span>
            </div>
          ) : (
            <FaMagic />
          )}
        </div>

        {/* Ripple effect when active */}
        {isPending && (
          <span className="absolute inset-0 rounded-xl overflow-hidden">
            <span className="absolute inset-0 rounded-xl bg-white/20 animate-ping opacity-30"></span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ModifyButton;
