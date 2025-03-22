"use client";

import type React from "react";
import { useRef, useEffect, useCallback } from "react";
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

  // Adjust the height of the div based on content
  const adjustDivHeight = useCallback(() => {
    if (divElementRef.current && divRef.current) {
      // Get the CanvaDiv child
      const canvaDiv = divElementRef.current.querySelector('[contenteditable="true"]');
      
      if (canvaDiv) {
        // Calculate the content height with extra padding
        const contentHeight = Math.max(60, canvaDiv.scrollHeight + 10);
        
        // Apply the height to both parent and child
        divElementRef.current.style.height = `${contentHeight}px`;
        
        // Cast to HTMLElement to access style property
        (canvaDiv as HTMLElement).style.height = `${contentHeight}px`;
        (canvaDiv as HTMLElement).style.overflowY = "hidden";
        
        console.log("CanvaTextArea: adjusted height to", contentHeight);
      }
    }
  }, []);

  // Update content when it changes in Redux
  useEffect(() => {
    // For Inspire button to work properly, we need to ensure the divRef is updated
    if (divRef.current) {
      console.log("CanvaTextArea: Redux content changed to:", currentContent);
      
      // Always update when content changes from Redux, even if the ref's getValue might report 
      // the same value (since there could be pending updates)
      divRef.current.setValue(currentContent);
      
      // Force height adjustment
      setTimeout(adjustDivHeight, 10);
    }
  }, [currentContent, adjustDivHeight]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => adjustDivHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustDivHeight]);

  // Set up an observer just for height adjustment
  useEffect(() => {
    if (!divElementRef.current) return;

    const observer = new MutationObserver(() => {
      adjustDivHeight();
    });

    observer.observe(divElementRef.current, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [adjustDivHeight]);

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
