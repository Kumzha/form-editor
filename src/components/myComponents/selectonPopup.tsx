import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ModifyButton from "./modifyButton";

interface SelectionPopupProps {
  index: number;
  selectedText: string;
  subpointText: string;
  rect: DOMRect;
  parentRef: React.RefObject<HTMLElement>;
  onClose: () => void;
}

export function SelectionPopup({
  selectedText,
  rect,
  parentRef,
  index,
  subpointText,
  onClose,
}: SelectionPopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const prompt =
    selectedForm?.form_type.questions[selectedPoint]?.subpoints[index]
      ?.prompt || "";

  const formName = selectedForm?.name || "";

  // Mount state for client-side rendering
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Calculate position for the popup using ResizeObserver
  React.useEffect(() => {
    if (!mounted || !popupRef.current || !parentRef.current) return;

    const calculatePosition = () => {
      const popupRect = popupRef.current?.getBoundingClientRect();
      if (!popupRect) return;

      // Get position relative to viewport
      const top = rect.top - popupRect.height - 10;
      const left = rect.left + rect.width / 2 - popupRect.width / 2;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Ensure popup stays within viewport
      const safeTop = Math.max(
        10,
        Math.min(top, viewportHeight - popupRect.height - 10)
      );
      const safeLeft = Math.max(
        10,
        Math.min(left, viewportWidth - popupRect.width - 10)
      );

      setPosition({ top: safeTop, left: safeLeft });
    };

    // Create a ResizeObserver to handle popup size changes
    const resizeObserver = new ResizeObserver(calculatePosition);
    resizeObserver.observe(popupRef.current);

    // Initial calculation
    calculatePosition();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [rect, parentRef, mounted]);

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
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

  // Prevent clicks inside the popup from bubbling up to the document
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // The actual popup component
  const popupElement = (
    <div
      ref={popupRef}
      className="fixed z-[9999] bg-white shadow-lg rounded-md p-2 border border-gray-200 w-2/6"
      style={{
        visibility: position ? "visible" : "hidden",
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        opacity: position ? 1 : 0,
        transition: "opacity 0.15s ease-in-out",
      }}
      onClick={handlePopupClick}
    >
      <AnimatePresence>
        <motion.div
          key="modify-section"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="flex gap-1 items-center"
        >
          <ModifyButton
            subpointText={subpointText}
            selectedText={selectedText}
            query={prompt}
            subpointIndex={index}
            formName={formName}
            index={index}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Only render on client-side and use portal
  return mounted ? createPortal(popupElement, document.body) : null;
}
