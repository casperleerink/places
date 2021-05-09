import React, { useContext, useEffect, useState, useRef } from "react";
import { AiOutlineLogout, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { UserContext } from "./UserContext";
import { logOut, getDocument, verificationEmail } from "../hooks/firebase";
import style from "../styles/AccountMenu.module.scss";
// import { useTransition, animated as a, config } from "react-spring";
import UserItemsList from "./UserItemsList";
import HandleItemForm from "./HandleItemForm";
import { confirmAlert } from "react-confirm-alert";
function AccountMenu() {
  const [userInfo, setUserInfo] = useState({});
  const [newItemExpanded, setNewItemExpanded] = useState(false);
  const [modifyItem, setModifyItem] = useState(null);
  const { user } = useContext(UserContext);
  const modifyItemRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      //check for verification
      if (!user.emailVerified) {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className={style["confirm-container"]}>
                <h1>Please verify your email!</h1>
                <p>A verification email has been send to {user.email}</p>
                <button
                  onClick={() => {
                    verificationEmail(user);
                  }}
                >
                  Send another email
                </button>
                <button onClick={onClose}>Close</button>
              </div>
            );
          },
        });
        // setShowUserNeedsVerification(true);
        return;
      }
      getDocument("users", user.uid).then((userDoc) => {
        if (isMounted) {
          setUserInfo(userDoc);
        }
      });
    }
    return () => (isMounted = false);
  }, [user]);
  const handleLogOut = () => {
    logOut();
  };
  const handleItemEdit = (item) => {
    setModifyItem(item);
    modifyItemRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className={style.container}>
      <h1 className={style.hello}>
        {userInfo.username ? `Hi ${userInfo.username}` : `Hi!`}
      </h1>
      <nav className={style.heading}>
        <button
          className={`${style.button} ${style.accent}`}
          onClick={() => setNewItemExpanded(!newItemExpanded)}
        >
          {newItemExpanded ? <AiOutlineMinus /> : <AiOutlinePlus />}
          New Item
        </button>
        <button onClick={handleLogOut} className={style.button}>
          <AiOutlineLogout /> Logout
        </button>
      </nav>
      <div className={style["new-item"]}>
        {newItemExpanded && (
          <HandleItemForm
            onSuccess={() => setNewItemExpanded(!newItemExpanded)}
          />
        )}
      </div>
      <div ref={modifyItemRef}>
        {modifyItem && (
          <HandleItemForm
            item={modifyItem}
            onSuccess={() => setModifyItem(!modifyItem)}
          />
        )}
      </div>
      <UserItemsList onEdit={handleItemEdit} />
    </div>
  );
}

export default AccountMenu;
