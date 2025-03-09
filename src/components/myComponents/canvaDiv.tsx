// "use client";

// import * as React from "react";
// import { cn } from "@/lib/utils";
// import { SelectionPopup } from "./selectonPopup";

// interface CanvaDivProps extends React.HTMLAttributes<HTMLDivElement> {
//   variant?: "default" | "newForm" | "secondary";
//   defaultValue?: string;
//   index: number;
// }

// export interface CanvaDivRef {
//   getValue: () => string;
//   setValue: (value: string) => void;
// }

// const CanvaDiv = React.forwardRef<CanvaDivRef, CanvaDivProps>(
//   ({ className, variant = "default", defaultValue = "", ...props }, ref) => {
//     const divRef = React.useRef<HTMLDivElement>(null);
//     const isInitialMount = React.useRef(true);
//     const [selection, setSelection] = React.useState<{
//       text: string;
//       rect: DOMRect | null;
//       isOpen: boolean;
//       savedRange: Range | null;
//     }>({ text: "", rect: null, isOpen: false, savedRange: null });
//     const preventSelectionClearRef = React.useRef(false);

//     const variantClasses = {
//       default:
//         "flex min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//       newForm:
//         "col-span-5 border border-grey-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
//       secondary: "bg-gray-50 border-gray-300 text-gray-700",
//     };

//     // Set initial content only once after mount
//     React.useEffect(() => {
//       if (isInitialMount.current && divRef.current) {
//         divRef.current.textContent = defaultValue;
//         isInitialMount.current = false;
//       }
//     }, [defaultValue]);

//     // Handle text selection
//     const handleSelectionChange = React.useCallback(() => {
//       // Skip if we're preventing selection clear during popup interaction
//       if (preventSelectionClearRef.current) return;

//       const windowSelection = window.getSelection();

//       if (
//         windowSelection &&
//         windowSelection.toString().trim() !== "" &&
//         divRef.current &&
//         divRef.current.contains(windowSelection.anchorNode)
//       ) {
//         const range = windowSelection.getRangeAt(0);
//         const selectedText = windowSelection.toString();
//         const rect = range.getBoundingClientRect();

//         // Clone the range to save it
//         const savedRange = range.cloneRange();

//         setSelection({
//           text: selectedText,
//           rect,
//           isOpen: true,
//           savedRange,
//         });
//       }
//     }, []);

//     // Create a global document-level handler for capturing mousedown events on popup
//     React.useEffect(() => {
//       // Handler for capturing events on the popup to prevent selection loss
//       const handleSelectionPreservation = (e: MouseEvent) => {
//         // Check if this is a popup interaction
//         if (!selection.isOpen) return;

//         let target = e.target as HTMLElement | null;
//         let isPopupClick = false;

//         // Walk up the DOM tree to see if we're clicking inside the popup
//         while (target) {
//           if (
//             target.classList &&
//             (target.classList.contains("selection-popup") ||
//               target.closest(".selection-popup"))
//           ) {
//             isPopupClick = true;
//             break;
//           }
//           target = target.parentElement;
//         }

//         // If it's a popup click, prevent selection from being cleared
//         if (isPopupClick) {
//           e.preventDefault();
//           e.stopPropagation();

//           // Set flag to prevent selection handling
//           preventSelectionClearRef.current = true;

//           // Restore selection
//           if (selection.savedRange) {
//             try {
//               const windowSelection = window.getSelection();
//               if (windowSelection) {
//                 windowSelection.removeAllRanges();
//                 windowSelection.addRange(selection.savedRange);
//               }
//             } catch (err) {
//               console.error("Failed to restore selection:", err);
//             }
//           }

//           // Reset flag after a short delay
//           setTimeout(() => {
//             preventSelectionClearRef.current = false;
//           }, 100);
//         }
//       };

//       // Add in capture phase to intercept before default browser behavior
//       document.addEventListener("mousedown", handleSelectionPreservation, true);

//       return () => {
//         document.removeEventListener(
//           "mousedown",
//           handleSelectionPreservation,
//           true
//         );
//       };
//     }, [selection.isOpen, selection.savedRange]);

//     // Function to close the popup
//     const handleClosePopup = React.useCallback(() => {
//       setSelection((prev) => ({
//         ...prev,
//         isOpen: false,
//       }));

//       // Clear selection state completely after popup is closed
//       setTimeout(() => {
//         setSelection({ text: "", rect: null, isOpen: false, savedRange: null });
//       }, 150);
//     }, []);

//     // Add selection change listener
//     React.useEffect(() => {
//       document.addEventListener("selectionchange", handleSelectionChange);
//       return () => {
//         document.removeEventListener("selectionchange", handleSelectionChange);
//       };
//     }, [handleSelectionChange]);

//     // Handle mouse up to catch selection immediately
//     const handleMouseUp = () => {
//       if (!preventSelectionClearRef.current) {
//         handleSelectionChange();
//       }
//     };

//     // Expose methods to parent via ref
//     React.useImperativeHandle(ref, () => ({
//       getValue: () => divRef.current?.textContent || "",
//       setValue: (value: string) => {
//         if (divRef.current) {
//           // Save selection position
//           const selection = window.getSelection();
//           const hadFocus = document.activeElement === divRef.current;

