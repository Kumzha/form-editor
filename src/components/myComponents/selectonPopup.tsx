import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ModifyButton from "./modifyButton";
import { useRef, useState, useEffect, FC, RefObject } from "react";

interface SelectionPopupProps {
  selectedText: string;
  rect: DOMRect;
  parentRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  index: number;
  subpointText: string;
  reselectText?: () => boolean;
  onApply?: () => void;
  onInputFocus?: (focused: boolean) => void;
}

export const SelectionPopup: FC<SelectionPopupProps> = ({
  selectedText,
  rect,
  parentRef,
  onClose,
  index,
  subpointText,
  onApply,
  onInputFocus,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const { selectedForm, selectedPoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const prompt =
    selectedForm?.form_type.questions[selectedPoint]?.subpoints[index]
      ?.prompt || "";

  const formName = selectedForm?.name || "";

  // Mount state for client-side rendering
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Calculate position for the popup relative to its parent container
  useEffect(() => {
    if (!mounted || !popupRef.current || !parentRef.current) return;

    const calculatePosition = () => {
      const popupRect = popupRef.current?.getBoundingClientRect();
      if (!popupRect || !parentRef.current) return;

      // Get parent container's position
      const parentRect = parentRef.current.getBoundingClientRect();

      // Define minimum space needed above for positioning
      const MIN_SPACE_ABOVE = popupRect.height + 10; // popup height + margin
      const hasEnoughSpaceAbove = rect.top - parentRect.top >= MIN_SPACE_ABOVE;

      let relativeTop;

      if (hasEnoughSpaceAbove) {
        // Position above the selection if there's enough space
        relativeTop = rect.top - parentRect.top - popupRect.height - 10;
      } else {
        // Position below the selection if there's not enough space above
        relativeTop = rect.top - parentRect.top + rect.height + 10;
      }

      // Center horizontally on the selection, relative to parent
      const relativeLeft =
        rect.left - parentRect.left + rect.width / 2 - popupRect.width / 2;

      // Ensure popup stays within parent bounds
      const safeTop = Math.max(
        10,
        Math.min(relativeTop, parentRect.height - popupRect.height - 10)
      );
      const safeLeft = Math.max(
        10,
        Math.min(relativeLeft, parentRect.width - popupRect.width - 10)
      );

      // Position the popup by setting absolute positioning relative to parent
      setPosition({ top: safeTop, left: safeLeft });
    };

    // Create a ResizeObserver to handle popup size changes
    const resizeObserver = new ResizeObserver(calculatePosition);
    if (popupRef.current) {
      resizeObserver.observe(popupRef.current);
    }

    // Initial calculation
    calculatePosition();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [rect, parentRef, mounted]);

  // useEffect(() => {
  //   if (onApply) {
  //     onApply();
  //   }
  // }, []);
  // Handle click outside - modified to not close when clicking inside the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        // Check if the click is on an input element inside the popup
        const target = event.target as HTMLElement;
        const isInputInsidePopup =
          popupRef.current.contains(target) &&
          (target.tagName === "INPUT" || target.closest("input"));

        // Only close if not clicking on an input element
        if (!isInputInsidePopup) {
          onClose();
        }
      }
    };

    // Add the event listener only when popup is mounted
    if (mounted) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, mounted]);

  // Function to handle the apply button click
  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (onApply) {
      onApply();
    }
  };

  // Stop propagation for input interactions to prevent popup from closing
  // const handleInputInteraction = (e: React.SyntheticEvent) => {
  //   e.stopPropagation();
  // };

  // The actual popup component
  const popupElement = (
    <div
      ref={popupRef}
      className="absolute z-[9999] bg-white shadow-lg rounded-md p-2 border border-gray-200 w-2/6"
      style={{
        visibility: position ? "visible" : "hidden",
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        opacity: position ? 1 : 0,
        transition: "opacity 0.15s ease-in-out",
      }}
      onClick={(e) => e.stopPropagation()} // Stop click propagation at the container level
    >
      <AnimatePresence>
        <motion.div
          key="modify-section"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="flex gap-1 items-center"
          onClick={(e) => e.stopPropagation()} // Stop propagation here too
        >
          <div
            onClick={(e) => {
              e.stopPropagation(); // Stop event propagation
              handleApply(e);
            }}
            onMouseDown={(e) => e.stopPropagation()} // Prevent selection cancellation
          >
            <ModifyButton
              subpointText={subpointText}
              selectedText={selectedText}
              query={prompt}
              subpointIndex={index}
              formName={formName}
              index={index}
              onApply={onApply}
              onInputFocus={onInputFocus}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return mounted && parentRef.current
    ? createPortal(popupElement, parentRef.current)
    : null;
};
