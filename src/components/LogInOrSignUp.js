import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import style from "../styles/LogInOrSignUp.module.scss";
import ForgotPassword from "./ForgotPassword";
function LogInOrSignUp() {
  const [action, setAction] = useState("login");
  return (
    <div className={style.container}>
      <h1>
        {action === "login" && "Welcome!"}
        {action === "signup" && "Another Internet Account??"}
        {action === "passwordReset" && "Reset your password"}
      </h1>
      <p>
        {action === "login" && "If you have an account, login here"}
        {action === "signup" && "I promise, no emails from me!"}
        {action === "passwordReset" && "'For one to grow, one has to forget.'"}
      </p>
      {action === "login" && <SignIn />}
      {action === "signup" && <SignUp />}
      {action === "passwordReset" && <ForgotPassword />}
      <div className={style["button-container"]}>
        <button
          onClick={() => setAction(action === "login" ? "signup" : "login")}
        >
          {action === "login" && "Or create a new account"}
          {action === "signup" && "I already have an account"}
          {action === "passwordReset" && "Back to login"}
        </button>
        {action !== "passwordReset" && (
          <button
            className={style["reset-password"]}
            onClick={() => setAction("passwordReset")}
          >
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
}

export default LogInOrSignUp;
