import React from "react";

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="px-6 py-4">
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default ErrorMessage;
