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
    if (divElementRef.current) {
      // Reset height to auto to get the correct scrollHeight
      divElementRef.current.style.height = "auto";
      // Set the height to the scrollHeight
      divElementRef.current.style.height = `${divElementRef.current.scrollHeight}px`;
      divElementRef.current.style.overflowY = "hidden";
    }
  }, []);

  // Update content when it changes in Redux
  useEffect(() => {
    if (divRef.current && divRef.current.getValue() !== currentContent) {
      divRef.current.setValue(currentContent);
      adjustDivHeight();
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

// import type React from "react";
// import { useState, useRef, useEffect, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store/store";
// import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";
// import {
//   updateSelectedSubpoint,
//   setSelectedSubpoint,
// } from "@/store/forms/formSlice";
// import { CanvaDiv, type CanvaDivRef } from "./canvaDiv";

// interface CanvaTextAreaProps {
//   index: number;
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function isFormIdObject(value: any): value is { $oid: string } {
//   return value && typeof value === "object" && "$oid" in value;
// }

// const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
//     (state: RootState) => state.userForms
//   );
//   const { save } = useSaveSubpoint();
//   const dispatch = useDispatch();
//   const divRef = useRef<CanvaDivRef>(null);
//   const divElementRef = useRef<HTMLDivElement>(null);

//   const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
//     null
//   );
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [selectedText, setSelectedText] = useState<string>("");

//   const currentContent =
//     selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

//   // Handle text selection from the CanvaDiv component
//   const handleSelectionChange = useCallback(() => {
//     const windowSelection = window.getSelection();

//     if (
//       windowSelection &&
//       windowSelection.toString().trim() !== "" &&
//       divElementRef.current &&
//       divElementRef.current.contains(windowSelection.anchorNode)
//     ) {
//       const selected = windowSelection.toString();
//       // Update the selected subpoint in redux when text is selected
//       dispatch(setSelectedSubpoint(index));
//       if (selected) {
//         setSelectedText(selected);
//       }
//     }
//   }, [dispatch, index]);

//   // Update content in Redux and save with debounce
//   const handleUpdateSubpoint = useCallback(
//     (value: string) => {
//       // Update this specific subpoint
//       dispatch(
//         updateSelectedSubpoint({
//           point: selectedPoint,
//           subpoint: index,
//           content: value,
//         })
//       );

//       if (debounceTimer) {
//         clearTimeout(debounceTimer);
//       }

//       const timer = setTimeout(() => {
//         save(
//           value,
//           index,
//           selectedPoint,
//           isFormIdObject(selectedForm?.form_id)
//             ? selectedForm.form_id.$oid
//             : selectedForm?.form_id || "",
//           selectedForm?.name || ""
//         );
//       }, 5000);

//       setDebounceTimer(timer);
//     },
//     [debounceTimer, dispatch, index, save, selectedForm, selectedPoint]
//   );

//   // Adjust the height of the div based on content
//   const adjustDivHeight = useCallback(() => {
//     if (divElementRef.current) {
//       // Reset height to auto to get the correct scrollHeight
//       divElementRef.current.style.height = "auto";
//       // Set the height to the scrollHeight
//       divElementRef.current.style.height = `${divElementRef.current.scrollHeight}px`;
//       divElementRef.current.style.overflowY = "hidden";
//     }
//   }, []);

//   // Update content when it changes in Redux
//   useEffect(() => {
//     if (divRef.current && divRef.current.getValue() !== currentContent) {
//       divRef.current.setValue(currentContent);
//       adjustDivHeight();
//     }
//   }, [currentContent, adjustDivHeight]);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => adjustDivHeight();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [adjustDivHeight]);

//   // Set up a mutation observer to detect content changes
//   useEffect(() => {
//     if (!divElementRef.current) return;

//     const observer = new MutationObserver(() => {
//       if (divRef.current) {
//         const newContent = divRef.current.getValue();
//         if (newContent !== currentContent) {
//           handleUpdateSubpoint(newContent);
//           adjustDivHeight();
//         }
//       }
//     });

//     observer.observe(divElementRef.current, {
//       childList: true,
//       characterData: true,
//       subtree: true,
//     });

//     return () => observer.disconnect();
//   }, [adjustDivHeight, currentContent, handleUpdateSubpoint]);

//   // Set up selection change listener
//   useEffect(() => {
//     document.addEventListener("selectionchange", handleSelectionChange);
//     return () => {
//       document.removeEventListener("selectionchange", handleSelectionChange);
//     };
//   }, [handleSelectionChange]);

//   // Make sure the correct index is passed to CanvaDiv
//   return (
//     <div ref={divElementRef} className="relative">
//       <CanvaDiv
//         ref={divRef}
//         defaultValue={currentContent}
//         variant="default"
//         className="resize-none bg-[#FCFAF4] min-h-[2.5rem]"
//         index={index}
//       />
//     </div>
//   );
// };

// export default CanvaTextArea;

// #################################################################

// OldShool component

// #################################################################

// "use client";

// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Textarea } from "../ui/textarea";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store/store";
// import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";
// import {
//   updateSelectedSubpoint,
//   setSelectedSubpoint,
// } from "@/store/forms/formSlice";

// interface CanvaTextAreaProps {
//   index: number;
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function isFormIdObject(value: any): value is { $oid: string } {
//   return value && typeof value === "object" && "$oid" in value;
// }

// const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
//     (state: RootState) => state.userForms
//   );
//   const { save } = useSaveSubpoint();
//   const dispatch = useDispatch();
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
//     null
//   );
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [selectedText, setSelectedText] = useState<string>("");

//   const currentContent =
//     selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

//   const handleTextSelection = (
//     event: React.SyntheticEvent<HTMLTextAreaElement>
//   ) => {
//     const textarea = event.target as HTMLTextAreaElement;
//     const selected = textarea.value.substring(
//       textarea.selectionStart,
//       textarea.selectionEnd
//     );
//     dispatch(setSelectedSubpoint(index));
//     if (selected) {
//       setSelectedText(selected);
//     }
//   };

//   const handleUpdateSubpoint = useCallback(
//     (value: string) => {
//       // Update this specific subpoint
//       dispatch(
//         updateSelectedSubpoint({
//           point: selectedPoint,
//           subpoint: index,
//           content: value,
//         })
//       );

//       if (debounceTimer) {
//         clearTimeout(debounceTimer);
//       }

//       const timer = setTimeout(() => {
//         save(
//           value,
//           index,
//           selectedPoint,
//           isFormIdObject(selectedForm?.form_id)
//             ? selectedForm.form_id.$oid
//             : selectedForm?.form_id || "",
//           selectedForm?.name || ""
//         );
//       }, 5000);

//       setDebounceTimer(timer);
//     },
//     [debounceTimer, dispatch, index, save, selectedForm, selectedPoint]
//   );

//   const adjustTextareaHeight = () => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//       textareaRef.current.style.overflowY = "hidden";
//     }
//   };

//   useEffect(() => {
//     adjustTextareaHeight();
//   }, [currentContent]);

//   useEffect(() => {
//     const handleResize = () => adjustTextareaHeight();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <Textarea
//       ref={textareaRef}
//       className="resize-none bg-[#FCFAF4]"
//       style={{ minHeight: "2.5rem" }}
//       variant="default"
//       value={currentContent}
//       onSelect={handleTextSelection}
//       onChange={(e) => {
//         handleUpdateSubpoint(e.target.value);
//         adjustTextareaHeight();
//       }}
//     />
//   );
// };

// export default CanvaTextArea;

// #################################################################

// Variant that stores it on the bottom of the textarea

// #################################################################

// import React, { useState, useEffect, useRef } from "react";
// import { Textarea } from "../ui/textarea";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { updateSelectedSubpoint } from "@/store/forms/formSlice";

// interface CanvaTextAreaProps {
//   index: number;
// }

// const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
//   const { selectedForm, selectedPoint } = useSelector(
//     (state: RootState) => state.userForms
//   );

//   const dispatch = useDispatch();
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const [selectedText, setSelectedText] = useState<string>("");
//   const [selectionRange, setSelectionRange] = useState<{
//     start: number;
//     end: number;
//   } | null>(null);

//   const handleTextSelection = (
//     event: React.SyntheticEvent<HTMLTextAreaElement>
//   ) => {
//     const textarea = event.target as HTMLTextAreaElement;
//     const selected = textarea.value.substring(
//       textarea.selectionStart,
//       textarea.selectionEnd
//     );

//     if (selected) {
//       setSelectedText(selected);
//       setSelectionRange({
//         start: textarea.selectionStart,
//         end: textarea.selectionEnd,
//       });
//     }
//   };

//   // Maintain highlight when clicking outside
//   useEffect(() => {
//     if (textareaRef.current && selectionRange) {
//       textareaRef.current.focus();
//       textareaRef.current.setSelectionRange(
//         selectionRange.start,
//         selectionRange.end
//       );
//     }
//   }, [selectionRange]);

//   const handleUpdateSubpoint = (value: string) => {
//     dispatch(updateSelectedSubpoint(value));
//   };

//   // Clear selection when content changes
//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     handleUpdateSubpoint(e.target.value);
//     setSelectionRange(null);
//     setSelectedText("");
//   };

//   return (
//     <div className="space-y-2">
//       <Textarea
//         ref={textareaRef}
//         value={
//           selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content ||
//           ""
//         }
//         onChange={handleChange}
//         onSelect={handleTextSelection}
//         className="min-h-[100px] focus:ring-2 focus:ring-primary"
//       />
//       {selectedText && (
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-muted-foreground">
//             Selected text: <span className="font-medium">{selectedText}</span>
//           </span>
//           <button
//             onClick={() => {
//               setSelectionRange(null);
//               setSelectedText("");
//             }}
//             className="text-xs text-destructive hover:text-destructive/90"
//           >
//             Clear Selection
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CanvaTextArea;

// #################################################################

// New iteration that might work

// #################################################################

// import type React from "react";
// import { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store/store";
// import { updateSelectedSubpoint } from "@/store/forms/formSlice";

// interface CanvaTextAreaProps {
//   index: number;
// }

// const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
//   const { selectedForm, selectedPoint } = useSelector(
//     (state: RootState) => state.userForms
//   );

//   const dispatch = useDispatch();

//   const [selectionRange, setSelectionRange] = useState<{
//     start: number;
//     end: number;
//   } | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const content =
//     selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

//   const handleTextSelection = (
//     event: React.SyntheticEvent<HTMLTextAreaElement>
//   ) => {
//     const textarea = event.target as HTMLTextAreaElement;
//     if (textarea.selectionStart !== textarea.selectionEnd) {
//       setSelectionRange({
//         start: textarea.selectionStart,
//         end: textarea.selectionEnd,
//       });
//     } else {
//       setSelectionRange(null);
//     }
//   };

//   const handleUpdateSubpoint = (value: string) => {
//     dispatch(updateSelectedSubpoint(value));
//   };

//   useEffect(() => {
//     if (textareaRef.current && selectionRange) {
//       textareaRef.current.setSelectionRange(
//         selectionRange.start,
//         selectionRange.end
//       );
//     }
//   }, [selectionRange]);

//   const renderContent = () => {
//     if (!selectionRange) return content;

//     const before = content.slice(0, selectionRange.start);
//     const selected = content.slice(selectionRange.start, selectionRange.end);
//     const after = content.slice(selectionRange.end);

//     return (
//       <>
//         {before}
//         <span style={{ backgroundColor: "blue", color: "white" }}>
//           {selected}
//         </span>
//         {after}
//       </>
//     );
//   };

//   return (
//     <>
//       <div
//         className="relative"
//         style={{
//           minHeight: "100px",
//           border: "1px solid #ccc",
//           borderRadius: "4px",
//           padding: "8px",
//           whiteSpace: "pre-wrap",
//           overflowWrap: "break-word",
//         }}
//       >
//         {renderContent()}
//         <textarea
//           ref={textareaRef}
//           className="absolute inset-0 w-full h-full opacity-0 resize-none"
//           value={content}
//           onChange={(e) => {
//             handleUpdateSubpoint(e.target.value);
//             setSelectionRange(null);
//           }}
//           onSelect={handleTextSelection}
//         />
//       </div>
//       <button onClick={() => console.log(selectionRange)} className="text-xs">
//         Log Selection
//       </button>
//     </>
//   );
// };

// export default CanvaTextArea;

// #################################################################

// Best one yet

// #################################################################

// import type React from "react";
// import { useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store/store";
// import { updateSelectedSubpoint } from "@/store/forms/formSlice";

// interface CanvaTextAreaProps {
//   index: number;
// }

// const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
//   const { selectedForm, selectedPoint } = useSelector(
//     (state: RootState) => state.userForms
//   );

//   const dispatch = useDispatch();

//   const [highlightRange, setHighlightRange] = useState<{
//     start: number;
//     end: number;
//   } | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const content =
//     selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

//   const handleTextSelection = (
//     event: React.SyntheticEvent<HTMLTextAreaElement>
//   ) => {
//     const textarea = event.target as HTMLTextAreaElement;
//     if (textarea.selectionStart !== textarea.selectionEnd) {
//       setHighlightRange({
//         start: textarea.selectionStart,
//         end: textarea.selectionEnd,
//       });
//     }
//   };

//   const handleUpdateSubpoint = (value: string) => {
//     dispatch(updateSelectedSubpoint(value));
//   };

//   const renderContent = () => {
//     if (!highlightRange) return content;

//     const before = content.slice(0, highlightRange.start);
//     const highlighted = content.slice(highlightRange.start, highlightRange.end);
//     const after = content.slice(highlightRange.end);

//     return (
//       <>
//         {before}
//         <span style={{ backgroundColor: "#3367D1", color: "white" }}>
//           {highlighted}
//         </span>
//         {after}
//       </>
//     );
//   };

//   return (
//     <div className="relative" style={{ minHeight: "100px" }}>
//       <div
//         className="absolute inset-0 p-2 whitespace-pre-wrap break-words pointer-events-none"
//         style={{
//           fontFamily: "inherit",
//           fontSize: "inherit",
//           lineHeight: "inherit",
//         }}
//       >
//         {renderContent()}
//       </div>
//       <textarea
//         ref={textareaRef}
//         className="absolute inset-0 w-full h-full resize-none bg-transparent p-2"
//         style={{
//           caretColor: "black",
//           color: "transparent",
//           fontFamily: "inherit",
//           fontSize: "inherit",
//           lineHeight: "inherit",
//         }}
//         value={content}
//         onChange={(e) => {
//           handleUpdateSubpoint(e.target.value);
//           setHighlightRange(null);
//         }}
//         onSelect={handleTextSelection}
//       />
//       <button
//         onClick={() => console.log(highlightRange)}
//         className="absolute bottom-0 left-0 text-xs mt-2"
//       >
//         Log Highlight Range
//       </button>
//     </div>
//   );
// };

// export default CanvaTextArea;

// #################################################################

// First 5 letters, missing textarea shadcn

// #################################################################

// import type React from "react";
// import { useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store/store";
// import { updateSelectedSubpoint } from "@/store/forms/formSlice";

// interface CanvaTextAreaProps {
//   index: number;
// }

// const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
//   const { selectedForm, selectedPoint } = useSelector(
//     (state: RootState) => state.userForms
//   );

//   const dispatch = useDispatch();

//   const [highlightRange, setHighlightRange] = useState<{
//     start: number;
//     end: number;
//   } | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const content =
//     selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

//   const handleTextSelection = useCallback(
//     (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
//       const textarea = event.target as HTMLTextAreaElement;
//       if (textarea.selectionStart !== textarea.selectionEnd) {
//         setHighlightRange({
//           start: textarea.selectionStart,
//           end: textarea.selectionEnd,
//         });
//       } else {
//         setHighlightRange(null);
//       }
//     },
//     []
//   );

//   const handleClick = useCallback(
//     (event: React.MouseEvent<HTMLTextAreaElement>) => {
//       const textarea = event.target as HTMLTextAreaElement;
//       if (textarea.selectionStart === textarea.selectionEnd) {
//         setHighlightRange(null);
//       }
//     },
//     []
//   );

//   const handleUpdateSubpoint = (value: string) => {
//     dispatch(updateSelectedSubpoint(value));
//   };

//   const renderContent = () => {
//     if (!highlightRange) return content;

//     const before = content.slice(0, highlightRange.start);
//     const highlighted = content.slice(highlightRange.start, highlightRange.end);
//     const after = content.slice(highlightRange.end);

//     return (
//       <>
//         {before}
//         <span style={{ backgroundColor: "#3367D1", color: "white" }}>
//           {highlighted}
//         </span>
//         {after}
//       </>
//     );
//   };

//   return (
//     <div className="relative" style={{ minHeight: "100px" }}>
//       <div
//         className="absolute inset-0 p-2 whitespace-pre-wrap break-words pointer-events-none"
//         style={{
//           fontFamily: "inherit",
//           fontSize: "inherit",
//           lineHeight: "inherit",
//         }}
//       >
//         {renderContent()}
//       </div>
//       <textarea
//         ref={textareaRef}
//         className="absolute inset-0 w-full h-full resize-none bg-transparent p-2"
//         style={{
//           caretColor: "black",
//           color: "transparent",
//           fontFamily: "inherit",
//           fontSize: "inherit",
//           lineHeight: "inherit",
//         }}
//         value={content}
//         onChange={(e) => {
//           handleUpdateSubpoint(e.target.value);
//           setHighlightRange(null);
//         }}
//         onSelect={handleTextSelection}
//         onClick={handleClick}
//       />
//       <button
//         onClick={() => console.log(highlightRange)}
//         className="absolute bottom-0 left-0 text-xs mt-2"
//       >
//         Log Highlight Range
//       </button>
//     </div>
//   );
// };

// export default CanvaTextArea;

// #################################################################

// BEST ONE

// #################################################################

// import type React from "react";
// import { useState, useRef, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store/store";
// import { updateSelectedSubpoint } from "@/store/forms/formSlice";

// interface CanvaTextAreaProps {
//   index: number;
// }

// const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
//   const { selectedForm, selectedPoint } = useSelector(
//     (state: RootState) => state.userForms
//   );

//   const dispatch = useDispatch();

//   const [highlightRange, setHighlightRange] = useState<{
//     start: number;
//     end: number;
//   } | null>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const content =
//     selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

//   const handleTextSelection = useCallback(
//     (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
//       const textarea = event.target as HTMLTextAreaElement;
//       if (textarea.selectionStart !== textarea.selectionEnd) {
//         setHighlightRange({
//           start: textarea.selectionStart,
//           end: textarea.selectionEnd,
//         });
//       } else {
//         setHighlightRange(null);
//       }
//     },
//     []
//   );

//   const handleClick = useCallback(() => {
//     setHighlightRange(null);
//   }, []);

//   const handleMouseDown = useCallback(() => {
//     setHighlightRange(null);
//   }, []);

//   const handleUpdateSubpoint = (value: string) => {
//     dispatch(updateSelectedSubpoint(value));
//   };

//   const renderContent = () => {
//     if (!highlightRange) return content;

//     const before = content.slice(0, highlightRange.start);
//     const highlighted = content.slice(highlightRange.start, highlightRange.end);
//     const after = content.slice(highlightRange.end);

//     return (
//       <>
//         {before}
//         <span style={{ backgroundColor: "#3367D1", color: "white" }}>
//           {highlighted}
//         </span>
//         {after}
//       </>
//     );
//   };

//   return (
//     <div className="relative" style={{ height: "100px" }}>
//       <div
//         className="absolute inset-0 p-2 whitespace-pre-wrap break-words pointer-events-none overflow-hidden"
//         style={{
//           fontFamily: "inherit",
//           fontSize: "inherit",
//           lineHeight: "inherit",
//         }}
//       >
//         {renderContent()}
//       </div>
//       <textarea
//         ref={textareaRef}
//         className="absolute inset-0 w-full h-full resize-none bg-transparent p-2 overflow-auto"
//         style={{
//           caretColor: "black",
//           color: "transparent",
//           fontFamily: "inherit",
//           fontSize: "inherit",
//           lineHeight: "inherit",
//         }}
//         value={content}
//         onChange={(e) => {
//           handleUpdateSubpoint(e.target.value);
//           setHighlightRange(null);
//         }}
//         onSelect={handleTextSelection}
//         // onClick={handleClick}
//         onMouseDown={handleMouseDown}
//       />
//     </div>
//   );
// };

// export default CanvaTextArea;
