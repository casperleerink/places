import React, { useState, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import style from "../styles/UserItemsList.module.scss";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import useOutsideDetect from "../hooks/useOutsideDetect";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
function UserItem({ data, id, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef(null);
  useOutsideDetect(ref, () => setShowMenu(false));

  const handleDelete = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className={style["confirm-container"]}>
            <h1>Are you sure?</h1>
            <p>You want to delete this item?</p>
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              Delete
            </button>
          </div>
        );
      },
    });
  };
  return (
    <li
      ref={ref}
      className={style["user-item"]}
      style={{ backgroundImage: `url(${data.photoUrl})` }}
    >
      <h1>{data.title}</h1>
      <div className={style["item-menu"]}>
        <BsThreeDots onClick={() => setShowMenu(!showMenu)} />
        {showMenu && (
          <ul className={style.menu}>
            <li
              onClick={() => {
                setShowMenu(false);
                onEdit({ data, id });
              }}
            >
              <AiOutlineEdit /> Edit
            </li>
            <li onClick={handleDelete}>
              <AiOutlineDelete /> Delete
            </li>
          </ul>
        )}
      </div>
    </li>
  );
}

export default UserItem;
