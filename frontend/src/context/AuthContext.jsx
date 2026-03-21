import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. When the app starts, check if there is a saved user in Local Storage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Whenever the 'user' changes (like when they log in or log out), update Local Storage
  useEffect(() => {
    if (user) {
      // Save user to Local Storage on login
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // Remove user from Local Storage on logout
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};