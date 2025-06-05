import { createContext, useContext, useEffect, useState } from "react";

// 1. Tạo context
const AuthContext = createContext();

// 2. Custom hook
export const useAuth = () => useContext(AuthContext);

// 3. Provider component
export const AuthProvider = ({ children }) => {
  const [page, setPage] = useState("Home page");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    console.log("stored: ", stored);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        console.error("Invalid user data:", e);
      }
    }
    setLoading(false);
  }, []);
  if (loading) return null;
  const value = {
    page,
    setPage,
    user,
    setUser,
    advancedFeaturesEnabled,
    setAdvancedFeaturesEnabled,
  };
  // console.log("user value: ", user);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
