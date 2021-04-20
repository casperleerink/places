import React, { useState } from "react";
import Dropfile from "./Dropfile";

function NewItemForm() {
  const [formValues, setFormValues] = useState({
    title: "",
    photo: "",
    description: "",
  });
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const handleFile = (file) => {
    console.log(file);
  };
  return (
    <form>
      <label>
        Title
        <input
          name="title"
          value={formValues.title}
          onChange={handleChange}
          placeholder="descriptive or poëtic?"
        />
      </label>
      <Dropfile callback={handleFile}>
        <div>Drop an image here! (show image when it is dropped here!)</div>
      </Dropfile>
      <label>
        Description
        <textarea
          name="description"
          rows="10"
          value={formValues.description}
          onChange={handleChange}
        />
      </label>
    </form>
  );
}

export default NewItemForm;
