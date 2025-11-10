// // src/context/UserContext.jsx
// import React, { createContext, useEffect, useState } from "react";
// import users from "../assets/data/userDetails";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('userData');
//     if (storedUser) {
//       setCurrentUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (email, password) => {
//     const user = users.find(u => u.email === email && u.password === password);
//     if (user) {
//       setCurrentUser(user);
//       localStorage.setItem('userData', JSON.stringify(user));
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     localStorage.removeItem('userData');
//   };

//   return (
//     <UserContext.Provider value={{ currentUser, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
// src/context/UserContext.jsx
import React, { createContext, useEffect, useState } from "react";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      
      // Check if this is old format (has .user property) and migrate
      if (parsed.user && parsed.message && parsed.token) {
        setCurrentUser(parsed.user);
        localStorage.setItem('userData', JSON.stringify(parsed.user));
      } else {
        setCurrentUser(parsed);
      }
    }
  }, []);

  // Accepts user object from backend response
  const setUserFromBackend = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('userData', JSON.stringify(userObj));
  };

  const registerUser = (userData) => {
    // Add new user to the users array (in a real app, this would be saved to backend)
    const newUser = {
      ...userData,
      id: Date.now(),
      donationCount: userData.role === 'donor' ? 0 : undefined,
      lastDonation: userData.role === 'donor' ? 'N/A' : undefined,
      hospitalAffiliation: userData.role === 'doctor' ? userData.hospitalAffiliation : undefined,
      licenseNumber: userData.role === 'doctor' ? userData.licenseNumber : undefined,
      specialization: userData.role === 'doctor' ? userData.specialization : undefined
    };
    
    // Store in localStorage for persistence (in a real app, send to backend)
    const existingUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    existingUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(existingUsers));
    
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userData');
  };

  const contextValue = React.useMemo(() => ({
    currentUser,
    setUserFromBackend,
    logout,
    registerUser
  }), [currentUser]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};