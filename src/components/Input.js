import React from "react";

function Input({
  label,
  type,
  name,
  handleChange,
  touched,
  value,
  error = "",
  placeholder = "",
  className = "",
  errorClass = "",
}) {
  return (
    <div className={className}>
      <label>
        <p>{label}</p>
        <input
          type={type}
          value={value}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          className={error ? errorClass : ""}
        />
      </label>
      {touched && error ? (
        <p style={{ backgroundColor: "rgba(255, 42, 42, 0.2)" }}>{error}</p>
      ) : (
        ""
      )}
    </div>
  );
}

export default Input;
