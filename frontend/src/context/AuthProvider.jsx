import { createContext, useContext, useEffect, useState } from "react";

/* 
   CREATE CONTEXT
 */

const AuthContext = createContext();

/* 
   PROVIDER
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user")),
  );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/* 
   CUSTOM HOOK
 */

export const useAuthContext = () => {
  return useContext(AuthContext);
};
