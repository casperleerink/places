import React, { useState, useEffect, useContext } from "react";
import { query, collection, where, doc, deleteDoc } from "firebase/firestore";
import { db, getDocuments } from "../hooks/firebase";
import { UserContext } from "./UserContext";
import style from "../styles/UserItemsList.module.scss";
import UserItem from "./UserItem";
function UserItemsList({ onEdit }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  useEffect(() => {
    getUserDocuments(user);
  }, [user]);

  const getUserDocuments = (user) => {
    if (user) {
      const q = query(collection(db, "items"), where("userId", "==", user.uid));

      getDocuments(q)
        .then((results) => {
          setItems(results);
        })
        .catch((e) => {
          setError(`Failed to get items: ${e.code}`);
        });
    }
  };

  const handleDelete = async (id) => {
    //delete item and preferably re-read the documents
    console.log(id);
    const docRef = doc(db, "items", id);
    await deleteDoc(docRef);
    getUserDocuments(user);
  };
  const Items = items.map((item) => {
    const { data, id } = item;
    return (
      <UserItem
        key={id}
        data={data}
        id={id}
        onEdit={onEdit}
        onDelete={handleDelete}
      />
    );
  });

  return (
    <div className={style.container}>
      {error && <div className={style.error}>{error}</div>}
      <ul className={style.ul}>{Items}</ul>
    </div>
  );
}

export default UserItemsList;
