import React, { useContext, useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { UserContext } from "./UserContext";
import { logOut, getDocument } from "../hooks/firebase";
import NewItemForm from "./NewItemForm";
import style from "../styles/AccountMenu.module.scss";
import { useTransition, animated as a, config } from "react-spring";
function AccountMenu() {
  const [userInfo, setUserInfo] = useState({});
  const [newItemExpanded, setNewItemExpanded] = useState(false);
  const [photoListExpanded, setPhotoListExpanded] = useState(false);
  const user = useContext(UserContext);

  const transitions = useTransition(newItemExpanded, {
    from: { maxHeight: 0 },
    enter: { maxHeight: 800 },
    leave: { maxHeight: 0 },
    config: config.slow,
  });
  useEffect(() => {
    getDocument("users", user.uid).then((userDoc) => {
      setUserInfo(userDoc);
    });
  }, [user]);
  const handleLogOut = () => {
    logOut();
  };
  return (
    <div className={style.container}>
      <nav className={style.heading}>
        {userInfo.username ? <h1>{`Hi ${userInfo.username}`}</h1> : ""}
        <button onClick={handleLogOut} className={style.button}>
          Logout
        </button>
      </nav>
      <div className={style["new-item"]}>
        <button
          onClick={() => setNewItemExpanded(!newItemExpanded)}
          className={style["expand-button"]}
        >
          <p>Upload New Photo</p>
          {newItemExpanded ? <AiOutlineUp /> : <AiOutlineDown />}
        </button>
        {transitions((styles, item) => {
          return (
            item && (
              <a.div style={styles} className={style["animated-div"]}>
                <NewItemForm className={style.form} />
              </a.div>
            )
          );
        })}
      </div>
      <div className={style["photo-list"]}>
        <button
          onClick={() => setPhotoListExpanded(!photoListExpanded)}
          className={style["expand-button"]}
        >
          <p>Photos</p>
          {photoListExpanded ? <AiOutlineUp /> : <AiOutlineDown />}
        </button>
      </div>
    </div>
  );
}

export default AccountMenu;
