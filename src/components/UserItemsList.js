import React, { useState, useEffect, useContext } from "react";
import {
  query,
  collection,
  where,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../hooks/firebase";
import { UserContext } from "./UserContext";
import style from "../styles/UserItemsList.module.scss";
import UserItem from "./UserItem";
import ShowItem from "./ShowItem";
function UserItemsList({ onEdit }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [showFullItem, setShowFullItem] = useState(null);
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "items"), where("userId", "==", user.uid));
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

  const handleDelete = async (id) => {
    const docRef = doc(db, "items", id);
    await deleteDoc(docRef);
  };
  const handleShow = (data) => {
    setShowFullItem(data);
    //TODO show item;
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
        onShow={handleShow}
      />
    );
  });

  return (
    <div className={style.container}>
      {error && <div className={style.error}>{error}</div>}
      {showFullItem && (
        <div>
          <ShowItem data={showFullItem} onClose={() => setShowFullItem(null)} />
        </div>
      )}
      <ul className={style.ul}>{Items}</ul>
    </div>
  );
}

export default UserItemsList;
