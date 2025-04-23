import React from "react";

function SearchForm({
  question,
  setQuestion,
  handleSubmit,
  loading,
  uploadSuccess,
}) {
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            uploadSuccess
              ? "Ask about your uploaded document..."
              : "Ask any question about your documents..."
          }
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          disabled={loading}
        />
        {question && !loading && (
          <button
            type="button"
            onClick={() => setQuestion("")}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-1.5 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {uploadSuccess && (
        <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-lg flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>
            Document uploaded successfully! You can now ask questions about it.
          </span>
        </div>
      )}
    </form>
  );
}

export default SearchForm;
