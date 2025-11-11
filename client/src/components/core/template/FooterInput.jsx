import React from "react";

export default function FooterInput() {
  return (
    <div>
      <label className="text-sm font-medium">Footer</label>
      <input
        className="border rounded w-full p-2 mt-1"
        placeholder="Enter footer (optional)"
      />
    </div>
  );
}