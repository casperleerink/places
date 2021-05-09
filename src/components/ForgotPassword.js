import React, { useState } from "react";
import Input from "./Input";
import { signUpValidation } from "../hooks/validation";
import style from "../styles/SignUp.module.scss";
import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
  });
  const [touched, setTouched] = useState({
    email: false,
  });
  const [error, setError] = useState("");
  const emailValid = signUpValidation.Email({
    email: form.email,
  });
  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (!touched[e.target.name]) {
      setTouched({ ...touched, [e.target.name]: true });
    }
  };

  const sendEmail = async () => {
    if (!emailValid) {
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, form.email);
        console.log("Reset email send!");
      } catch (e) {
        setError(`Error sending email: ${e.code}`);
      }
    } else {
      if (emailValid) {
        setError(emailValid);
      }
    }
  };
  return (
    <div className={style.container}>
      {error && <div className={style.error}>{error}</div>}
      <Input
        type="email"
        name="email"
        value={form.email}
        placeholder="name@youareawesome.com"
        handleChange={onChangeHandler}
        label="Email*"
        touched={touched}
        error={emailValid}
        className={style["form-item"]}
        errorClass={style["input-error"]}
      />
      <div>
        <button onClick={sendEmail} className={style.button}>
          Send reset password email
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
