import { FormQuestion } from "@/types/formType";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { RootState } from "@/store/store";
import {
  setSelectedSubpoint,
  updateSelectedSubpoint,
} from "@/store/forms/formSlice";
import { BASE_URL } from "@/constants/constants";
import { useMutation } from "@tanstack/react-query";

interface UpdateFormPayload {
  form_id: string;
  form_name: string;
  text: string;
  form_point: number;
  form_subpoint: number;
}

interface ClasicSubpointProps {
  question: FormQuestion;
  index: number;
}

interface ApiResponse {
  message: string;
}

const updateForm = async (data: UpdateFormPayload): Promise<ApiResponse> => {
  const { ...body } = data;
  const token = localStorage.getItem("authToken");

  console.log(body);
  const response = await fetch(`${BASE_URL}/form-update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Replace with your token
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};

const ClasicSubpoint: React.FC<ClasicSubpointProps> = ({ index, question }) => {
  const dispatch = useDispatch();

  const mutation = useMutation<ApiResponse, Error, UpdateFormPayload>({
    mutationFn: updateForm,
    onSuccess: (data) => {
      console.log(data.message);
    },
    onError: (error) => {
      console.error("Error updating form:", error.message);
    },
  });

  const updateSubpoint = (data: string) => {
    dispatch(updateSelectedSubpoint(data));
  };

  const selectSubpoint = (index: number) => {
    dispatch(setSelectedSubpoint(index));
  };

  const { selectedForm } = useSelector((state: RootState) => state.userForms);
  const { selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const [userInput, setUserInput] = useState<string>(
    selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || ""
  );
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setUserInput(
      selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || ""
    );
  }, [index, selectedForm?.points, selectedPoint, selectedSubpoint]);

  const upsert = (
    value: string,
    point: number,
    subpoint: number,
    form_id: string,
    form_name: string
  ) => {
    // API CALL
    mutation.mutate({
      form_id,
      form_name,
      text: value,
      form_point: point,
      form_subpoint: subpoint,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    console.log(newValue);
    setUserInput(newValue);
    updateSubpoint(newValue);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      upsert(
        newValue,
        selectedPoint + 1,
        selectedSubpoint + 1,
        selectedForm?.form_id || "",
        selectedForm?.name || ""
      );
    }, 5000);

    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div
      className={
        selectedSubpoint == index
          ? "mx-1 px-2 rounded-lg border-2 border-gray-300"
          : "mx-1 px-2 rounded-lg"
      }
      onClick={() => selectSubpoint(index)}
    >
      <div className="label">
        <span className="label-text">{question.sub_title}</span>
        {/* <span className="label-text-alt">Save</span> */}
      </div>
      <textarea
        className="textarea textarea-bordered resize-none w-full leading-tight h-40 focus:border-none"
        placeholder="Enter your text here..."
        value={userInput}
        onChange={handleChange}
      />
    </div>
  );
};

export default ClasicSubpoint;
