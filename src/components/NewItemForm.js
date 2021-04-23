import React, { useState } from "react";
import Dropfile from "./Dropfile";
import style from "../styles/NewItemForm.module.scss";
import { uploadImage, deleteImage } from "../hooks/firebase";
import { getDownloadURL } from "firebase/storage";

function NewItemForm() {
  const [formValues, setFormValues] = useState({
    title: "",
    photo: "",
    photoUrl: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const handleFile = async (file) => {
    if (file === "" || file.type.match(/image\/.+/) === null) {
      setError("Not the correct filetype, please upload an image JPG or PNG");
      return;
    }
    if (file.size > 2097152) {
      setError("Image size exceeds maximum file size of 2MB");
      return;
    }
    if (formValues.photo) {
      try {
        await deleteImage(formValues.photo);
        console.log("image deleted!");
      } catch (e) {
        setError(`An error occured: ${e.code}`);
        return;
      }
    }
    const { uploadTask, fileName } = uploadImage(file);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setUploadProgress(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        setError(`Error uploading image ${error.code}`);
      },
      () => {
        // Handle successful uploads on complete
        setUploadProgress(null); //reset progress text
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormValues({
            ...formValues,
            photoUrl: downloadURL,
            photo: fileName,
          });
        });
      }
    ); //close onstate callback
  }; //close handleFile

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className={style.form}>
      {error ? <div>{error}</div> : ""}
      <label className={style["form-item"]}>
        <p>Title</p>
        <input
          name="title"
          value={formValues.title}
          onChange={handleChange}
          placeholder="Tree in field"
        />
      </label>
      <Dropfile callback={handleFile}>
        <div className={style.dropContainer}>
          <p>Drop image here</p>
          <em>or</em>
          <label>
            <input
              name="image"
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            Browse...
          </label>
          {uploadProgress && <p>{`Uploading... ${uploadProgress}%`}</p>}
          {formValues.photoUrl && (
            <div className={style.image}>
              <img src={formValues.photoUrl} alt="upload" />
            </div>
          )}
        </div>
      </Dropfile>
      <label className={style["form-description"]}>
        <p>Description</p>
        <textarea
          name="description"
          rows="10"
          placeholder="An oak standing in the middle of a field."
          value={formValues.description}
          onChange={handleChange}
        />
      </label>
      <div>
        <button className={style.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </form>
  );
}

export default NewItemForm;
