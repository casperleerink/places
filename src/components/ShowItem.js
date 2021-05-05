import React, { useState, useEffect } from "react";
import style from "../styles/ShowItem.module.scss";
import { IoClose } from "react-icons/io5";
import { getDocument } from "../hooks/firebase";
import ShowUserItems from "./ShowUserItems";

function ShowItem({ data, onClose }) {
  const [owner, setOwner] = useState(null);
  const [showUser, setShowUser] = useState(null);
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
      {showUser ? (
        <ShowUserItems user={showUser} onClose={() => setShowUser(null)} />
      ) : (
        <div className={style["show-data"]}>
          <h1>{data.title}</h1>
          <p className={style.owner}>
            {owner ? (
              <em>
                From:{" "}
                <button onClick={() => setShowUser(owner)}>
                  {owner.username}
                </button>
              </em>
            ) : (
              ""
            )}
          </p>
          <img src={data.photoUrl} alt={data.title} />
          {data.description && <p className={style.desc}>{data.description}</p>}
        </div>
      )}
    </div>
  );
}

export default ShowItem;
