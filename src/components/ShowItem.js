import React, { useState, useEffect } from "react";
import style from "../styles/ShowItem.module.scss";
import { IoClose } from "react-icons/io5";
import { getDocument } from "../hooks/firebase";

function ShowItem({ data, onClose }) {
  const [owner, setOwner] = useState(null);
  useEffect(() => {
    getDocument("users", data.userId)
      .then((doc) => {
        if (doc) {
          setOwner(doc);
        }
      })
      .catch((e) => {
        //just dont display username
        console.log(e);
      });
  }, [data.userId]);
  return (
    <div className={style.container}>
      <button className={style.close} onClick={onClose}>
        <IoClose />
      </button>
      <div className={style["show-data"]}>
        <h1>{data.title}</h1>
        <p className={style.owner}>
          <em>{owner ? `From: ${owner.username}` : "From:"}</em>
        </p>
        <img src={data.photoUrl} alt={data.title} />
        {data.description && <p className={style.desc}>{data.description}</p>}
      </div>
    </div>
  );
}

export default ShowItem;
