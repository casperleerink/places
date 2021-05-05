import React from "react";
import { AiOutlineSend } from "react-icons/ai";
import style from "../styles/NewItemForm.module.scss";
import ImageField from "./ImageField";
import LocationField from "./LocationField";

function ItemForm({ onSubmit, onChange, values, error, center = null }) {
  return (
    <form className={style.form}>
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
        onChange={onChange}
        onPhotoLocation={(l) => {
          onChange({ location: l });
        }}
      />
      <LocationField
        loc={values.location}
        onMapClick={(l) => {
          onChange({ location: l });
        }}
        center={center ? center : null}
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