//           // Update content
//           divRef.current.textContent = value;

//           // Restore focus if it was focused before
//           if (hadFocus) {
//             divRef.current.focus();

//             // Move cursor to end if we had focus
//             if (selection && divRef.current) {
//               const range = document.createRange();
//               range.selectNodeContents(divRef.current);
//               range.collapse(false); // collapse to end
//               selection.removeAllRanges();
//               selection.addRange(range);
//             }
//           }
//         }
//       },
//     }));

//     return (
//       <div className="relative">
//         <div
//           className={cn(
//             "flex min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//             variantClasses[variant],
//             className
//           )}
//           ref={divRef}
//           contentEditable={true}
//           suppressContentEditableWarning={true}
//           onMouseUp={handleMouseUp}
//           {...props}
//         />

//         {selection.isOpen && selection.text && selection.rect && (
//           <SelectionPopup
//             subpointText={defaultValue}
//             index={props.index}
//             selectedText={selection.text}
//             rect={selection.rect}
//             parentRef={divRef}
//             onClose={handleClosePopup}
//             savedSelection={selection.savedRange}
//           />
//         )}
//       </div>
//     );
//   }
// );

// CanvaDiv.displayName = "canvaDiv";

// export { CanvaDiv };

// OLD

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SelectionPopup } from "./selectonPopup";

interface CanvaDivProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "newForm" | "secondary";
  defaultValue?: string;
  index: number;
}

export interface CanvaDivRef {
  getValue: () => string;
  setValue: (value: string) => void;
}

const CanvaDiv = React.forwardRef<CanvaDivRef, CanvaDivProps>(
  ({ className, variant = "default", defaultValue = "", ...props }, ref) => {
    const divRef = React.useRef<HTMLDivElement>(null);
    const isInitialMount = React.useRef(true);
    const [selection, setSelection] = React.useState<{
      text: string;
      rect: DOMRect | null;
      isOpen: boolean;
    }>({ text: "", rect: null, isOpen: false });

    const variantClasses = {
      default:
        "flex min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      newForm:
        "col-span-5 border border-grey-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      secondary: "bg-gray-50 border-gray-300 text-gray-700",
    };

    // Set initial content only once after mount
    React.useEffect(() => {
      if (isInitialMount.current && divRef.current) {
        divRef.current.textContent = defaultValue;
        isInitialMount.current = false;
      }
    }, [defaultValue]);

    // Handle text selection
    const handleSelectionChange = React.useCallback(() => {
      const windowSelection = window.getSelection();

      if (
        windowSelection &&
        windowSelection.toString().trim() !== "" &&
        divRef.current &&
        divRef.current.contains(windowSelection.anchorNode)
      ) {
        const range = windowSelection.getRangeAt(0);
        const selectedText = windowSelection.toString();
        const rect = range.getBoundingClientRect();

        setSelection({ text: selectedText, rect, isOpen: true });
      } else {
        // Don't immediately hide popup to allow interactions with it
        // The popup will be hidden only when clicking outside via onClose handler
      }
    }, []);

    // Function to close the popup
    const handleClosePopup = React.useCallback(() => {
      setSelection((prev) => ({
        ...prev,
        isOpen: false,
      }));

      // Clear selection after popup is closed
      setTimeout(() => {
        if (!selection.isOpen) {
          setSelection({ text: "", rect: null, isOpen: false });
        }
      }, 150); // Small delay to ensure popup animations complete
    }, [selection.isOpen]);

    // Add selection change listener
    React.useEffect(() => {
      document.addEventListener("selectionchange", handleSelectionChange);
      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
      };
    }, [handleSelectionChange]);

    // Handle mouse up to catch selection immediately
    const handleMouseUp = () => {
      handleSelectionChange();
    };

    // Expose methods to parent via ref
    React.useImperativeHandle(ref, () => ({
      getValue: () => divRef.current?.textContent || "",
      setValue: (value: string) => {
        if (divRef.current) {
          // Save selection position
          const selection = window.getSelection();
          const hadFocus = document.activeElement === divRef.current;

          // Update content
          divRef.current.textContent = value;

          // Restore focus if it was focused before
          if (hadFocus) {
            divRef.current.focus();

            // Move cursor to end if we had focus
            if (selection && divRef.current) {
              const range = document.createRange();
              range.selectNodeContents(divRef.current);
              range.collapse(false); // collapse to end
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
      },
    }));

    return (
      <div className="relative">
        <div
          className={cn(
            "flex min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            variantClasses[variant],
            className
          )}
          ref={divRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onMouseUp={handleMouseUp}
          {...props}
        />

        {selection.isOpen && selection.text && selection.rect && (
          <SelectionPopup
            subpointText={defaultValue}
            index={props.index}
            selectedText={selection.text}
            rect={selection.rect}
            parentRef={divRef}
            onClose={handleClosePopup}
          />
        )}
      </div>
    );
  }
);

CanvaDiv.displayName = "canvaDiv";

export { CanvaDiv };
