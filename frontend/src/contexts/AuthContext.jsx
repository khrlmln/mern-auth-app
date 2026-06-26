import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getProfile,
  login as loginApi,
  logout as logoutApi,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // restore session on page load
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const { data } = await getProfile();
          setUser(data.data);
        } catch {
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
    };

    restore();
  }, []);

  // Listen for forced logout events fired by the axios interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      localStorage.removeItem("accessToken");
      setUser(null);
    };
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  // Actions
  const login = useCallback(async (credentials) => {
    const { data } = await loginApi(credentials);
    const { accessToken } = data.data;

    localStorage.setItem("accessToken", accessToken);

    // Fetch the full user profile and store in state
    const profile = await getProfile();
    setUser(profile.data.data);

    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore errors — always clear local state
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  }, []);

  // Re-fetch the user profile (e.g. after profile updates)
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await getProfile();
      setUser(data.data);
    } catch {
      // fail
    }
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
