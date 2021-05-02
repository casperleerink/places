import React, { useState, useEffect, createContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext({
  user: null,
  location: { lat: 49.286403663657964, lng: -123.12585149151704 },
});

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({
    lat: 49.286403663657964,
    lng: -123.12585149151704,
  });

  useEffect(() => {
    let isMounted = true;
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (isMounted) {
        setUser(user);
      }
    });
    fetch("https://extreme-ip-lookup.com/json/")
      .then((res) => res.json())
      .then((response) => {
        if (isMounted) {
          setLocation({
            lat: parseFloat(response.lat),
            lng: parseFloat(response.lon),
          });
        }
      })
      .catch(() => {
        console.error("Ip location lookup request failed");
      });
    return () => (isMounted = false);
  }, []);
  return (
    <UserContext.Provider value={{ user, location }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
