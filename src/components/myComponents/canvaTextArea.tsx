"use client";

// #################################################################

// OldShool component

// #################################################################

import React, { useState } from "react";

import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";

interface CanvaTextAreaProps {
  index: number;
}

const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
  const { selectedForm, selectedPoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedText, setSelectedText] = useState<string>("");

  const handleTextSelection = (
    event: React.SyntheticEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.target as HTMLTextAreaElement;
    const selected = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    setSelectedText(selected);
  };

  const handleUpdateSubpoint = (value: string) => {
    dispatch(updateSelectedSubpoint(value));
  };

  return (
    <>
      <Textarea
        variant="default"
        value={
          selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content ||
          ""
        }
        onChange={(e) => {
          handleUpdateSubpoint(e.target.value);
        }}
        onSelect={handleTextSelection} // Add onSelect event
      />
    </>
  );
};

export default CanvaTextArea;

// #################################################################

// ChatGpt variant

// #################################################################

// import React, { useState } from "react";
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
//   const [text, setText] = useState(
//     selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || ""
//   );
//   const [highlightedText, setHighlightedText] = useState<string[]>([]);

//   const handleTextSelection = (
//     event: React.SyntheticEvent<HTMLTextAreaElement>
//   ) => {
//     const textarea = event.target as HTMLTextAreaElement;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selected = textarea.value.substring(start, end);

//     if (selected.trim()) {
//       setHighlightedText((prev) => [...prev, selected]); // Store highlighted sections
//     }
//   };

//   const applyHighlighting = (content: string) => {
//     if (!highlightedText.length) return content;

//     let highlightedContent = content;
//     highlightedText.forEach((text) => {
//       const regex = new RegExp(`(${text})`, "gi");
//       highlightedContent = highlightedContent.replace(
//         regex,
//         `<mark style="background-color: yellow;">$1</mark>`
//       );
//     });

//     return highlightedContent;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);
//     dispatch(updateSelectedSubpoint(e.target.value));
//   };

//   return (
//     <div style={{ position: "relative", width: "100%" }}>
//       {/* Hidden content for highlight effect */}
//       <div
//         dangerouslySetInnerHTML={{ __html: applyHighlighting(text) }}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           padding: "8px",
//           whiteSpace: "pre-wrap",
//           overflowWrap: "break-word",
//           pointerEvents: "none",
//           color: "transparent",
//           backgroundColor: "white",
//         }}
//       ></div>

//       {/* Actual textarea */}
//       <Textarea
//         variant="default"
//         value={text}
//         onChange={handleChange}
//         onSelect={handleTextSelection}
//         style={{
//           backgroundColor: "transparent",
//           position: "relative",
//           zIndex: 1,
//           color: "black",
//         }}
//       />
//     </div>
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

// Another version of component

// #################################################################

// import type React from "react"
// import { useState, useRef } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import type { RootState } from "@/store/store"
// import { updateSelectedSubpoint } from "@/store/forms/formSlice"

// interface CanvaTextAreaProps {
//   index: number
// }

// const CanvaTextArea: React.FC<CanvaTextAreaProps> = ({ index }) => {
//   const { selectedForm, selectedPoint } = useSelector((state: RootState) => state.userForms)

//   const dispatch = useDispatch()

//   const [highlightRange, setHighlightRange] = useState<{ start: number; end: number } | null>(null)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   const content = selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || ""

//   const handleTextSelection = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
//     const textarea = event.target as HTMLTextAreaElement
//     if (textarea.selectionStart !== textarea.selectionEnd) {
//       setHighlightRange({
//         start: textarea.selectionStart,
//         end: textarea.selectionEnd,
//       })
//     }
//   }

//   const handleUpdateSubpoint = (value: string) => {
//     dispatch(updateSelectedSubpoint(value))
//   }

//   const renderContent = () => {
//     if (!highlightRange) return content

//     const before = content.slice(0, highlightRange.start)
//     const highlighted = content.slice(highlightRange.start, highlightRange.end)
//     const after = content.slice(highlightRange.end)

//     return (
//       <>
//         {before}
//         <span style={{ backgroundColor: "blue", color: "white" }}>{highlighted}</span>
//         {after}
//       </>
//     )
//   }

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
//           handleUpdateSubpoint(e.target.value)
//           setHighlightRange(null)
//         }}
//         onSelect={handleTextSelection}
//       />
//       <button onClick={() => console.log(highlightRange)} className="absolute bottom-0 left-0 text-xs mt-2">
//         Log Highlight Range
//       </button>
//     </div>
//   )
// }

// export default CanvaTextArea

// #################################################################

// First 5 letters, missing textarea shadcn

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

//   const [selectedText, setSelectedText] = useState<string>("");
//   const [cursorPosition, setCursorPosition] = useState<number>(0);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const content =
//     selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

//   const handleTextSelection = (
//     event: React.SyntheticEvent<HTMLTextAreaElement>
//   ) => {
//     const textarea = event.target as HTMLTextAreaElement;
//     const selected = textarea.value.substring(
//       textarea.selectionStart,
//       textarea.selectionEnd
//     );
//     setSelectedText(selected);
//     setCursorPosition(textarea.selectionStart);
//   };

//   const handleUpdateSubpoint = (value: string) => {
//     dispatch(updateSelectedSubpoint(value));
//   };

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
//     }
//   }, [cursorPosition]);

//   const renderContent = () => {
//     const parts = content.split(/\b(proposal)\b/i);
//     return parts.map((part, index) =>
//       part.toLowerCase() === "proposal" ? (
//         <span key={index} style={{ backgroundColor: "blue", color: "white" }}>
//           {part}
//         </span>
//       ) : (
//         <span key={index}>{part}</span>
//       )
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
//             setCursorPosition(e.target.selectionStart);
//           }}
//           onSelect={handleTextSelection}
//         />
//       </div>
//       <button onClick={() => console.log(selectedText)} className="text-xs">
//         aaaaaaa
//       </button>
//     </>
//   );
// };

// export default CanvaTextArea;
