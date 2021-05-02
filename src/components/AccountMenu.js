import React, { useContext, useEffect, useState, useRef } from "react";
import { AiOutlineLogout, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { UserContext } from "./UserContext";
import { logOut, getDocument } from "../hooks/firebase";
import style from "../styles/AccountMenu.module.scss";
// import { useTransition, animated as a, config } from "react-spring";
import UserItemsList from "./UserItemsList";
import HandleItemForm from "./HandleItemForm";
function AccountMenu() {
  const [userInfo, setUserInfo] = useState({});
  const [newItemExpanded, setNewItemExpanded] = useState(false);
  const [modifyItem, setModifyItem] = useState(null);
  const { user } = useContext(UserContext);
  const modifyItemRef = useRef(null);

  useEffect(() => {
    getDocument("users", user.uid).then((userDoc) => {
      setUserInfo(userDoc);
    });
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
