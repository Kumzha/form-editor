"use client";

import { useRef, useState } from "react";
import { CanvaDiv, type CanvaDivRef } from "@/components/myComponents/canvaDiv";

export default function Home() {
  // Sample data array to map over
  const [items, setItems] = useState([
    {
      id: "item-1",
      content:
        "This is the first editable div. Try selecting some text to see the popup!",
      variant: "default" as const,
    },
    {
      id: "item-2",
      content:
        "This is the second editable div with newForm styling. Try selecting some text!",
      variant: "newForm" as const,
    },
    {
      id: "item-3",
      content:
        "This is the third editable div with secondary styling. Select some text here too!",
      variant: "secondary" as const,
    },
    {
      id: "item-4",
      content:
        "This is a fourth editable div. You can add as many as you need!",
      variant: "default" as const,
    },
  ]);

  // Create a ref object to store multiple refs
  const divsRef = useRef<Map<string, CanvaDivRef>>(new Map());

  // Function to set a ref for a specific item
  const setDivRef = (id: string, ref: CanvaDivRef | null) => {
    if (ref) {
      divsRef.current.set(id, ref);
    } else {
      divsRef.current.delete(id);
    }
  };

  // Log values from all divs
  const logAllValues = () => {
    divsRef.current.forEach((ref, id) => {
      console.log(`Item ${id} value:`, ref.getValue());
    });
  };

  // Reset all divs to their original content
  const resetAllValues = () => {
    items.forEach((item) => {
      const ref = divsRef.current.get(item.id);
      if (ref) {
        ref.setValue(item.content);
      }
    });
  };

  // Add a new item
  const addItem = () => {
    const newItem = {
      id: `item-${items.length + 1}`,
      content: `This is a new editable div #${items.length + 1}. Try it out!`,
      variant: "default" as const,
    };
    setItems([...items, newItem]);
  };

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Mapped Editable Divs</h1>

      <div className="space-y-6">
        {items.map((item, key) => (
          <div key={key} className="space-y-2">
            <h2 className="text-xl">Item {item.id}</h2>
            <CanvaDiv
              index={key}
              ref={(ref) => setDivRef(item.id, ref)}
              variant={item.variant}
              defaultValue={item.content}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={logAllValues}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Log All Values
        </button>
        <button
          onClick={resetAllValues}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset All Values
        </button>
        <button
          onClick={addItem}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Item
        </button>
      </div>
    </main>
  );
}
