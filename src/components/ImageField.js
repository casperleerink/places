import React, { useState } from "react";
// import Resizer from "react-image-file-resizer";
// import { deleteImage } from "../hooks/firebase";
// import {
//   getStorage,
//   ref,
//   uploadString,
//   uploadBytes,
//   getDownloadURL,
// } from "firebase/storage";
import { v4 as uuid } from "uuid";

import Dropfile from "./Dropfile";
import style from "../styles/ImageField.module.scss";
import { AiOutlineFolderOpen } from "react-icons/ai";
// import { IoClose } from "react-icons/io5";
import exifr from "exifr/dist/full.esm.mjs";
// import { confirmAlert } from "react-confirm-alert";
import { imageValidation } from "../hooks/validation";
function ImageField({ photo, photoUrl, onDelete, onChange, onPhotoLocation }) {
  const [error, setError] = useState("");

  const handleChange = async (file) => {
    //validation
    const validation = imageValidation(file);
    if (validation !== "passed") {
      setError(validation);
      return;
    }
    const url = URL.createObjectURL(file);
    const fileName = `${uuid()}.${file.name.split(".").pop()}`;
    onChange({
      photo: fileName,
      photoUrl: url,
      photoFile: file,
    });
    try {
      const location = await exifr.gps(file);
      if (location) {
        onPhotoLocation({ lat: location.latitude, lng: location.longitude });
      }
    } catch (e) {
      setError(`An error occured getting image location: ${e}`);
    }
  };
  // //main function uploading the files
  // const handleUpload = async (file) => {
  //   //validation
  //   if (file === "" || file.type.match(/image\/.+/) === null) {
  //     setError("Not the correct filetype, please upload an image JPG or PNG");
  //     return;
  //   }
  //   if (file.size > 2097152) {
  //     setError("Image size exceeds maximum file size of 2MB");
  //     return;
  //   }
  //   //delete old image if extists
  //   if (photo) {
  //     try {
  //       await deleteImage(photo);
  //       console.log("image deleted!");
  //     } catch (e) {
  //       setError(`An error occured: ${e.code}`);
  //       return;
  //     }
  //   }
  //   if (thumb) {
  //     try {
  //       await deleteImage(photo);
  //       console.log("image deleted!");
  //     } catch (e) {
  //       setError(`An error occured: ${e.code}`);
  //       return;
  //     }
  //   }
  //   try {
  //     const storage = getStorage();
  //     const uniqueName = uuid();
  //     //create thumbnail
  //     Resizer.imageFileResizer(file, 30, 30, "PNG", 100, 0, async (uri) => {
  //       const fileName = `thumb_${uniqueName}.png`;
  //       const storageRef = ref(storage, `images/${fileName}`);
  //       const snapshot = await uploadString(storageRef, uri, "data_url");
  //       const downloadURL = await getDownloadURL(snapshot.ref);
  //       onThumbUploadComplete(fileName, downloadURL);
  //     });
  //     //upload main image
  //     const fileName = `${uniqueName}.${file.name.split(".").pop()}`;
  //     const storageRef = ref(storage, `images/${fileName}`);
  //     const snapshot = await uploadBytes(storageRef, file);
  //     const downloadURL = await getDownloadURL(snapshot.ref);
  //     setError("");
  //     onUploadComplete(fileName, downloadURL);
  //     const location = await exifr.gps(file);
  //     if (location) {
  //       onPhotoLocation({ lat: location.latitude, lng: location.longitude });
  //     }
  //   } catch (err) {
  //     setError(`Error uploading image: ${err}`);
  //   }
  // }; //close handleFile

  // const deleteUpload = () => {
  //   if (photo) {
  //     confirmAlert({
  //       customUI: ({ onClose }) => {
  //         return (
  //           <div className={style["confirm-container"]}>
  //             <h1>Are you sure?</h1>
  //             <p>You want to delete this photo?</p>
  //             <button onClick={onClose}>Cancel</button>
  //             <button
  //               onClick={async () => {
  //                 try {
  //                   await deleteImage(photo);
  //                   onDelete && onDelete();
  //                 } catch (e) {
  //                   setError(`An error occured: ${e.code}`);
  //                   return;
  //                 }
  //                 onClose();
  //               }}
  //             >
  //               Delete
  //             </button>
  //           </div>
  //         );
  //       },
  //     });
  //   }
  // };
  return (
    <Dropfile callback={handleChange}>
      {error && <p>{error}</p>}
      <div className={style.dropContainer}>
        <p>Drop image here*</p>
        <em>or</em>
        <label>
          <input
            name="image"
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => handleChange(e.target.files[0])}
          />
          <AiOutlineFolderOpen />
          Browse...
        </label>
        {photoUrl && (
          <div className={style.image}>
            <img src={photoUrl} alt="your upload" />
            {/* <IoClose onClick={deleteUpload} className={style.deleteIcon} /> */}
          </div>
        )}
      </div>
    </Dropfile>
  );
}

export default ImageField;
