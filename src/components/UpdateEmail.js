import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import Input from "./Input";
import { useSameEmailValidation } from "../hooks/validation";
function UpdateEmail(onSuccess) {
  const user = useContext(UserContext);
  const [values, setValues] = useState({
    new1: "",
    new2: "",
  });
  const [error, setError] = useState("");
  const valid = useSameEmailValidation(values.new1, values.new2);
  const handleChange = (e) => {
    setValues((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!valid) {
      setError("Emails must match");
      return;
    }
    if (user) {
      user
        .updateEmail(values.new1)
        .then(() => {
          onSuccess();
        })
        .catch((e) => {
          setError(`An error occured updating your email: ${e}`);
        });
    }
  };
  return (
    <form>
      <Input
        label="New Email"
        type="email"
        name="new1"
        value={values.new1}
        handleChange={handleChange}
        className="replace-this"
      />
      <Input
        label="Retype new Email"
        type="email"
        name="new2"
        value={values.new2}
        handleChange={handleChange}
        className="replace-this"
        error={valid ? null : "Emails don't match"}
      />
      <div>
        <button onClick={onSubmit} className={style.button}>
          Update Email
        </button>
      </div>
    </form>
  );
}

export default UpdateEmail;
