import React from "react";

const types = ["None", "Text", "Image", "Video", "Document"];

export default function BroadcastTitleSelector() {
  return (
    <div>
      <label className="text-sm font-medium">Header Type</label>
      <div className="flex gap-2 mt-2">
        {types.map((item) => (
          <button
            key={item}
            className="border px-3 py-1.5 rounded text-sm hover:bg-gray-100"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}