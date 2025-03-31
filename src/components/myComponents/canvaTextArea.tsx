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
        // Get the computed height of the contentEditable element
        const computedHeight = (canvaDiv as HTMLElement).style.height;
        const contentHeight = parseInt(computedHeight) || Math.max(60, (canvaDiv as HTMLElement).scrollHeight + 10);
        
        // Only update if the height has actually changed
        if (divElementRef.current.style.height !== `${contentHeight}px`) {
          // Apply the height to parent container
          divElementRef.current.style.height = `${contentHeight}px`;
        }
        
        // No need to set height on canvaDiv again - it handles its own height now
      }
    }
  }, []);

  // Update content when it changes in Redux
  useEffect(() => {
    // For Inspire button to work properly, we need to ensure the divRef is updated
    if (divRef.current) {
      // Always update when content changes from Redux, even if the ref's getValue might report 
      // the same value (since there could be pending updates)
      divRef.current.setValue(currentContent);
      
      // Request animation frame for smoother updates
      requestAnimationFrame(adjustDivHeight);
    }
  }, [currentContent, adjustDivHeight]);

  // Handle window resize with debounce
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout | null = null;
    
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        adjustDivHeight();
      }, 100);
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [adjustDivHeight]);

  // Set up an observer just for height adjustment
  useEffect(() => {
    if (!divElementRef.current) return;

    let mutationTimeout: NodeJS.Timeout | null = null;
    
    const observer = new MutationObserver(() => {
      // Debounce mutation observer callbacks
      if (mutationTimeout) {
        clearTimeout(mutationTimeout);
      }
      mutationTimeout = setTimeout(() => {
        adjustDivHeight();
      }, 50);
    });

    observer.observe(divElementRef.current, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    return () => {
      if (mutationTimeout) {
        clearTimeout(mutationTimeout);
      }
      observer.disconnect();
    };
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
