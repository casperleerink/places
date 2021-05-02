import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "./UserContext";
import ItemForm from "./ItemForm";
import { geohashForLocation } from "geofire-common";
import { generateDocument } from "../hooks/firebase";
import { newItemValidation } from "../hooks/validation";
import { GeoPoint, Timestamp } from "firebase/firestore";
function HandleItemForm({ item, onSuccess }) {
  const [values, setValues] = useState({
    title: item ? item.data.title : "",
    photo: item ? item.data.photo : "",
    photoUrl: item ? item.data.photoUrl : "",
    thumb: item ? item.data.thumb : "",
    thumbUrl: item ? item.data.thumbUrl : "",
    description: item ? item.data.description : "",
    location: item
      ? { lat: item.data.location.latitude, lng: item.data.location.longitude }
      : null,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const formRef = useRef(null);
  useEffect(() => {
    if (item) {
      const {
        title,
        photoName,
        photoUrl,
        thumb,
        thumbUrl,
        description,
        location,
      } = item.data;
      setValues({
        title,
        photo: photoName,
        photoUrl,
        thumb,
        thumbUrl,
        description,
        location: { lat: location.latitude, lng: location.longitude },
      });
    }
  }, [item]);

  //update values functions:
  const handleChange = (data) => {
    setValues((old) => {
      return { ...old, ...data };
    });
  };
  //submit new item
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = newItemValidation(values);
    if (result !== "passed") {
      //didn't pass validation
      setError(result);
      formRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const data = {
      userId: user.uid,
      uploadDate: Timestamp.now(),
      title: values.title,
      photoName: values.photo,
      photoUrl: values.photoUrl,
      thumbUrl: values.thumbUrl,
      location: new GeoPoint(values.location.lat, values.location.lng),
      geohash: geohashForLocation([values.location.lat, values.location.lng]),
      description: values.description ? values.description : null,
    };
    if (item) {
      generateDocument("items", item.id, data).then((id) => {
        error && setError("");
        setSuccess("Item updated successfully!");
        formRef.current.scrollIntoView({ behavior: "smooth" });
        onSuccess();
      });
    } else {
      generateDocument("items", null, data)
        .then((id) => {
          error && setError(""); //remove error
          setValues({
            title: "",
            photo: "",
            photoUrl: "",
            thumb: "",
            thumbUrl: "",
            description: "",
            location: null,
          });
          setSuccess("Item added successfully!");
          formRef.current.scrollIntoView({ behavior: "smooth" });
          onSuccess();
        })
        .catch((e) => {
          setError(`Error creating new item: ${e.code}`);
          formRef.current.scrollIntoView({ behavior: "smooth" });
        });
    }
  };
  return (
    <div ref={formRef}>
      <h1 style={{ letterSpacing: "0.1rem", fontSize: "3rem" }}>
        {item ? "Edit Item" : "Create New Item"}
      </h1>
      <ItemForm
        onSubmit={handleSubmit}
        onChange={handleChange}
        values={values}
        error={error}
        success={success}
        center={
          item
            ? {
                lat: item.data.location.latitude,
                lng: item.data.location.longitude,
              }
            : null
        }
      />
    </div>
  );
}

export default HandleItemForm;
