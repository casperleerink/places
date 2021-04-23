import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import style from "../styles/LogInOrSignUp.module.scss";
function LogInOrSignUp() {
  const [hasAccount, setHasAccount] = useState(true);
  return (
    <div className={style.container}>
      <h1>Another Internet Account??</h1>
      <p>(You will receive NO emails from me!)</p>
      {hasAccount ? <SignIn /> : <SignUp />}
      <div className={style["button-container"]}>
        <button onClick={() => setHasAccount(!hasAccount)}>
          {hasAccount ? "Or create a new account" : "I already have an account"}
        </button>
      </div>
    </div>
  );
}

export default LogInOrSignUp;
