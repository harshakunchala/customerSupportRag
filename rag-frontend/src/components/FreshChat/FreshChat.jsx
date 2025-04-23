import React, { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

const FreshChat = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Create the script element
    const script = document.createElement("script");
    script.id = "freshworks-chat";
    script.src = "//in.fw-cdn.com/32346095/1274813.js"; // Updated to your new script
    script.async = true;
    script.setAttribute("chat", "true");

    // Append the script to the document
    document.body.appendChild(script);

    // Initialize user data when the widget is loaded
    const initializeUserData = () => {
      if (!window.fcWidget) return;

      try {
        if (user) {
          window.fcWidget.setExternalId(user.email || user._id);
          window.fcWidget.user.setFirstName(user.name || "User");
          window.fcWidget.user.setEmail(user.email || "");
          window.fcWidget.user.setProperties({
            userId: user._id || "",
            accountType: user.accountType || "standard",
          });
        }
      } catch (error) {
        console.error("Error initializing FreshWorks user data:", error);
      }
    };

    // Check if widget is loaded periodically
    const checkWidgetLoaded = () => {
      const initInterval = setInterval(() => {
        if (window.fcWidget) {
          clearInterval(initInterval);
          initializeUserData();
        }
      }, 100);

      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(initInterval);
      }, 10000);
    };

    checkWidgetLoaded();

    // Cleanup function
    return () => {
      if (window.FreshworksWidget) {
        window.FreshworksWidget("destroy");
      }
      // Remove the script
      const freshworksScript = document.getElementById("freshworks-chat");
      if (freshworksScript) {
        document.body.removeChild(freshworksScript);
      }
    };
  }, [user]); // Re-initialize when user changes

  return null; // This component doesn't render anything
};

export default FreshChat;
