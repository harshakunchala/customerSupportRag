import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Navbar/Login";
import SignUp from "./components/Navbar/SignUp";
import FreshChat from "./components/FreshChat/FreshChat";
import SearchForm from "./components/SearchForm";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import AnswerDisplay from "./components/AnswerDisplay";
import SourcesDisplay from "./components/SourcesDisplay";
import FileUpload from "./components/FileUpload";

// Move to .env in production
const GOOGLE_CLIENT_ID =
  "785288485070-j6vbqsa07db3npgfpf79db1gcv3tjnr0.apps.googleusercontent.com";

// Dashboard Component (Main content from your original App)
const Dashboard = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("search"); // "search" or "upload"

  const handleFileUploaded = (data) => {
    setUploadSuccess(true);
    // Reset upload success message after 5 seconds
    setTimeout(() => {
      setUploadSuccess(false);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      // Direct connection to FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err) {
      setError("Failed to get answer. Please try again.");
      console.error("Error fetching answer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center rounded-t-lg shadow-md">
          <h1 className="text-3xl font-bold text-white">
            RAG Knowledge Assistant
          </h1>
          <p className="mt-2 text-indigo-100">
            Ask questions about your documents or add new ones
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white border-b">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "search"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("search")}
          >
            <div className="flex items-center justify-center gap-2">
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Ask Questions</span>
            </div>
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "upload"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            <div className="flex items-center justify-center gap-2">
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Upload Documents</span>
            </div>
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white shadow-md rounded-b-lg overflow-hidden">
          {activeTab === "search" ? (
            <div>
              <SearchForm
                question={question}
                setQuestion={setQuestion}
                handleSubmit={handleSubmit}
                loading={loading}
                uploadSuccess={uploadSuccess}
              />

              {loading && <Loader />}

              {error && <ErrorMessage message={error} />}

              {answer && !loading && <AnswerDisplay answer={answer} />}

              {sources && sources.length > 0 && (
                <SourcesDisplay sources={sources} />
              )}
            </div>
          ) : (
            <FileUpload onFileUploaded={handleFileUploaded} />
          )}
        </div>
      </div>
    </div>
  );
};

// App Content Component with modified Google Auth configuration
const AppContent = () => {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const { googleAuth, user } = useAuth();

  const handleCredentialResponse = async (response) => {
    if (response.credential) {
      try {
        console.log(
          "Google auth credential received:",
          response.credential.substring(0, 20) + "..."
        );
        await googleAuth(response.credential);
      } catch (error) {
        console.error("Google authentication error:", error);
      }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        // No redirect mode for now to simplify auth flow
        auto_select: false, // Don't auto select accounts
        cancel_on_tap_outside: true, // Allow clicking outside to cancel
      });
      setGapiLoaded(true);
      console.log("Google Identity Services script loaded");
    };

    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      {/* FreshChat widget - will be available on all pages */}
      <FreshChat />

      {/* Navigation */}
      <Navbar />

      {/* Routes WITHOUT protection */}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login gapiLoaded={gapiLoaded} />
            )
          }
        />
        <Route path="/login" element={<Login gapiLoaded={gapiLoaded} />} />
        <Route path="/signup" element={<SignUp gapiLoaded={gapiLoaded} />} />

        {/* Dashboard available without protection */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add a route for Google auth callback */}
        <Route
          path="/auth/google/callback"
          element={
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3">Completing authentication...</p>
            </div>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-screen">
              <div className="text-gray-600">
                <h2 className="text-2xl font-bold mb-2">
                  404 - Page Not Found
                </h2>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
