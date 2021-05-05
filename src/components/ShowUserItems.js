import React, { useEffect, useState, useRef } from "react";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { db } from "../hooks/firebase";
import style from "../styles/ShowUserItem.module.scss";
import { IoArrowBack } from "react-icons/io5";

function ShowUserItems({ user, onClose }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [big, setBig] = useState("");
  const bigRef = useRef(null);
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "items"), where("userId", "==", user.id));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        try {
          const currentDocs = [];
          querySnapshot.forEach((doc) => {
            currentDocs.push({ data: doc.data(), id: doc.id });
          });
          setItems(currentDocs);
        } catch (e) {
          setError(`Something went wrong trying to get your items: ${e}`);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const Items = () =>
    items.map((item) => {
      const { data, id } = item;
      return (
        <li
          key={id}
          onClick={() => {
            setBig(item);
            bigRef.current &&
              bigRef.current.scrollIntoView({ behavior: "smooth" });
          }}
          style={{ backgroundImage: `url(${data.photoUrl})` }}
        >
          <h2>{data.title}</h2>
        </li>
      );
    });
  return (
    <div className={style.container}>
      <h1 className={style.heading}>
        <IoArrowBack onClick={() => onClose()} /> {user.username}'s Photos
      </h1>
      {error && <p>{error}</p>}
      {big && (
        <div ref={bigRef} className={style.big}>
          <h1>{big.data.title}</h1>
          <img src={big.data.photoUrl} alt={big.data.title} />
          {big.data.description && <p>{big.data.description}</p>}
        </div>
      )}
      <ul className={style["items-container"]}>
        <Items />
      </ul>
    </div>
  );
}

export default ShowUserItems;
