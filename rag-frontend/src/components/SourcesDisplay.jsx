import React from "react";
import SourceItem from "./SourceItem";

function SourcesDisplay({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="px-6 py-4 border-t border-gray-100">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-indigo-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span>Sources ({sources.length})</span>
      </h2>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <SourceItem key={index} source={source} index={index} />
        ))}
      </div>
    </div>
  );
}

export default SourcesDisplay;
