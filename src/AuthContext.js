import React, { createContext, useState } from "react";

// ✅ Create Auth Context
export const AuthContext = createContext();

// ✅ AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Logged in user object
  const [enrolledCourses, setEnrolledCourses] = useState([]); // List of courses user enrolled in

  // Login function
  const login = (userData) => {
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setEnrolledCourses([]); // clear enrolled courses on logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        enrolledCourses,
        setEnrolledCourses,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
