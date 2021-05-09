import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "./UserContext";
import ItemForm from "./ItemForm";
import { geohashForLocation } from "geofire-common";
import { Spinner } from "react-bootstrap";
import { generateDocument, db } from "../hooks/firebase";
import { newItemValidation } from "../hooks/validation";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import Resizer from "react-image-file-resizer";
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

//helper function
const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(file, 30, 30, "PNG", 100, 0, (uri) => {
      resolve(uri);
    });
  });

//main component
function HandleItemForm({ item, onSuccess }) {
  const { data, id } = item ? item : { data: null, id: null };
  const [values, setValues] = useState({
    title: data ? data.title : "",
    photo: data ? data.photo : "",
    photoUrl: data ? data.photoUrl : "",
    photoFile: null,
    description: data ? data.description : "",
    location: data ? data.location : null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const { user } = useContext(UserContext);
  const formRef = useRef(null);
  useEffect(() => {
    if (data) {
      const { title, photo, photoUrl, description, location } = data;
      setValues({
        title,
        photo,
        photoUrl,
        description,
        location,
      });
    }
  }, [data]);

  //update values functions:
  const handleChange = (data) => {
    setValues((old) => {
      return { ...old, ...data };
    });
  };
  //submit new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && !user.emailVerified) {
      setError(
        "Uh oh.. it seems like you first need to verify your email address!"
      );
      formRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    //first validate
    const result = newItemValidation(values);
    if (result !== "passed") {
      //didn't pass validation
      setError(result);
      formRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }
    //all the data to be uploaded to the document (excluding photo stuff)
    const documentData = {
      userId: user.uid,
      username: user.displayName,
      uploadDate: serverTimestamp(),
      title: values.title,
      location: values.location,
      description: values.description,
      geohash: geohashForLocation([values.location.lat, values.location.lng]),
    };

    //show loading
    setLoading("Loading...");
    //then upload photo
    if (values.photoFile) {
      //values.photoFile only exists if new photo is chosen by user
      try {
        const storage = getStorage();
        //create thumbnail
        const uri = await resizeFile(values.photoFile);
        const fileName = `thumb_${values.photo.replace(/\.[^/.]+$/, "")}.png`;
        const thumbRef = ref(storage, `images/${fileName}`);
        //upload thumbnail
        const thumbSnapshot = await uploadString(thumbRef, uri, "data_url");
        documentData.thumb = fileName;
        documentData.thumbUrl = await getDownloadURL(thumbSnapshot.ref);
        //upload main image
        const storageRef = ref(storage, `images/${values.photo}`);
        const snapshot = await uploadBytes(storageRef, values.photoFile);
        documentData.photo = values.photo;
        documentData.photoUrl = await getDownloadURL(snapshot.ref);
      } catch (e) {
        setLoading("");
        setError(`Error uploading image: ${e.code}`);
        return; //do not proceed with document upload if photo upload gave error
      }
    }

    //then upload document either update or create new one
    if (id) {
      //update item form
      try {
        const itemRef = doc(db, "items", id);
        await updateDoc(itemRef, { ...documentData });
        onSuccess();
      } catch (e) {
        setLoading("");
        setError(`Error updating item: ${e}`);
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      //new item form
      try {
        await generateDocument("items", null, documentData);
        onSuccess();
      } catch (e) {
        setLoading("");
        setError(`Error creating new item: ${e.code}`);
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
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
        center={data ? data.location : null}
      />
      {loading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">{loading}</span>
        </Spinner>
      )}
    </div>
  );
}

export default HandleItemForm;
