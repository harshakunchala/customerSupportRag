import React, { useState } from "react";

function SourceItem({ source, index }) {
  const [isOpen, setIsOpen] = useState(false);

  // Handle different source data structures
  const sourceName = source.document || source.name || `Source ${index + 1}`;
  const sourceContent = source.text || source.content || "No content available";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-800">{sourceName}</span>
        <button className="text-gray-500">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </button>
      </div>
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200 text-gray-600 text-sm whitespace-pre-wrap">
          {sourceContent}
        </div>
      )}
    </div>
  );
}

export default SourceItem;
