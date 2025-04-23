import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

const SignUp = ({ gapiLoaded }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { googleAuth } = useAuth();

  useEffect(() => {
    if (gapiLoaded && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          type: "standard",
          shape: "rectangular",
          text: "signup_with",
          logo_alignment: "left",
        }
      );
    }
  }, [gapiLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
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
              <div className="text-blue-600">Creating account...</div>
            </div>
          ) : (
            <div
              id="google-signin-button"
              className="w-full flex justify-center"
            ></div>
          )}

          <p className="mt-6 text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
