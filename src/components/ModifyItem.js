import React, { useState, useRef, useContext } from "react";
import { UserContext } from "./UserContext";
import ItemForm from "./ItemForm";
import { geohashForLocation } from "geofire-common";
import { generateDocument } from "../hooks/firebase";
import { newItemValidation } from "../hooks/validation";
import { GeoPoint, Timestamp } from "firebase/firestore";

function ModifyItem() {
  const [values, setValues] = useState({
    title: "",
    photo: "",
    photoUrl: "",
    thumb: "",
    thumbUrl: "",
    description: "",
    location: null,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const formRef = useRef(null);
  return <div></div>;
}

export default ModifyItem;
