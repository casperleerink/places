import React, { useState } from "react";
import { signIn } from "../hooks/firebase";
import style from "../styles/SignIn.module.scss";

const SignIn = () => {
  const [logDetails, setLogDetails] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  //on submit...
  const signInHandler = async (event) => {
    event.preventDefault();
    try {
      await signIn(logDetails.email, logDetails.password);
    } catch (e) {
      //show error
      if (e.code === "auth/user-not-found") {
        //in case email not found
        setError(
          `We cannot find this account, try a different email or sign up for a new account.`
        );
      } else if (e.code === "auth/wrong-password") {
        setError(`Uh oh! That seems to be the wrong password 😬`);
      } else {
        //all other errors
        setError(`An error occured while signing in: ${e.message}`);
      }
    }
  };

  const onChangeHandler = (e) => {
    setLogDetails({ ...logDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className={style.container}>
      {error && <div className={style.error}>{error}</div>}
      <form className={style.form}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={logDetails.email}
            placeholder="name@youareawesome.com"
            onChange={onChangeHandler}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={logDetails.password}
            placeholder="••••••••"
            onChange={onChangeHandler}
          />
        </label>
        <div>
          <button onClick={signInHandler} className={style.button}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
export default SignIn;
