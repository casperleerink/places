import React, { useState } from "react";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";
import style from "../styles/Select.module.scss";
function Select({ options, selected, onOptionClicked }) {
  const [show, setShow] = useState(false);
  return (
    <div className={style.container}>
      <button className={style.head} onClick={() => setShow(!show)}>
        {selected.title} {show ? <IoCaretUp /> : <IoCaretDown />}
      </button>
      {show && (
        <ul className={style.options}>
          {options.map((option) => {
            return (
              <li
                onClick={() => {
                  onOptionClicked(option);
                  setShow(false);
                }}
                key={option.name}
                className={
                  selected && selected.name === option.name
                    ? style.selected
                    : ""
                }
              >
                {option.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Select;
