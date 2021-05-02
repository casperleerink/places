import React, { useContext } from "react";
import AccountMenu from "./AccountMenu";
import { UserContext } from "./UserContext";
import LogInOrSignUp from "./LogInOrSignUp";

function UserCheck() {
  const { user } = useContext(UserContext);
  return user ? <AccountMenu /> : <LogInOrSignUp />;
}

export default UserCheck;
