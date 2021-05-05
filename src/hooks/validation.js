import { useState, useEffect } from "react";

const UsernameValidation = (username) => {
  const [hasLength, setHasLength] = useState("");

  useEffect(() => {
    setHasLength(username !== "" ? "" : "Username is required");
  }, [username]);
  return hasLength;
};

const EmailValidation = ({ email }) => {
  const [hasLength, setHasLength] = useState(null);
  const [valid, setValid] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setHasLength(email !== "");
    setValid(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    );
  }, [email]);
  useEffect(() => {
    if (!hasLength) {
      setMessage("Email is required");
    } else if (!valid) {
      setMessage("Please enter a valid email address");
    }
    if (hasLength && valid) {
      setMessage("");
    }
  }, [hasLength, valid]);
  return message;
};

const PasswordValidation = ({ firstPass = "", secondPass = "" }) => {
  const [length, setLength] = useState(null);
  const [hasNumber, setHasNumber] = useState(null);
  const [match, setMatch] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLength(firstPass.length >= 8 ? true : false);
    setHasNumber(/\d/.test(firstPass));
    setMatch(firstPass && firstPass === secondPass);
  }, [firstPass, secondPass]);

  useEffect(() => {
    if (!length || !hasNumber) {
      setMessage(
        "Passwords must contain at least 1 number and must be 8 characters long."
      );
    } else if (!match) {
      setMessage("Passwords don't match");
    }
    if (length && hasNumber && match) {
      setMessage("");
    }
  }, [length, hasNumber, match]);

  return message;
};

export const signUpValidation = {
  Username: UsernameValidation,
  Email: EmailValidation,
  Password: PasswordValidation,
};

export const imageValidation = (file) => {
  if (file === "" || file.type.match(/image\/.+/) === null) {
    return "Not the correct filetype, please upload an image JPG or PNG";
  }
  if (file.size > 2097152) {
    return "Image size exceeds maximum file size of 2MB";
  }
  return "passed";
};

export const newItemValidation = (values) => {
  const { title, photo, location } = values;
  if (!title) {
    return "Please fill in a title for your photo.";
  }
  if (!photo) {
    return "Please upload a photo before submitting.";
  }
  if (!location) {
    return "Please choose a location where the photo was taken by clicking on the map.";
  }

  return "passed";
};

export const useSameEmailValidation = (email1, email2) => {
  const [valid, setValid] = useState(true);
  useEffect(() => {
    email1 === email2 ? setValid(true) : setValid(false);
  }, [email1, email2]);

  return valid;
};
