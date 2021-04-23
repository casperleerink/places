import React, { useState } from "react";
import { signUp } from "../hooks/firebase";
import { signUpValidation } from "../hooks/validation";
import Input from "./Input";
import style from "../styles/SignUp.module.scss";
const SignUp = () => {
  const [signUpDetails, setSignUpDetails] = useState({
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    passwordCheck: false,
  });
  const [error, setError] = useState(null);

  const nameValid = signUpValidation.Username({
    username: signUpDetails.username,
  });
  const emailValid = signUpValidation.Email({
    email: signUpDetails.email,
  });
  const passwordValid = signUpValidation.Password({
    firstPass: signUpDetails.password,
    secondPass: signUpDetails.passwordCheck,
  });
  const createUserHandler = async (event) => {
    event.preventDefault();
    if (!nameValid && !emailValid && !passwordValid) {
      try {
        await signUp(
          signUpDetails.email,
          signUpDetails.password,
          signUpDetails.username
        );
        setSignUpDetails({
          username: "",
          email: "",
          password: "",
          passwordCheck: "",
        });
        setTouched({
          username: false,
          email: false,
          password: false,
          passwordCheck: false,
        });
      } catch (e) {
        setError(`Error signing up: ${e.code}`);
      }
    } else {
      if (passwordValid) {
        setError(passwordValid);
      }
      if (emailValid) {
        setError(emailValid);
      }
      if (nameValid) {
        setError(nameValid);
      }
    }
  };
  const onChangeHandler = (e) => {
    setSignUpDetails({ ...signUpDetails, [e.target.name]: e.target.value });
    if (touched[e.target.name] === false) {
      setTouched({ ...touched, [e.target.name]: true });
    }
  };
  return (
    <div className={style.container}>
      {error && <div className={style.error}>{error}</div>}
      <form className={style["form-container"]}>
        <Input
          type="text"
          name="username"
          value={signUpDetails.username}
          placeholder="Sir David Attenborough"
          handleChange={onChangeHandler}
          label="Username*"
          touched={touched.username}
          error={nameValid}
          className={style["form-item"]}
          errorClass={style["input-error"]}
        />
        <Input
          type="email"
          name="email"
          value={signUpDetails.email}
          placeholder="name@youareawesome.com"
          handleChange={onChangeHandler}
          label="Email*"
          touched={touched.email}
          error={emailValid}
          className={style["form-item"]}
          errorClass={style["input-error"]}
        />
        <Input
          type="password"
          name="password"
          value={signUpDetails.password}
          handleChange={onChangeHandler}
          label="Password*"
          touched={touched.password}
          error={passwordValid}
          className={style["form-item"]}
          errorClass={style["input-error"]}
          placeholder="••••••••"
        />
        <Input
          type="password"
          name="passwordCheck"
          value={signUpDetails.passwordCheck}
          handleChange={onChangeHandler}
          label="Password Check*"
          touched={touched.passwordCheck}
          className={style["form-item"]}
          placeholder="••••••••"
        />
        <div>
          <button onClick={createUserHandler} className={style.button}>
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};
export default SignUp;
