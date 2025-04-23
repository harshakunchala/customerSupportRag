import React, { useState, useEffect } from "react";

function FileListDisplay({ onFileDeleted, onFileUpdate }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateFile, setUpdateFile] = useState(null);

  // Fetch the list of files from the server
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/files");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setError("Failed to load files. Please try again.");
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file deletion
  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Remove the file from the list
      setFiles(files.filter((file) => file.id !== fileId));

      // Notify parent component
      if (onFileDeleted) {
        onFileDeleted(fileId);
      }
    } catch (err) {
      setError("Failed to delete file. Please try again.");
      console.error("Error deleting file:", err);
    }
  };

  // Handle file download
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/files/${fileId}/download`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create a link element and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to download file. Please try again.");
      console.error("Error downloading file:", err);
    }
  };

  // Handle file update
  const handleUpdateClick = (file) => {
    setUpdateFile(file);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("update-file-upload");
    if (!fileInput.files[0]) {
      setError("Please select a file to update");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      const response = await fetch(
        `http://127.0.0.1:8000/files/${updateFile.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to update file");
      }

      // Refresh the file list
      fetchFiles();

      // Reset update state
      setUpdateFile(null);

      // Notify parent component
      if (onFileUpdate) {
        onFileUpdate();
      }
    } catch (err) {
      setError(err.message || "Failed to update file. Please try again.");
      console.error("Error updating file:", err);
    }
  };

  if (loading && files.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <svg
          className="animate-spin h-8 w-8 mx-auto mb-3 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading files...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border-t border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-3 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 5z"
          />
        </svg>
        <p>No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Uploaded Files
      </h2>

      {updateFile && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">
            Update File: {updateFile.filename}
          </h3>
          <form onSubmit={handleUpdateSubmit} className="space-y-3">
            <div>
              <input
                id="update-file-upload"
                type="file"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setUpdateFile(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="bg-indigo-100 p-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {file.filename}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {new Date(file.uploaded_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateClick(file)}
                className="text-indigo-600 hover:text-indigo-800 p-1"
                title="Update file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDownload(file.id, file.filename)}
                className="text-green-600 hover:text-green-800 p-1"
                title="Download file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Delete file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileListDisplay;
