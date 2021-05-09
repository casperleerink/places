import React, { useState } from "react";
import { GoSearch } from "react-icons/go";
import style from "../styles/Search.module.scss";
import Select from "./Select";

const options = [
  { name: "title", title: "Title" },
  { name: "username", title: "Owner" },
  { name: "description", title: "Description" },
];

function Search({ onChange, value, handleSearchBy }) {
  const [show, setShow] = useState(false);
  const [option, setOption] = useState(options[0]);
  return (
    <div className={style.container}>
      <GoSearch
        onClick={() => {
          setShow(!show);
          onChange("");
          handleSearchBy("title");
          setOption(options[0]);
        }}
        className={style.icon}
      />
      <div className={`${style.form} ${show ? style.show : ""}`}>
        <input
          type="text"
          name="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        <Select
          options={options}
          selected={option}
          onOptionClicked={(o) => {
            setOption(o);
            handleSearchBy(o.name);
          }}
        />
      </div>
    </div>
  );
}

export default Search;
