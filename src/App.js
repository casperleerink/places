import React from "react";
import style from "./styles/App.module.css";
import NewItemForm from "./components/NewItemForm";
function App() {
  return (
    <div className={style.app}>
      <NewItemForm />
    </div>
  );
}

export default App;
