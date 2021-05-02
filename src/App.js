import React, { useState } from "react";
import style from "./styles/App.module.scss";
import UserProvider from "./components/UserContext";
import UserCheck from "./components/UserCheck";
import { IoMenu } from "react-icons/io5";
import { useTransition, animated as a } from "react-spring";
import Main from "./components/Main";
function App() {
  const [accountExpanded, setAccountExpanded] = useState(false);

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
