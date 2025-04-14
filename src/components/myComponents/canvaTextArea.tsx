"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { CanvaDiv, type CanvaDivRef } from "./canvaDiv";

interface CanvaTextAreaProps {
  index: number;
}

const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
  const { selectedForm, selectedPoint } = useSelector(
    (state: RootState) => state.userForms
  );
  const divRef = useRef<CanvaDivRef>(null);
  const divElementRef = useRef<HTMLDivElement>(null);

  const currentContent =
    selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

  // Update content when it changes in Redux
  useEffect(() => {
    if (divRef.current) {
      divRef.current.setValue(currentContent);
    }
  }, [currentContent]);

  return (
    <div ref={divElementRef} className="relative">
      <CanvaDiv
        ref={divRef}
        defaultValue={currentContent}
        variant="default"
        className="resize-none bg-[#FCFAF4] min-h-[2.5rem]"
        index={index}
      />
    </div>
  );
};

export default CanvaTextArea;

// ##################################################################

// #NEW AND WORKING

// ##################################################################

// "use client";

// #################################################################

// OldShool component

// #################################################################

// #################################################################

// New iteration that might work

// #################################################################

// Best one yet

// #################################################################

// First 5 letters, missing textarea shadcn

// #################################################################

// BEST ONE

// #################################################################
