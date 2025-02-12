import React, { useState } from "react";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/constants/constants";
import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";

type InspireRequestSchema = {
  user_query: string;
  prompt_text: string;
  form_name: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFormIdObject(value: any): value is { $oid: string } {
  return value && typeof value === "object" && "$oid" in value;
}

const InspireButton: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );
  const { save } = useSaveSubpoint();
  const [isFetching, setIsFetching] = useState(false);

  const handleUpdateSubpoint = (value: string) => {
    dispatch(updateSelectedSubpoint(value));
  };

  const handleInspire = async () => {
    if (isFetching) return;
    setIsFetching(true);

    const prompt =
      selectedForm?.form_type.questions[selectedPoint]?.subpoints[
        selectedSubpoint
      ]?.prompt || "";
    const formName = selectedForm?.name || "";
    const userQuery =
      selectedForm?.form_type.questions[selectedPoint].subpoints[
        selectedSubpoint
      ].prompt || "";

    const data: InspireRequestSchema = {
      user_query: userQuery,
      prompt_text: prompt,
      form_name: formName,
    };

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${BASE_URL}/retrieval/generate-field`, {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch stream");
      }

      // Create a reader to process the stream.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let finalText = "";

      // Read the stream until it’s done.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Decode the received chunk.
        const chunk = decoder.decode(value);
        // Update the text one character at a time.
        for (const char of chunk) {
          finalText += char;
          handleUpdateSubpoint(finalText);
          // Optional: add a delay for visual effect.
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      }

      // Once streaming is complete, execute the save function.
      save(
        finalText,
        selectedSubpoint,
        selectedPoint,
        isFormIdObject(selectedForm?.form_id)
          ? selectedForm.form_id.$oid
          : selectedForm?.form_id || "",
        selectedForm?.name || ""
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error inspiring:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Button variant="primary" onClick={handleInspire} disabled={isFetching}>
      {isFetching ? "Loading..." : "Inspire"}
    </Button>
  );
};

export default InspireButton;
