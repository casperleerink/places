import React, { useState, useEffect, createContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext({ user: null });

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export default UserProvider;
