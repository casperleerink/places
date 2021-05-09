import React, { useState, useEffect } from "react";
import style from "./styles/App.module.scss";
import UserProvider from "./components/UserContext";
import UserCheck from "./components/UserCheck";
import { IoMenu } from "react-icons/io5";
import { useTransition, animated as a } from "react-spring";
import Main from "./components/Main";
import { storageAvailable } from "./hooks/localstorage";
import { confirmAlert } from "react-confirm-alert";
function App() {
  const [accountExpanded, setAccountExpanded] = useState(false);

  //show message on first visit
  useEffect(() => {
    if (storageAvailable("localStorage")) {
      if (!localStorage.getItem("visited")) {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className={style["confirm-container"]}>
                <h1>Welcome to Places!</h1>
                <p>
                  Here you can find photos of the beauty all around us. Everyone
                  can upload their own photo if they want to share something
                  beautiful or unexpected that belongs to that place.
                </p>
                <button
                  onClick={() => {
                    localStorage.setItem("visited", true);
                    onClose();
                  }}
                >
                  Proceed to site
                </button>
              </div>
            );
          },
        });
      }
    }
  }, []);

  const transitions = useTransition(accountExpanded, {
    from: { opacity: 0, transform: "translateX(100%)" },
    enter: { opacity: 1, transform: "translateX(0)" },
    leave: { opacity: 0, transform: "translateX(100%)" },
  });
  return (
    <UserProvider>
      <div className={style.app}>
        <IoMenu
          className={`${style.burger} ${
            accountExpanded ? style["primary-color"] : ""
          }`}
          onClick={() => setAccountExpanded(!accountExpanded)}
        />
        {transitions((styles, item) => {
          return (
            item && (
              <a.div style={styles} className={style["account-container"]}>
                <UserCheck />
              </a.div>
            )
          );
        })}
        <Main />
      </div>
    </UserProvider>
  );
}

export default App;
