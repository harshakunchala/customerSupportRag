import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});
const API_BASE_URL = "https://googlereviewvercel.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor to include token in all requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Auth check error:", error);
      // Only remove token if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Signup error:", error);
      // Add more specific error handling here
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      // Add more specific error handling here
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const googleAuth = async (token) => {
    try {
      console.log("Sending Google token to backend:", token);
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        token,
      });
      const { token: authToken, user: userData } = response.data;
      localStorage.setItem("token", authToken);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Google auth error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Optionally call logout endpoint if your API has one
      // await axios.post(`${API_BASE_URL}/auth/logout`);
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still remove token and user even if logout API call fails
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/profile`,
        userData
      );
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Function to refresh auth state
  const refreshAuthState = async () => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      await logout();
      return false;
    }
    if (token && !user) {
      await checkAuth();
    }
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        googleAuth,
        logout,
        checkAuth,
        updateUserProfile,
        refreshAuthState,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to set up axios defaults
export const setupAxiosDefaults = () => {
  axios.defaults.baseURL = API_BASE_URL;

  // Add response interceptor for handling 401 errors globally
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

export default AuthContext;
