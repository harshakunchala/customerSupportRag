import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

const Login = ({ gapiLoaded }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { googleAuth } = useAuth();

  useEffect(() => {
    if (gapiLoaded && window.google) {
      // Render the Google Sign In button
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          type: "standard",
          shape: "rectangular",
          text: "signin_with",
          logo_alignment: "left",
        }
      );

      // Initialize One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log(
            "One Tap dialog not displayed:",
            notification.getNotDisplayedReason()
          );
        } else if (notification.isSkippedMoment()) {
          console.log(
            "One Tap dialog skipped:",
            notification.getSkippedReason()
          );
        }
      });
    }
  }, [gapiLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="w-full flex justify-center py-2">
              <div className="text-blue-600">Signing in...</div>
            </div>
          ) : (
            <div
              id="google-signin-button"
              className="w-full flex justify-center"
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
