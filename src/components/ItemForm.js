import React from "react";
import { AiOutlineSend } from "react-icons/ai";
import style from "../styles/NewItemForm.module.scss";
import ImageField from "./ImageField";
import LocationField from "./LocationField";

function ItemForm({
  onSubmit,
  onChange,
  values,
  error,
  success,
  center = null,
}) {
  return (
    <form className={style.form}>
      {success && <div className={style.created}>{success}</div>}
      {error && <div className={style.error}>{error}</div>}
      <label className={style["form-item"]}>
        <p>Title*</p>
        <input
          name="title"
          value={values.title}
          onChange={(e) => {
            onChange({ [e.target.name]: e.target.value });
          }}
          placeholder="Tree in field"
        />
      </label>
      <ImageField
        photo={values.photo}
        photoUrl={values.photoUrl}
        thumb={values.thumb}
        onUploadComplete={(name, url) => {
          onChange({ photo: name, photoUrl: url });
        }}
        onThumbUploadComplete={(name, url) => {
          onChange({ thumb: name, thumbUrl: url });
        }}
        onDelete={() => {
          onChange({
            photo: "",
            photoUrl: "",
            thumbUrl: "",
            thumb: "",
          });
        }}
      />
      <label className={style["form-item"]}>
        <p>Description</p>
        <textarea
          name="description"
          rows="10"
          placeholder="An oak standing in the middle of a field."
          value={values.description}
          onChange={(e) => {
            onChange({ [e.target.name]: e.target.value });
          }}
        />
      </label>
      <LocationField
        loc={values.location}
        onMapClick={(l) => {
          onChange({ location: l });
        }}
        center={center ? center : null}
      />
      <div>
        <button className={style.button} onClick={onSubmit}>
          <AiOutlineSend />
          Submit
        </button>
      </div>
    </form>
  );
}

export default ItemForm;
